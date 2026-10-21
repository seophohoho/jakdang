import dns from 'node:dns';
import net from 'node:net';
import { Agent, fetch as undiciFetch } from 'undici';

export const DEFAULT_TIMEOUT_MS = 10_000;
export const DEFAULT_MAX_BYTES = 2 * 1024 * 1024;
export const DEFAULT_MIN_INTERVAL_MS = 1_000;
export const DEFAULT_MAX_CONCURRENCY = 3;
export const DEFAULT_MAX_REDIRECTS = 5;
export const USER_AGENT = 'Mozilla/5.0 (compatible; jakdang-event-bot/0.1; personal developer event notifier)';

export type FetchErrorKind = 'blocked' | 'timeout' | 'too_large' | 'network' | 'redirect';

export class FetchError extends Error {
  constructor(
    public readonly kind: FetchErrorKind,
    message: string,
  ) {
    super(message);
    this.name = 'FetchError';
  }
}

const V4_BLOCKS: Array<[string, number]> = [
  ['0.0.0.0', 8],
  ['10.0.0.0', 8],
  ['100.64.0.0', 10],
  ['127.0.0.0', 8],
  ['169.254.0.0', 16],
  ['172.16.0.0', 12],
  ['192.0.0.0', 24],
  ['192.0.2.0', 24],
  ['192.168.0.0', 16],
  ['198.18.0.0', 15],
  ['198.51.100.0', 24],
  ['203.0.113.0', 24],
  ['224.0.0.0', 4],
  ['240.0.0.0', 4],
];

const V6_BLOCKS: Array<[string, number]> = [
  ['::', 128],
  ['::1', 128],
  ['100::', 64],
  ['2001:db8::', 32],
  ['fc00::', 7],
  ['fe80::', 10],
  ['ff00::', 8],
];

const blockList = new net.BlockList();
for (const [address, prefix] of V4_BLOCKS) blockList.addSubnet(address, prefix, 'ipv4');
for (const [address, prefix] of V6_BLOCKS) blockList.addSubnet(address, prefix, 'ipv6');

function embeddedIpv4(address: string): string | null {
  const lower = address.toLowerCase();
  const dotted = lower.match(/^(?:::ffff:|64:ff9b::)(\d+\.\d+\.\d+\.\d+)$/);
  if (dotted?.[1]) return dotted[1];
  const hex = lower.match(/^(?:::ffff:|64:ff9b::)([0-9a-f]{1,4}):([0-9a-f]{1,4})$/);
  if (hex?.[1] && hex[2]) {
    const high = Number.parseInt(hex[1], 16);
    const low = Number.parseInt(hex[2], 16);
    return `${high >> 8}.${high & 255}.${low >> 8}.${low & 255}`;
  }
  return null;
}

export function isBlockedAddress(address: string): boolean {
  const bare = address.replace(/^\[|\]$/g, '');
  const family = net.isIP(bare);
  if (family === 4) return blockList.check(bare, 'ipv4');
  if (family === 6) {
    const v4 = embeddedIpv4(bare);
    if (v4 !== null) return blockList.check(v4, 'ipv4');
    return blockList.check(bare, 'ipv6');
  }
  return true;
}

type LookupCallback = (error: NodeJS.ErrnoException | null, address: string | dns.LookupAddress[], family?: number) => void;
type LookupFunction = (hostname: string, options: dns.LookupOptions, callback: LookupCallback) => void;

export function createSafeLookup(resolve: LookupFunction = dns.lookup as unknown as LookupFunction): LookupFunction {
  return (hostname, options, callback) => {
    resolve(hostname, { ...options, all: true }, (error, addresses) => {
      if (error) {
        callback(error, '');
        return;
      }
      const list = (Array.isArray(addresses) ? addresses : [{ address: addresses, family: 4 }]) as dns.LookupAddress[];
      if (list.length === 0 || list.some((entry) => isBlockedAddress(entry.address))) {
        const blocked = new Error(`사설·예약 주소로 연결하려는 요청을 차단했습니다: ${hostname}`) as NodeJS.ErrnoException;
        blocked.code = 'EJAKDANG_BLOCKED';
        callback(blocked, '');
        return;
      }
      if (options.all) {
        callback(null, list);
        return;
      }
      const first = list[0] as dns.LookupAddress;
      callback(null, first.address, first.family);
    });
  };
}

export interface HttpResponseLike {
  status: number;
  headers: { get(name: string): string | null };
  body: ReadableStream<Uint8Array> | null;
}

