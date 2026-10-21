import { describe, expect, it } from 'vitest';
import { cleanTitle, matchesKeywords, normalizeUrl, prepareItems } from '../../src/core/detect.js';

describe('normalizeUrl', () => {
  it('확인된 추적 인자만 제거하고 항목 식별 인자는 유지한다', () => {
    expect(
      normalizeUrl('https://www.wevity.com/?c=find&s=1&gbn=view&ix=111843&utm_source=x&utm_Medium=y&fbclid=abc&gclid=1'),
    ).toBe('https://www.wevity.com/?c=find&gbn=view&ix=111843&s=1');
    expect(normalizeUrl('https://event-us.kr/medici/event/137520?utm_campaign=c')).toBe(
      'https://event-us.kr/medici/event/137520',
    );
    expect(normalizeUrl('https://example.com/view?id=10&ref=20&page=3')).toBe('https://example.com/view?id=10&page=3&ref=20');
  });

  it('식별 인자 값이 다르면 다른 URL로 남는다', () => {
    expect(normalizeUrl('https://example.com/v?ix=1')).not.toBe(normalizeUrl('https://example.com/v?ix=2'));
  });

  it('조각·기본 포트·호스트 대소문자를 정리하고 경로는 바꾸지 않는다', () => {
    expect(normalizeUrl('HTTPS://Dacon.IO:443/competitions/official/236771/overview/#rules')).toBe(
      'https://dacon.io/competitions/official/236771/overview/',
    );
    expect(normalizeUrl('http://example.com:80/a/B')).toBe('http://example.com/a/B');
    expect(normalizeUrl('https://example.com/a/')).not.toBe(normalizeUrl('https://example.com/a'));
  });

  it('인자 순서가 달라도 같은 값으로 정규화한다', () => {
    expect(normalizeUrl('https://example.com/?b=2&a=1')).toBe(normalizeUrl('https://example.com/?a=1&b=2'));
  });
});

describe('cleanTitle', () => {
  it('공백을 정리하고 200자로 자른다', () => {
    expect(cleanTitle('  2026\n\t해커톤  본선  ')).toBe('2026 해커톤 본선');
    expect(Array.from(cleanTitle('가'.repeat(250)))).toHaveLength(200);
  });

  it('이모지 같은 서로게이트 쌍을 반으로 자르지 않는다', () => {
    const title = cleanTitle(`${'a'.repeat(199)}😀😀`);
    expect(Array.from(title)).toHaveLength(200);
    expect(title.endsWith('😀')).toBe(true);
  });
});

describe('matchesKeywords', () => {
  it('키워드가 없으면 모두 통과하고, 있으면 하나라도 포함돼야 한다', () => {
    expect(matchesKeywords('아무 제목', undefined)).toBe(true);
    expect(matchesKeywords('Gen AI 해커톤', ['ai'])).toBe(true);
    expect(matchesKeywords('사진 공모전', ['해커톤', 'AI'])).toBe(false);
  });
});

describe('prepareItems', () => {
  it('external_key는 사이트 ID를 우선하고 없으면 정규화 URL을 쓴다', () => {
    const prepared = prepareItems({ allowedHosts: ['a.test'], keywords: undefined }, [
      { title: 'ID 있음', url: 'https://a.test/e/1?utm_source=x', siteId: '1' },
      { title: 'ID 없음', url: 'https://a.test/e/2?utm_source=x', siteId: null },
      { title: '같은 ID 중복', url: 'https://a.test/e/1-dup', siteId: '1' },
    ]);
    expect(prepared.items.map((item) => item.externalKey)).toEqual(['1', 'https://a.test/e/2']);
  });
});
