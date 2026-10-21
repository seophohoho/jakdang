import type dns from 'node:dns';
import { describe, expect, it } from 'vitest';
import {
  createFetcher,
  createSafeLookup,
  FetchError,
  isBlockedAddress,
  type FetchImpl,
  type FetchInit,
  type HttpResponseLike,
} from '../../src/collectors/fetch.js';

function response(status: number, body = '', headers: Record<string, string> = {}): HttpResponseLike {
  const lower = Object.fromEntries(Object.entries(headers).map(([key, value]) => [key.toLowerCase(), value]));
  const bytes = new TextEncoder().encode(body);
  return {
    status,
    headers: { get: (name) => lower[name.toLowerCase()] ?? null },
    body: new ReadableStream<Uint8Array>({
      start(controller) {
        if (bytes.byteLength > 0) controller.enqueue(bytes);
        controller.close();
      },
    }),
  };
}

function recordingImpl(handler: (url: string, init: FetchInit) => HttpResponseLike | Promise<HttpResponseLike>) {
  const calls: Array<{ url: string; init: FetchInit }> = [];
  const impl: FetchImpl = async (url, init) => {
    calls.push({ url, init });
    return handler(url, init);
  };
  return { impl, calls };
}

const noWait = { sleep: async () => {} };

describe('isBlockedAddress', () => {
  it.each([
    '127.0.0.1',
    '10.1.2.3',
    '172.16.0.1',
    '192.168.0.10',
    '169.254.169.254',
    '100.64.0.1',
    '0.0.0.0',
    '::1',
    '::',
    'fe80::1',
    'fd00::1',
    '::ffff:127.0.0.1',
    '::ffff:a9fe:a9fe',
    'not-an-ip',
  ])('%s는 차단한다', (address) => {
    expect(isBlockedAddress(address)).toBe(true);
  });

  it.each(['8.8.8.8', '211.249.220.24', '2606:4700::1111'])('%s는 허용한다', (address) => {
    expect(isBlockedAddress(address)).toBe(false);
  });
});

describe('createSafeLookup', () => {
  const fakeResolver =
    (addresses: dns.LookupAddress[]) =>
    (_host: string, _options: dns.LookupOptions, callback: (error: NodeJS.ErrnoException | null, result: dns.LookupAddress[]) => void) =>
      callback(null, addresses);

  it('DNS 결과에 사설 주소가 하나라도 있으면 연결 단계에서 막는다', async () => {
    const lookup = createSafeLookup(
      fakeResolver([
        { address: '93.184.216.34', family: 4 },
        { address: '10.0.0.5', family: 4 },
      ]) as never,
    );
    const error = await new Promise<NodeJS.ErrnoException | null>((resolve) =>
      lookup('rebind.example.com', {}, (err) => resolve(err)),
    );
    expect(error?.code).toBe('EJAKDANG_BLOCKED');
  });

  it('공인 주소만 있으면 옵션에 맞는 형태로 돌려준다', async () => {
    const lookup = createSafeLookup(fakeResolver([{ address: '93.184.216.34', family: 4 }]) as never);
    const single = await new Promise<[string | dns.LookupAddress[], number | undefined]>((resolve) =>
      lookup('example.com', {}, (_err, address, family) => resolve([address, family])),
    );
    expect(single).toEqual(['93.184.216.34', 4]);
    const all = await new Promise<string | dns.LookupAddress[]>((resolve) =>
      lookup('example.com', { all: true }, (_err, address) => resolve(address)),
    );
    expect(all).toEqual([{ address: '93.184.216.34', family: 4 }]);
  });
});

