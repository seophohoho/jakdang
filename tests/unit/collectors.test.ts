import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { adapterFor } from '../../src/collectors/adapters/index.js';
import { ParserError } from '../../src/collectors/errors.js';
import { parseHtmlList } from '../../src/collectors/html.js';
import { parseRssFeed } from '../../src/collectors/rss.js';
import type { SourceConfig } from '../../src/collectors/types.js';
import { prepareItems } from '../../src/core/detect.js';
import { SOURCES } from '../../src/sources.js';

const fixture = (path: string) => readFileSync(new URL(`../fixtures/${path}`, import.meta.url), 'utf8');
const source = (id: string) => SOURCES.find((entry) => entry.id === id) as SourceConfig;

function parse(id: string, path: string, pageUrl?: string) {
  const config = source(id);
  return parseHtmlList(
    fixture(path),
    pageUrl ?? config.listUrl,
    config.selectors!,
    adapterFor(config.adapter),
    config.allowedHosts,
  );
}

describe('위비티 어댑터', () => {
  it('실제 목록 fixture에서 제목·정규 링크·ix를 읽고 표시용 span을 제거한다', () => {
    const items = parse('wevity-it', 'sources/wevity-it-page1.html');
    expect(items).toHaveLength(5);
    expect(items[0]).toEqual({
      title: expect.stringMatching(/^션샤인 TIME TRAVEL 숏폼 영상 공모전\s*$/),
      url: 'https://www.wevity.com/?c=find&s=1&gbn=view&ix=111750',
      siteId: '111750',
    });
    expect(items.map((item) => item.siteId)).toEqual(['111750', '110023', '111843', '111802', '111765']);
    expect(items.every((item) => !item.title.includes('SPECIAL') && !item.title.includes('신규'))).toBe(true);
  });

  it('키워드로 개발과 무관한 광고성 항목을 걸러낸다', () => {
    const prepared = prepareItems(source('wevity-it'), parse('wevity-it', 'sources/wevity-it-page1.html'));
    expect(prepared.items.map((item) => item.externalKey)).toEqual(['110023', '111843', '111802']);
    expect(prepared.filteredByKeyword).toBe(2);
  });

  it('페이지 URL은 gp 인자만 바꾼다', () => {
    const adapter = adapterFor('wevity');
    expect(adapter.pageUrl(source('wevity-it').listUrl, 2)).toBe(
      'https://www.wevity.com/?c=find&s=1&gub=1&cidx=20&gp=2',
    );
  });

  it('빈 제목·외부 호스트·스크립트 링크는 검증에서 건너뛰고 개수를 센다', () => {
    const items = parse('wevity-it', 'synthetic/wevity-invalid-items.html');
    const prepared = prepareItems(source('wevity-it'), items);
    expect(prepared.items.map((item) => item.externalKey)).toEqual(['900001']);
    expect(prepared.invalid).toHaveLength(3);
    expect(prepared.invalid.map((item) => item.reason).join(' ')).toMatch(/제목이 비어 있습니다/);
    expect(prepared.invalid.map((item) => item.reason).join(' ')).toMatch(/허용 호스트/);
    expect(prepared.invalid.find((item) => item.title.includes('외부'))?.url).toBe('https://evil.example.net/contest?ix=900003');
    expect(prepared.filteredByKeyword).toBe(1);
  });

  it('필수 컨테이너 선택자가 사라지면 ParserError를 던진다', () => {
    expect(() => parse('wevity-it', 'synthetic/wevity-no-container.html')).toThrow(ParserError);
  });

  it('컨테이너만 있고 항목이 없으면 빈 목록을 돌려준다', () => {
    expect(parse('wevity-it', 'synthetic/wevity-empty-list.html')).toEqual([]);
  });
});

describe('DACON 어댑터', () => {
  it('실제 목록 fixture에서 대회 ID와 제목을 읽는다', () => {
    const items = parse('dacon', 'sources/dacon-competitions.html');
    expect(items.map((item) => item.siteId)).toEqual(['236771', '236749', '236767', '236693']);
    expect(items[0]).toMatchObject({
      title: '항만 문제해결을 위한 AI 기술 공모전',
      url: 'https://dacon.io/competitions/official/236771/overview/',
    });
    const prepared = prepareItems(source('dacon'), items);
    expect(prepared.items).toHaveLength(4);
    expect(prepared.filteredByKeyword).toBe(0);
  });
});

describe('오픈소스 포털 어댑터', () => {
  it('data-post-id와 제목 span을 읽고 목록 상태 인자를 뺀 링크를 만든다', () => {
    const items = parse('oss-notice', 'sources/oss-notice-page1.html');
    expect(items.map((item) => item.siteId)).toEqual(['4661', '4660', '4540', '4609', '4541']);
    const conference = items.find((item) => item.siteId === '4660');
    expect(conference?.title.trim()).toBe('[행사안내] 래블업 AI 인프라 기술 컨퍼런스 개최(9/29)');
    expect(conference?.url).toBe('https://www.oss.kr/pages/10/4660');
  });

  it('행사가 아닌 공지는 키워드로 제외한다', () => {
    const prepared = prepareItems(source('oss-notice'), parse('oss-notice', 'sources/oss-notice-page1.html'));
    expect(prepared.items.map((item) => item.externalKey)).toEqual(['4660', '4540']);
    expect(prepared.filteredByKeyword).toBe(3);
  });
});

describe('RSS 파서 (합성 fixture)', () => {
  it('guid·링크·제목을 읽고 검증 단계에서 잘못된 항목을 거른다', async () => {
    const items = await parseRssFeed(
      fixture('rss/synthetic-feed.xml'),
      'https://feed.example.com/rss',
      adapterFor('generic'),
      ['feed.example.com'],
    );
    expect(items).toHaveLength(4);
    expect(items[0]).toMatchObject({ siteId: 'evt-101' });
    expect(items[1]).toMatchObject({ siteId: null, url: 'https://feed.example.com/events/102' });
    const prepared = prepareItems({ allowedHosts: ['feed.example.com'], keywords: undefined }, items);
    expect(prepared.items.map((item) => item.title)).toEqual(['2026 합성 해커톤 본선', '합성 밋업 @channel 공지']);
    expect(prepared.items[0]?.normalizedUrl).toBe('https://feed.example.com/events/101');
    expect(prepared.items[1]?.externalKey).toBe('https://feed.example.com/events/102');
    expect(prepared.invalid).toHaveLength(2);
  });

  it('XML이 아니면 ParserError를 던진다', async () => {
    await expect(
      parseRssFeed('<html><body>not a feed', 'https://feed.example.com/rss', adapterFor('generic'), ['feed.example.com']),
    ).rejects.toThrow(ParserError);
  });
});
