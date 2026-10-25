import { completeChain } from './chain.js';
import { messageOf } from './run.js';
import { USER_AGENT } from './user-agent.js';

export { USER_AGENT };

const TIMEOUT_MS = 10_000;
const LEAF_SIGNATURE_ERROR = 'UNABLE_TO_VERIFY_LEAF_SIGNATURE';
const chainAttemptedHosts = new Set<string>();

function send(url: string, init: RequestInit): Promise<Response> {
  const headers = new Headers(init.headers);
  headers.set('user-agent', USER_AGENT);
  return fetch(url, { ...init, headers, signal: AbortSignal.timeout(TIMEOUT_MS) });
}

function isLeafSignatureError(error: unknown): error is Error {
  return (
    error instanceof Error &&
    error.cause instanceof Error &&
    'code' in error.cause &&
    error.cause.code === LEAF_SIGNATURE_ERROR
  );
}

async function sendWithChainCompletion(url: string, init: RequestInit): Promise<Response> {
  try {
    return await send(url, init);
  } catch (error) {
    if (!isLeafSignatureError(error)) throw error;
    const { hostname } = new URL(url);
    if (chainAttemptedHosts.has(hostname)) throw error;
    chainAttemptedHosts.add(hostname);
    try {
      await completeChain(hostname);
    } catch (reason) {
      throw new Error(`${error.message}: ${LEAF_SIGNATURE_ERROR}; 체인 보완 실패: ${messageOf(reason)}`);
    }
    return send(url, init);
  }
}

export async function fetchText(url: string, init: RequestInit = {}): Promise<string> {
  const res = await sendWithChainCompletion(url, init);
  if (!res.ok) throw new Error(`HTTP ${res.status} ${url}`);
  return res.text();
}
