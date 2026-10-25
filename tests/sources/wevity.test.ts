import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { parseWevity } from '../../src/sources/wevity.js';

const html = readFileSync(new URL('../fixtures/wevity-1.html', import.meta.url), 'utf8');

const KNOWN_ITEM = {
  id: '111802',
  title: '현대자동차그룹 차량용 앱 개발 공모전',
  url: 'https://www.wevity.com/?c=find&s=1&gbn=view&ix=111802',
};

describe('parseWevity', () => {
  it('parses items with canonical links and clean titles', () => {
    const items = parseWevity(html);
    expect(items.length).toBeGreaterThanOrEqual(5);
    for (const i of items) {
      expect(i.id).toMatch(/^\d+$/);
      expect(i.url).toBe(`https://www.wevity.com/?c=find&s=1&gbn=view&ix=${i.id}`);
      expect(i.title).not.toBe('');
      expect(i.title).toBe(i.title.trim());
      expect(i.title).not.toMatch(/^(SPECIAL|신규|IDEA)/);
      expect(i.title).not.toMatch(/\s(SPECIAL|IDEA)$/);
    }
  });

  it('includes a known item from the fixture', () => {
    expect(parseWevity(html)).toContainEqual(KNOWN_ITEM);
  });

  it('throws when the list is missing', () => {
    expect(() => parseWevity('<html></html>')).toThrow(/wevity/);
  });
});
