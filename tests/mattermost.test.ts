import { afterEach, describe, expect, it, vi } from 'vitest';
import { formatMessage, postMessage } from '../src/mattermost.js';

afterEach(() => vi.unstubAllGlobals());

describe('mattermost', () => {
  it('formatMessage writes the title as h2 and the site and link as list items', () => {
    const item = { id: '111802', title: '현대자동차그룹 차량용 앱 개발 공모전', url: 'https://www.wevity.com/?c=find&s=1&gbn=view&ix=111802' };
    expect(formatMessage('위비티', item)).toBe('## 현대자동차그룹 차량용 앱 개발 공모전\n- 사이트: 위비티\n- 링크: https://www.wevity.com/?c=find&s=1&gbn=view&ix=111802');
  });

  it('postMessage sends the text as JSON to the webhook', async () => {
    const fetchMock = vi.fn(async (_url: string, _init: RequestInit) => new Response('ok'));
    vi.stubGlobal('fetch', fetchMock);
    await postMessage('https://mm.test/hooks/abc', 'hi');
    const [url, init] = fetchMock.mock.calls[0]!;
    expect(url).toBe('https://mm.test/hooks/abc');
    expect(init.method).toBe('POST');
    expect(new Headers(init.headers).get('content-type')).toBe('application/json');
    expect(JSON.parse(String(init.body))).toEqual({ text: 'hi' });
  });

  it('postMessage throws when the webhook answers non-2xx', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => new Response('bad', { status: 502 })));
    await expect(postMessage('https://mm.test/hooks/abc', 'hi')).rejects.toThrow(/502/);
  });
});
