import { Agent, fetch as undiciFetch } from 'undici';
import type { DestinationId } from '../config.js';
import { redact } from '../log.js';
import { USER_AGENT } from '../collectors/fetch.js';

export const WEBHOOK_TIMEOUT_MS = 10_000;

export type SendOutcome =
  | { kind: 'sent'; remoteMessageId: string | null }
  | { kind: 'rate_limited'; retryAfterMs: number; detail: string }
  | { kind: 'server_error'; status: number; detail: string }
  | { kind: 'rejected'; status: number; detail: string }
  | { kind: 'not_sent'; detail: string }
  | { kind: 'uncertain'; detail: string };

export interface Notifier {
  destinationId: DestinationId;
  send(payload: unknown, options?: { timeoutMs?: number }): Promise<SendOutcome>;
}

export interface WebhookResponse {
  status: number;
  headers: { get(name: string): string | null };
  text(): Promise<string>;
}

export type WebhookTransport = (
  url: string,
  init: { body: string; signal: AbortSignal; headers: Record<string, string> },
) => Promise<WebhookResponse>;

let webhookAgent: Agent | undefined;

export const defaultTransport: WebhookTransport = async (url, init) => {
  webhookAgent ??= new Agent({ connections: 2 });
  const response = await undiciFetch(url, {
    method: 'POST',
    body: init.body,
    headers: init.headers,
    signal: init.signal,
    redirect: 'manual',
    dispatcher: webhookAgent,
  });
  return response as unknown as WebhookResponse;
};

const NOT_SENT_CODES = new Set([
  'ECONNREFUSED',
  'ENOTFOUND',
  'EAI_AGAIN',
  'EHOSTUNREACH',
  'ENETUNREACH',
  'UND_ERR_CONNECT_TIMEOUT',
  'ERR_TLS_CERT_ALTNAME_INVALID',
  'CERT_HAS_EXPIRED',
  'UNABLE_TO_VERIFY_LEAF_SIGNATURE',
  'DEPTH_ZERO_SELF_SIGNED_CERT',
  'SELF_SIGNED_CERT_IN_CHAIN',
]);

function errorCode(error: unknown): string | undefined {
  const direct = (error as { code?: string })?.code;
  const cause = (error as { cause?: { code?: string } })?.cause?.code;
  return cause ?? direct;
}

export function classifyTransportError(error: unknown, timedOut: boolean, secrets: readonly string[]): SendOutcome {
  const code = errorCode(error);
  const message = redact(
    (error as { cause?: { message?: string } })?.cause?.message ?? (error instanceof Error ? error.message : String(error)),
    secrets,
  );
  if (!timedOut && code && NOT_SENT_CODES.has(code)) return { kind: 'not_sent', detail: `연결 전 실패(${code}): ${message}` };
  if (timedOut) return { kind: 'uncertain', detail: '응답 대기 시간 초과: 전달됐는지 알 수 없습니다' };
  return { kind: 'uncertain', detail: `응답 유실(${code ?? 'unknown'}): ${message}` };
}

export function parseRetryAfterMs(header: string | null, now: number = Date.now()): number | null {
  if (header === null || header.trim() === '') return null;
  const seconds = Number(header);
  if (Number.isFinite(seconds) && seconds >= 0) return Math.ceil(seconds * 1000);
  const date = Date.parse(header);
  if (Number.isFinite(date)) return Math.max(0, date - now);
  return null;
}

export const DEFAULT_RATE_LIMIT_DELAY_MS = 60_000;

export interface PostJsonOptions {
  url: string;
  payload: unknown;
  timeoutMs: number;
  transport: WebhookTransport;
  secrets: readonly string[];
}

export interface PostJsonResult {
  outcome: 'response';
  response: WebhookResponse;
  body: string;
}

export async function postJson(options: PostJsonOptions): Promise<PostJsonResult | SendOutcome> {
  const controller = new AbortController();
  let timedOut = false;
  const timer = setTimeout(() => {
    timedOut = true;
    controller.abort();
  }, options.timeoutMs);
  try {
    const response = await options.transport(options.url, {
      body: JSON.stringify(options.payload),
      signal: controller.signal,
      headers: { 'content-type': 'application/json', 'user-agent': USER_AGENT },
    });
    const body = await response.text().catch(() => '');
    return { outcome: 'response', response, body };
  } catch (error) {
    return classifyTransportError(error, timedOut, options.secrets);
  } finally {
    clearTimeout(timer);
  }
}

export function summarizeBody(body: string, secrets: readonly string[]): string {
  return redact(body.replace(/\s+/g, ' ').slice(0, 300), secrets);
}

export function genericOutcome(status: number, body: string, retryAfterMs: number | null, secrets: readonly string[]): SendOutcome {
  const detail = `HTTP ${status} ${summarizeBody(body, secrets)}`.trim();
  if (status === 429) return { kind: 'rate_limited', retryAfterMs: retryAfterMs ?? DEFAULT_RATE_LIMIT_DELAY_MS, detail };
  if (status >= 500) return { kind: 'server_error', status, detail };
  if (status >= 300 && status < 400) return { kind: 'rejected', status, detail: `${detail} (리디렉션 응답은 따라가지 않습니다)` };
  return { kind: 'rejected', status, detail };
}
