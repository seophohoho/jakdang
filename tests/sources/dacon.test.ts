import { readFileSync } from 'node:fs';
import * as cheerio from 'cheerio';
import { describe, expect, it } from 'vitest';
import { parseDacon } from '../../src/sources/dacon.js';

const html = readFileSync(new URL('../fixtures/dacon.html', import.meta.url), 'utf8');

const KNOWN_ITEM = {
  id: '236753',
  title: '블랙박스 영상 기반 지능형 고의사고 분석 모델 AI 경진대회',
  url: 'https://dacon.io/competitions/official/236753/overview/',
};

const SINGULAR_ITEM = {
  id: '236746',
  title: '2026 Samsung Collegiate Programming Challenge : AI 챌린지',
  url: 'https://dacon.io/competition/236746/overview',
};

describe('parseDacon', () => {
  it('parses items with canonical links and clean titles', () => {
    const items = parseDacon(html);
    expect(items.length).toBeGreaterThanOrEqual(5);
    for (const i of items) {
      expect(i.id).toMatch(/^\d+$/);
      expect([
        `https://dacon.io/competitions/official/${i.id}/overview/`,
        `https://dacon.io/competition/${i.id}/overview`,
      ]).toContain(i.url);
      expect(i.title).not.toBe('');
      expect(i.title).toBe(i.title.trim());
    }
  });

  it('returns one item for every list anchor in the fixture', () => {
    const $ = cheerio.load(html);
    const anchors = $('div.official-comp div.comp > a').length;
    expect(anchors).toBeGreaterThan(0);
    expect(parseDacon(html)).toHaveLength(anchors);
  });

  it('includes a known item from the fixture', () => {
    expect(parseDacon(html)).toContainEqual(KNOWN_ITEM);
  });

  it('keeps an item whose link uses the singular /competition/ path', () => {
    expect(parseDacon(html)).toContainEqual(SINGULAR_ITEM);
  });

  it('throws when the list is missing', () => {
    expect(() => parseDacon('<html></html>')).toThrow(/dacon/);
  });
});
