import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { FetchError, type FetchedPage, type Fetcher, type FetchRequest } from '../../src/collectors/fetch.js';
import type { SourceConfig } from '../../src/collectors/types.js';
import { collectSource } from '../../src/core/collect.js';
import { SOURCES } from '../../src/sources.js';

const fixture = (path: string) => readFileSync(new URL(`../fixtures/${path}`, import.meta.url), 'utf8');
const wevity = SOURCES.find((source) => source.id === 'wevity-it') as SourceConfig;

type Responder = (request: FetchRequest) => Partial<FetchedPage> | Error;

function fakeFetcher(responder: Responder): Fetcher & { requests: FetchRequest[] } {
  const requests: FetchRequest[] = [];
  return {
    requests,
    async get(request) {
      requests.push(request);
      const result = responder(request);
      if (result instanceof Error) throw result;
      return {
        status: 200,
        url: request.url,
        body: '',
        etag: null,
        lastModified: null,
        contentType: 'text/html',
        ...result,
      };
    },
  };
}

const page = (request: FetchRequest) => new URL(request.url).searchParams.get('gp');

describe('collectSource', () => {
  it('지정한 페이지 수만큼 읽고 페이지 사이 중복 항목을 합친다', async () => {
    const fetcher = fakeFetcher((request) => ({
      body: fixture(page(request) === '1' ? 'sources/wevity-it-page1.html' : 'sources/wevity-it-page2.html'),
      etag: page(request) === '1' ? '"p1"' : '"p2"',
    }));
    const result = await collectSource(wevity, { fetcher, pages: 2 });
    expect(result.status).toBe('ok');
    expect(result.pagesFetched).toBe(2);
    expect(result.items.map((item) => item.siteId)).toEqual(['111750', '110023', '111843', '111802', '111765', '111567', '111322']);
    expect(result.etag).toBe('"p1"');
    expect(fetcher.requests.map((request) => request.allowedHosts)).toEqual([wevity.allowedHosts, wevity.allowedHosts]);
  });

  it('다음 페이지가 새 항목 없이 같은 목록이면 탐색을 멈춘다', async () => {
    const fetcher = fakeFetcher(() => ({ body: fixture('sources/wevity-it-page1.html') }));
    const result = await collectSource(wevity, { fetcher, pages: 5 });
    expect(result.pagesFetched).toBe(2);
    expect(result.items).toHaveLength(5);
  });

  it('첫 페이지가 304면 not_modified로 끝내고 조건부 헤더는 첫 페이지에만 보낸다', async () => {
    const fetcher = fakeFetcher(() => ({ status: 304 }));
    const result = await collectSource(wevity, {
      fetcher,
      pages: 2,
      conditional: { etag: '"p1"', lastModified: 'Wed, 21 Oct 2026 00:00:00 GMT' },
    });
    expect(result.status).toBe('not_modified');
    expect(fetcher.requests).toHaveLength(1);
    expect(fetcher.requests[0]).toMatchObject({ etag: '"p1"', lastModified: 'Wed, 21 Oct 2026 00:00:00 GMT' });
  });

  it('404는 http_error, 선택자 고장·빈 목록은 parser_error로 기록하고 항목을 돌려주지 않는다', async () => {
    const notFound = await collectSource(wevity, { fetcher: fakeFetcher(() => ({ status: 404 })), pages: 1 });
    expect(notFound).toMatchObject({ status: 'error', items: [], error: { kind: 'http_error', message: 'HTTP 404' } });

    const broken = await collectSource(wevity, {
      fetcher: fakeFetcher(() => ({ body: fixture('synthetic/wevity-no-container.html') })),
      pages: 1,
    });
    expect(broken).toMatchObject({ status: 'error', items: [], error: { kind: 'parser_error' } });

    const empty = await collectSource(wevity, {
      fetcher: fakeFetcher(() => ({ body: fixture('synthetic/wevity-empty-list.html') })),
      pages: 1,
    });
    expect(empty).toMatchObject({ status: 'error', error: { kind: 'parser_error', message: '목록이 비어 있습니다' } });
  });

  it('두 번째 페이지 실패는 partial로 남기고 첫 페이지 항목은 유지한다', async () => {
    const fetcher = fakeFetcher((request) =>
      page(request) === '1' ? { body: fixture('sources/wevity-it-page1.html') } : new FetchError('timeout', '요청 시간이 초과됐습니다'),
    );
    const result = await collectSource(wevity, { fetcher, pages: 2 });
    expect(result.status).toBe('partial');
    expect(result.items).toHaveLength(5);
    expect(result.error).toMatchObject({ kind: 'fetch_error', page: 2 });
  });

  it('남은 시간이 부족하면 요청하지 않고, 요청 타임아웃은 남은 시간보다 짧게 잡는다', async () => {
    const idle = fakeFetcher(() => ({ body: fixture('sources/wevity-it-page1.html') }));
    const exhausted = await collectSource(wevity, { fetcher: idle, pages: 1, remainingMs: () => 1_500 });
    expect(exhausted).toMatchObject({ status: 'error', error: { kind: 'budget_exhausted' } });
    expect(idle.requests).toHaveLength(0);

    const tight = fakeFetcher(() => ({ body: fixture('sources/wevity-it-page1.html') }));
    await collectSource(wevity, { fetcher: tight, pages: 1, remainingMs: () => 5_000 });
    expect(tight.requests[0]?.timeoutMs).toBe(4_000);

    const roomy = fakeFetcher(() => ({ body: fixture('sources/wevity-it-page1.html') }));
    await collectSource(wevity, { fetcher: roomy, pages: 1, remainingMs: () => 200_000 });
    expect(roomy.requests[0]?.timeoutMs).toBe(10_000);
  });
});
