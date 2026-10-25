export const USER_AGENT = 'Mozilla/5.0 (compatible; jakdang-event-bot/0.1; personal developer event notifier)';

export async function fetchText(url: string, init: RequestInit = {}): Promise<string> {
  const headers = new Headers(init.headers);
  headers.set('user-agent', USER_AGENT);
  const res = await fetch(url, { ...init, headers, signal: AbortSignal.timeout(10_000) });
  if (!res.ok) throw new Error(`HTTP ${res.status} ${url}`);
  return res.text();
}
