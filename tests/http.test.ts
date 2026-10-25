import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { completeChain } from '../src/chain.js';
import { USER_AGENT, fetchText } from '../src/http.js';

vi.mock('../src/chain.js');

beforeEach(() => {
  vi.mocked(completeChain).mockReset();
});
afterEach(() => vi.unstubAllGlobals());

function leafSignatureError(): Error {
  return new Error('fetch failed', {
    cause: Object.assign(new Error('unable to verify the first certificate'), {
      code: 'UNABLE_TO_VERIFY_LEAF_SIGNATURE',
    }),
  });
}

function stubFetchSequence(...results: (Response | Error)[]) {
  const fetchMock = vi.fn(async (_url: string, _init: RequestInit) => {
    const next = results.shift();
    if (next === undefined) throw new Error('unexpected fetch call');
    if (next instanceof Error) throw next;
    return next;
  });
  vi.stubGlobal('fetch', fetchMock);
  return fetchMock;
}

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

  it('completes the chain once and retries after a leaf signature failure', async () => {
    vi.mocked(completeChain).mockResolvedValue();
    const fetchMock = stubFetchSequence(leafSignatureError(), new Response('after'));
    await expect(fetchText('https://retry.test/list?page=1')).resolves.toBe('after');
    expect(completeChain).toHaveBeenCalledTimes(1);
    expect(completeChain).toHaveBeenCalledWith('retry.test');
    expect(fetchMock).toHaveBeenCalledTimes(2);
    const [first, second] = fetchMock.mock.calls;
    expect(second![0]).toBe(first![0]);
    expect(new Headers(second![1].headers).get('user-agent')).toBe(USER_AGENT);
    expect(second![1].signal).toBeInstanceOf(AbortSignal);
    expect(second![1].signal).not.toBe(first![1].signal);
  });

  it('does not complete the chain for other errors', async () => {
    const error = new Error('fetch failed', { cause: Object.assign(new Error('refused'), { code: 'ECONNREFUSED' }) });
    const fetchMock = stubFetchSequence(error);
    await expect(fetchText('https://other-error.test/list')).rejects.toBe(error);
    expect(completeChain).not.toHaveBeenCalled();
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it('does not complete the chain for a plain error without a cause', async () => {
    const error = new Error('boom');
    stubFetchSequence(error);
    await expect(fetchText('https://plain-error.test/list')).rejects.toBe(error);
    expect(completeChain).not.toHaveBeenCalled();
  });

  it('shows both the original code and the completion reason when completion fails', async () => {
    vi.mocked(completeChain).mockRejectedValue(new Error('AIA 주소가 없다'));
    const fetchMock = stubFetchSequence(leafSignatureError());
    const error = await fetchText('https://completion-fails.test/list').catch((e: unknown) => e);
    expect(error).toBeInstanceOf(Error);
    expect((error as Error).message).toBe(
      'fetch failed: UNABLE_TO_VERIFY_LEAF_SIGNATURE; 체인 보완 실패: AIA 주소가 없다',
    );
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it('does not complete the chain twice for the same host', async () => {
    vi.mocked(completeChain).mockResolvedValue();
    const stillFailing = leafSignatureError();
    const again = leafSignatureError();
    const fetchMock = stubFetchSequence(leafSignatureError(), stillFailing, again);
    await expect(fetchText('https://still-failing.test/a')).rejects.toBe(stillFailing);
    await expect(fetchText('https://still-failing.test/b')).rejects.toBe(again);
    expect(completeChain).toHaveBeenCalledTimes(1);
    expect(fetchMock).toHaveBeenCalledTimes(3);
  });

  it('does not retry a host whose completion already failed', async () => {
    vi.mocked(completeChain).mockRejectedValue(new Error('nope'));
    const second = leafSignatureError();
    stubFetchSequence(leafSignatureError(), second);
    await expect(fetchText('https://failed-once.test/a')).rejects.toThrow(/체인 보완 실패: nope/);
    await expect(fetchText('https://failed-once.test/b')).rejects.toBe(second);
    expect(completeChain).toHaveBeenCalledTimes(1);
  });
});
