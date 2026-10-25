import { afterEach, describe, expect, it, vi } from 'vitest';
import { USER_AGENT, fetchText } from '../src/http.js';

afterEach(() => vi.unstubAllGlobals());

function stubFetch(response: Response) {
  const fetchMock = vi.fn(async (_url: string, _init: RequestInit) => response);
  vi.stubGlobal('fetch', fetchMock);
  return fetchMock;
}

describe('fetchText', () => {
  it('sends the bot user agent', async () => {
    const fetchMock = stubFetch(new Response('hello'));
    await expect(fetchText('https://example.test/list')).resolves.toBe('hello');
    const [url, init] = fetchMock.mock.calls[0]!;
    expect(url).toBe('https://example.test/list');
    expect(new Headers(init.headers).get('user-agent')).toBe(USER_AGENT);
    expect(USER_AGENT).toBe('Mozilla/5.0 (compatible; jakdang-event-bot/0.1; personal developer event notifier)');
  });

  it('keeps caller headers, method and body', async () => {
    const fetchMock = stubFetch(new Response('ok'));
    await fetchText('https://example.test/search', {
      method: 'POST',
      body: 'a=1',
      headers: { 'content-type': 'application/x-www-form-urlencoded' },
    });
    const [, init] = fetchMock.mock.calls[0]!;
    const headers = new Headers(init.headers);
    expect(init.method).toBe('POST');
    expect(init.body).toBe('a=1');
    expect(headers.get('content-type')).toBe('application/x-www-form-urlencoded');
    expect(headers.get('user-agent')).toBe(USER_AGENT);
  });

  it('aborts with a timeout signal', async () => {
    const fetchMock = stubFetch(new Response('ok'));
    await fetchText('https://example.test/list');
    const [, init] = fetchMock.mock.calls[0]!;
    expect(init.signal).toBeInstanceOf(AbortSignal);
  });

  it('throws on non-2xx', async () => {
    stubFetch(new Response('nope', { status: 404 }));
    await expect(fetchText('https://example.test/missing')).rejects.toThrow(/404/);
  });
});
