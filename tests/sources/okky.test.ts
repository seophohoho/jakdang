import { readFileSync } from 'node:fs';
import * as cheerio from 'cheerio';
import { describe, expect, it } from 'vitest';
import { parseOkky } from '../../src/sources/okky.js';

const html = readFileSync(new URL('../fixtures/okky.html', import.meta.url), 'utf8');

const IMAGE_ROW_ITEM = {
  id: '1566010',
  title: '[제9차 한-프랑스 신산업 기술협력 포럼] 기조강연 및 프로그램 안내 (11. 4.(수), 앰버서더 서울 풀만)',
  url: 'https://okky.kr/articles/1566010',
};

const TEXT_ONLY_ROW_ITEM = {
  id: '1565656',
  title: '[한국인터넷진흥원] 「2026 블록체인 진흥주간」 무료 취업컨설팅 참가자 모집 (~10.30)',
  url: 'https://okky.kr/articles/1565656',
};

describe('parseOkky', () => {
  it('parses items with canonical links and clean titles', () => {
    const items = parseOkky(html);
    expect(items.length).toBeGreaterThanOrEqual(10);
    for (const i of items) {
      expect(i.id).toMatch(/^\d+$/);
      expect(i.url).toBe(`https://okky.kr/articles/${i.id}`);
      expect(i.title).not.toBe('');
      expect(i.title).toBe(i.title.trim());
    }
  });

  it('returns one item for every article row in the fixture', () => {
    const $ = cheerio.load(html);
    const rows = $('ul.divide-y > li:has(a[href^="/articles/"])').length;
    expect(rows).toBeGreaterThan(0);
    expect(parseOkky(html)).toHaveLength(rows);
  });

  it('returns each article once even though a row links it twice', () => {
    const ids = parseOkky(html).map((i) => i.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('includes an item whose row has an image link', () => {
    expect(parseOkky(html)).toContainEqual(IMAGE_ROW_ITEM);
  });

  it('includes an item whose row has no image link', () => {
    expect(parseOkky(html)).toContainEqual(TEXT_ONLY_ROW_ITEM);
  });

  it('throws when the list is missing', () => {
    expect(() => parseOkky('<html></html>')).toThrow(/okky/);
  });
});