export interface FetchInit {
  method: 'GET';
  headers: Record<string, string>;
  redirect: 'manual';
  signal: AbortSignal;
}

export type FetchImpl = (url: string, init: FetchInit) => Promise<HttpResponseLike>;

let sharedAgent: Agent | undefined;

function defaultFetchImpl(): FetchImpl {
  sharedAgent ??= new Agent({ connect: { lookup: createSafeLookup() as never }, connections: DEFAULT_MAX_CONCURRENCY });
  const agent = sharedAgent;
  return async (url, init) => {
    const response = await undiciFetch(url, { ...init, dispatcher: agent });
    return response as unknown as HttpResponseLike;
  };
}

export interface FetchRequest {
  url: string;
  allowedHosts: readonly string[];
  timeoutMs?: number;
  maxBytes?: number;
  minIntervalMs?: number;
  etag?: string | null;
  lastModified?: string | null;
}

export interface FetchedPage {
  status: number;
  url: string;
  body: string;
  etag: string | null;
  lastModified: string | null;
  contentType: string | null;
}

export interface Fetcher {
  get(request: FetchRequest): Promise<FetchedPage>;
}

export interface FetcherOptions {
  fetchImpl?: FetchImpl;
  now?: () => number;
  sleep?: (ms: number) => Promise<void>;
  maxConcurrency?: number;
  maxRedirects?: number;
}

export function assertAllowedUrl(raw: string, allowedHosts: readonly string[]): URL {
  let url: URL;
  try {
    url = new URL(raw);
  } catch {
    throw new FetchError('blocked', `URL을 해석할 수 없습니다: ${raw}`);
  }
  if (url.protocol !== 'http:' && url.protocol !== 'https:') {
    throw new FetchError('blocked', `HTTP(S)가 아닌 주소입니다: ${url.protocol}`);
  }
  if (url.username || url.password) throw new FetchError('blocked', '계정 정보가 들어간 URL은 허용하지 않습니다');
  const host = url.hostname.toLowerCase();
  if (!allowedHosts.map((allowed) => allowed.toLowerCase()).includes(host)) {
    throw new FetchError('blocked', `허용되지 않은 호스트입니다: ${host}`);
  }
  if (net.isIP(host.replace(/^\[|\]$/g, '')) !== 0 && isBlockedAddress(host)) {
    throw new FetchError('blocked', `사설·예약 주소입니다: ${host}`);
  }
  return url;
}