describe('createFetcher', () => {
  it('허용 호스트가 아니거나 HTTP(S)가 아니면 요청하지 않는다', async () => {
    const { impl, calls } = recordingImpl(() => response(200, 'ok'));
    const fetcher = createFetcher({ fetchImpl: impl, ...noWait });
    await expect(fetcher.get({ url: 'https://other.example.com/', allowedHosts: ['a.example.com'] })).rejects.toMatchObject({
      kind: 'blocked',
    });
    await expect(fetcher.get({ url: 'file:///etc/passwd', allowedHosts: ['a.example.com'] })).rejects.toMatchObject({
      kind: 'blocked',
    });
    await expect(fetcher.get({ url: 'http://169.254.169.254/latest', allowedHosts: ['169.254.169.254'] })).rejects.toMatchObject(
      { kind: 'blocked' },
    );
    expect(calls).toHaveLength(0);
  });

  it('리디렉션을 자동으로 따라가지 않고 목적지마다 허용 호스트를 검사한다', async () => {
    const { impl, calls } = recordingImpl((url) => {
      if (url === 'https://a.example.com/list') return response(302, '', { location: '/list?page=1' });
      if (url === 'https://a.example.com/list?page=1') return response(301, '', { location: 'https://evil.example.net/' });
      return response(200, 'never');
    });
    const fetcher = createFetcher({ fetchImpl: impl, ...noWait });
    await expect(fetcher.get({ url: 'https://a.example.com/list', allowedHosts: ['a.example.com'] })).rejects.toMatchObject({
      kind: 'blocked',
    });
    expect(calls.map((call) => call.url)).toEqual(['https://a.example.com/list', 'https://a.example.com/list?page=1']);
    expect(calls.every((call) => call.init.redirect === 'manual')).toBe(true);
  });

  it('허용 호스트 안의 리디렉션은 따라가고 최종 URL을 돌려준다', async () => {
    const { impl } = recordingImpl((url) =>
      url.endsWith('/old') ? response(301, '', { location: 'https://b.example.com/new' }) : response(200, '<p>ok</p>'),
    );
    const fetcher = createFetcher({ fetchImpl: impl, ...noWait });
    const page = await fetcher.get({ url: 'https://a.example.com/old', allowedHosts: ['a.example.com', 'b.example.com'] });
    expect(page).toMatchObject({ status: 200, url: 'https://b.example.com/new', body: '<p>ok</p>' });
  });

  it('리디렉션 횟수 한도를 넘으면 실패한다', async () => {
    const { impl } = recordingImpl(() => response(302, '', { location: '/loop' }));
    const fetcher = createFetcher({ fetchImpl: impl, ...noWait, maxRedirects: 2 });
    await expect(fetcher.get({ url: 'https://a.example.com/loop', allowedHosts: ['a.example.com'] })).rejects.toMatchObject({
      kind: 'redirect',
    });
  });

  it('응답이 2MB를 넘으면 선언 길이와 실제 스트림 모두에서 막는다', async () => {
    const declared = createFetcher({
      fetchImpl: async () => response(200, 'small', { 'content-length': String(3 * 1024 * 1024) }),
      ...noWait,
    });
    await expect(declared.get({ url: 'https://a.example.com/', allowedHosts: ['a.example.com'] })).rejects.toMatchObject({
      kind: 'too_large',
    });
    const streamed = createFetcher({ fetchImpl: async () => response(200, 'x'.repeat(2048)), ...noWait });
    await expect(
      streamed.get({ url: 'https://a.example.com/', allowedHosts: ['a.example.com'], maxBytes: 1024 }),
    ).rejects.toMatchObject({ kind: 'too_large' });
  });

  it('타임아웃이 지나면 요청을 중단한다', async () => {
    const hanging: FetchImpl = (_url, init) =>
      new Promise((_resolve, reject) => {
        init.signal.addEventListener('abort', () => reject(new Error('aborted')));
      });
    const fetcher = createFetcher({ fetchImpl: hanging, ...noWait });
    await expect(
      fetcher.get({ url: 'https://a.example.com/', allowedHosts: ['a.example.com'], timeoutMs: 30 }),
    ).rejects.toMatchObject({ kind: 'timeout' });
    await expect(fetcher.get({ url: 'https://a.example.com/', allowedHosts: ['a.example.com'], timeoutMs: 0 })).rejects.toBeInstanceOf(
      FetchError,
    );
  });

  it('조건부 헤더를 보내고 304를 그대로 돌려준다', async () => {
    const { impl, calls } = recordingImpl(() => response(304));
    const fetcher = createFetcher({ fetchImpl: impl, ...noWait });
    const page = await fetcher.get({
      url: 'https://a.example.com/',
      allowedHosts: ['a.example.com'],
      etag: '"v1"',
      lastModified: 'Wed, 21 Oct 2026 00:00:00 GMT',
    });
    expect(page.status).toBe(304);
    expect(calls[0]?.init.headers).toMatchObject({
      'if-none-match': '"v1"',
      'if-modified-since': 'Wed, 21 Oct 2026 00:00:00 GMT',
      'user-agent': expect.stringContaining('jakdang-event-bot'),
    });
  });

  it('같은 호스트 요청은 직렬로 처리하고 최소 간격을 둔다', async () => {
    let clock = 0;
    const sleeps: number[] = [];
    let active = 0;
    let maxActive = 0;
    const impl: FetchImpl = async () => {
      active += 1;
      maxActive = Math.max(maxActive, active);
      await new Promise((resolve) => setTimeout(resolve, 5));
      clock += 100;
      active -= 1;
      return response(200, 'ok');
    };
    const fetcher = createFetcher({
      fetchImpl: impl,
      now: () => clock,
      sleep: async (ms) => {
        sleeps.push(ms);
        clock += ms;
      },
    });
    await Promise.all([
      fetcher.get({ url: 'https://a.example.com/1', allowedHosts: ['a.example.com'] }),
      fetcher.get({ url: 'https://a.example.com/2', allowedHosts: ['a.example.com'] }),
      fetcher.get({ url: 'https://a.example.com/3', allowedHosts: ['a.example.com'], minIntervalMs: 2_000 }),
    ]);
    expect(maxActive).toBe(1);
    expect(sleeps).toEqual([1_000, 2_000]);
  });

  it('전체 동시 요청은 3개를 넘지 않는다', async () => {
    let active = 0;
    let maxActive = 0;
    const impl: FetchImpl = async () => {
      active += 1;
      maxActive = Math.max(maxActive, active);
      await new Promise((resolve) => setTimeout(resolve, 10));
      active -= 1;
      return response(200, 'ok');
    };
    const fetcher = createFetcher({ fetchImpl: impl, ...noWait });
    const hosts = ['a', 'b', 'c', 'd', 'e'].map((name) => `${name}.example.com`);
    await Promise.all(hosts.map((host) => fetcher.get({ url: `https://${host}/`, allowedHosts: [host] })));
    expect(maxActive).toBe(3);
  });

  it('Content-Type의 charset으로 본문을 디코딩한다', async () => {
    const euckr = new Uint8Array([0xc7, 0xd8, 0xc4, 0xbf, 0xc5, 0xe6]);
    const impl: FetchImpl = async () => ({
      status: 200,
      headers: { get: (name: string) => (name === 'content-type' ? 'text/html; charset=euc-kr' : null) },
      body: new ReadableStream({
        start(controller) {
          controller.enqueue(euckr);
          controller.close();
        },
      }),
    });
    const page = await createFetcher({ fetchImpl: impl, ...noWait }).get({ url: 'https://a.example.com/', allowedHosts: ['a.example.com'] });
    expect(page.body).toBe('해커톤');
  });

  it('기본 구현은 DNS가 루프백을 가리키는 호스트에 연결하지 않는다', async () => {
    const fetcher = createFetcher(noWait);
    await expect(fetcher.get({ url: 'http://localhost:8080/', allowedHosts: ['localhost'], timeoutMs: 3_000 })).rejects.toMatchObject({
      kind: 'blocked',
    });
  });
});
