import { readFileSync } from 'node:fs';
import * as cheerio from 'cheerio';
import { describe, expect, it } from 'vitest';
import { parseContestkorea } from '../../src/sources/contestkorea.js';

const html = readFileSync(new URL('../fixtures/contestkorea.html', import.meta.url), 'utf8');

const KNOWN_ITEM = {
  id: '202610200005',
  title: '현대자동차그룹 차량용 앱 개발 공모전',
  url: 'https://www.contestkorea.com/sub/view.php?int_gbn=1&Txt_bcode=030310001&str_no=202610200005',
};

const ANGLE_BRACKET_ITEM = {
  id: '202610150013',
  title: '<제8회 TS 보안 허점을 찾아라!> 공모전',
  url: 'https://www.contestkorea.com/sub/view.php?int_gbn=1&Txt_bcode=030310001&str_no=202610150013',
};

describe('parseContestkorea', () => {
  it('parses items with absolute links and clean titles', () => {
    const items = parseContestkorea(html);
    expect(items.length).toBeGreaterThanOrEqual(5);
    for (const i of items) {
      expect(i.id).toMatch(/^\d{12}$/);
      expect(i.url).toBe(`https://www.contestkorea.com/sub/view.php?int_gbn=1&Txt_bcode=030310001&str_no=${i.id}`);
      expect(i.title).not.toBe('');
      expect(i.title).toBe(i.title.trim());
    }
  });

  it('returns one item for every list row and none from outside the list', () => {
    const $ = cheerio.load(html);
    const rows = $('div.list_style_2 > ul > li').length;
    expect(rows).toBeGreaterThan(0);
    expect($('a[href*="str_no="]').length).toBeGreaterThan(rows);
    expect(parseContestkorea(html)).toHaveLength(rows);
  });

  it('includes a known item from the fixture', () => {
    expect(parseContestkorea(html)).toContainEqual(KNOWN_ITEM);
  });

  it('keeps angle brackets in a title', () => {
    expect(parseContestkorea(html)).toContainEqual(ANGLE_BRACKET_ITEM);
  });

  it('builds the link from the id even when the href points elsewhere', () => {
    const row = (href: string) => `<div class="list_style_2"><ul><li><div class="title"><a href="${href}"><span class="txt">제목</span></a></div></li></ul></div>`;
    const items = parseContestkorea(row('https://evil.test/view.php?str_no=202610200005&x=1'));
    expect(items).toEqual([
      { id: '202610200005', title: '제목', url: 'https://www.contestkorea.com/sub/view.php?int_gbn=1&Txt_bcode=030310001&str_no=202610200005' },
    ]);
  });

  it('throws when the list is missing', () => {
    expect(() => parseContestkorea('<html></html>')).toThrow(/contestkorea/);
  });
});