function charsetOf(contentType: string | null): string {
  const match = contentType?.match(/charset=["']?([\w-]+)/i);
  return match?.[1]?.toLowerCase() ?? 'utf-8';
}

async function readLimited(response: HttpResponseLike, maxBytes: number): Promise<Uint8Array> {
  const declared = Number(response.headers.get('content-length') ?? '');
  if (Number.isFinite(declared) && declared > maxBytes) {
    throw new FetchError('too_large', `응답이 ${maxBytes}바이트 한도를 넘습니다`);
  }
  if (!response.body) return new Uint8Array();
  const reader = response.body.getReader();
  const chunks: Uint8Array[] = [];
  let total = 0;
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    total += value.byteLength;
    if (total > maxBytes) {
      await reader.cancel().catch(() => {});
      throw new FetchError('too_large', `응답이 ${maxBytes}바이트 한도를 넘습니다`);
    }
    chunks.push(value);
  }
  const merged = new Uint8Array(total);
  let offset = 0;
  for (const chunk of chunks) {
    merged.set(chunk, offset);
    offset += chunk.byteLength;
  }
  return merged;
}

class Semaphore {
  private active = 0;
  private readonly waiters: Array<() => void> = [];

  constructor(private readonly limit: number) {}

  async acquire(): Promise<void> {
    if (this.active < this.limit) {
      this.active += 1;
      return;
    }
    await new Promise<void>((resolve) => this.waiters.push(resolve));
    this.active += 1;
  }

  release(): void {
    this.active -= 1;
    this.waiters.shift()?.();
  }
}

function classifyNetworkError(error: unknown, timedOut: boolean): FetchError {
  if (error instanceof FetchError) return error;
  if (timedOut) return new FetchError('timeout', '요청 시간이 초과됐습니다');
  const cause = (error as { cause?: { code?: string; message?: string } })?.cause;
  if (cause?.code === 'EJAKDANG_BLOCKED') return new FetchError('blocked', cause.message ?? '차단된 주소입니다');
  const message = cause?.message ?? (error instanceof Error ? error.message : String(error));
  return new FetchError('network', `네트워크 오류: ${message}`);
}

export function createFetcher(options: FetcherOptions = {}): Fetcher {
  const fetchImpl = options.fetchImpl ?? defaultFetchImpl();
  const now = options.now ?? Date.now;
  const sleep = options.sleep ?? ((ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms)));
  const semaphore = new Semaphore(options.maxConcurrency ?? DEFAULT_MAX_CONCURRENCY);
  const maxRedirects = options.maxRedirects ?? DEFAULT_MAX_REDIRECTS;
  const hostChains = new Map<string, Promise<void>>();
  const lastRequestAt = new Map<string, number>();

  async function throttled<T>(host: string, minIntervalMs: number, task: () => Promise<T>): Promise<T> {
    const previous = hostChains.get(host) ?? Promise.resolve();
    let release!: () => void;
    const current = new Promise<void>((resolve) => {
      release = resolve;
    });
    const chained = previous.then(() => current);
    hostChains.set(host, chained);
    await previous;
    try {
      const last = lastRequestAt.get(host);
      if (last !== undefined) {
        const wait = last + minIntervalMs - now();
        if (wait > 0) await sleep(wait);
      }
      await semaphore.acquire();
      try {
        return await task();
      } finally {
        semaphore.release();
        lastRequestAt.set(host, now());
      }
    } finally {
      release();
      if (hostChains.get(host) === chained) hostChains.delete(host);
    }
  }

  return {
    async get(request) {
      const timeoutMs = request.timeoutMs ?? DEFAULT_TIMEOUT_MS;
      const maxBytes = request.maxBytes ?? DEFAULT_MAX_BYTES;
      const minIntervalMs = Math.max(request.minIntervalMs ?? DEFAULT_MIN_INTERVAL_MS, DEFAULT_MIN_INTERVAL_MS);
      if (timeoutMs <= 0) throw new FetchError('timeout', '남은 작업 시간이 없어 요청하지 않았습니다');
      const deadline = now() + timeoutMs;
      let target = assertAllowedUrl(request.url, request.allowedHosts);
      for (let hop = 0; hop <= maxRedirects; hop += 1) {
        const remaining = deadline - now();
        if (remaining <= 0) throw new FetchError('timeout', '요청 시간이 초과됐습니다');
        const headers: Record<string, string> = {
          'user-agent': USER_AGENT,
          accept: 'text/html,application/xhtml+xml,application/rss+xml,application/xml;q=0.9,*/*;q=0.5',
        };
        if (hop === 0 && request.etag) headers['if-none-match'] = request.etag;
        if (hop === 0 && request.lastModified) headers['if-modified-since'] = request.lastModified;
        const current = target;
        const result = await throttled(current.hostname, minIntervalMs, async () => {
          const controller = new AbortController();
          let timedOut = false;
          const timer = setTimeout(() => {
            timedOut = true;
            controller.abort();
          }, Math.max(1, deadline - now()));
          try {
            const response = await fetchImpl(current.toString(), {
              method: 'GET',
              headers,
              redirect: 'manual',
              signal: controller.signal,
            });
            if (response.status >= 300 && response.status < 400 && response.status !== 304) {
              await response.body?.cancel().catch(() => {});
              return { kind: 'redirect' as const, location: response.headers.get('location') };
            }
            const bytes = response.status === 304 ? new Uint8Array() : await readLimited(response, maxBytes);
            return { kind: 'response' as const, response, bytes };
          } catch (error) {
            throw classifyNetworkError(error, timedOut);
          } finally {
            clearTimeout(timer);
          }
        });
        if (result.kind === 'redirect') {
          if (!result.location) throw new FetchError('redirect', '리디렉션 위치가 없습니다');
          target = assertAllowedUrl(new URL(result.location, current).toString(), request.allowedHosts);
          continue;
        }
        const contentType = result.response.headers.get('content-type');
        let body: string;
        try {
          body = new TextDecoder(charsetOf(contentType)).decode(result.bytes);
        } catch {
          body = new TextDecoder('utf-8').decode(result.bytes);
        }
        return {
          status: result.response.status,
          url: current.toString(),
          body,
          etag: result.response.headers.get('etag'),
          lastModified: result.response.headers.get('last-modified'),
          contentType,
        };
      }
      throw new FetchError('redirect', `리디렉션이 ${maxRedirects}회를 넘었습니다`);
    },
  };
}
