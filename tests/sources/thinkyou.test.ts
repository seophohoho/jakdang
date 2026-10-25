import { readFileSync } from 'node:fs';
import * as cheerio from 'cheerio';
import { describe, expect, it } from 'vitest';
import { parseThinkyou } from '../../src/sources/thinkyou.js';

const html = readFileSync(new URL('../fixtures/thinkyou.html', import.meta.url), 'utf8');

const KNOWN_ITEM = {
  id: '67570',
  title: '현대자동차그룹 차량용 앱 개발 공모전',
  url: 'https://thinkyou.co.kr/contest/67570/',
};

const TRIMMED_ITEM = {
  id: '63996',
  title: '2026년 3D Design for the Future 3D 모델링 디자인 + AI 활용 공모전',
  url: 'https://thinkyou.co.kr/contest/63996/',
};

const NOTICE = {
  id: '67477',
  title: '『2026 대한민국 워케이션 박람회』 팸투어 참여기업 모집공고',
  url: 'https://thinkyou.co.kr/contest/67477/',
};

describe('parseThinkyou', () => {
  it('parses items with canonical links and clean titles', () => {
    const items = parseThinkyou(html);
    expect(items.length).toBeGreaterThanOrEqual(10);
    for (const i of items) {
      expect(i.id).toMatch(/^\d+$/);
      expect(i.url).toBe(`https://thinkyou.co.kr/contest/${i.id}/`);
      expect(i.title).not.toBe('');
      expect(i.title).toBe(i.title.trim());
    }
  });

  it('returns one item for every non-notice row in the fixture', () => {
    const $ = cheerio.load(html);
    expect($('div.tr.notice').length).toBeGreaterThan(0);
    const rows = $('div.tr:not(.notice):has(div.title a)').length;
    expect(rows).toBeGreaterThan(0);
    expect(parseThinkyou(html)).toHaveLength(rows);
  });

  it('includes a known item from the fixture', () => {
    expect(parseThinkyou(html)).toContainEqual(KNOWN_ITEM);
  });

  it('trims trailing whitespace from titles', () => {
    expect(parseThinkyou(html)).toContainEqual(TRIMMED_ITEM);
  });

  it('leaves out the pinned notice row', () => {
    const items = parseThinkyou(html);
    expect(items).not.toContainEqual(NOTICE);
    expect(items.map((i) => i.id)).not.toContain(NOTICE.id);
    expect(items.map((i) => i.title)).not.toContain(NOTICE.title);
  });

  it('throws when the list is missing', () => {
    expect(() => parseThinkyou('<html></html>')).toThrow(/thinkyou/);
  });
});
