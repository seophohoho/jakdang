import { readFileSync } from 'node:fs';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { parseThinkgood, thinkgood } from '../../src/sources/thinkgood.js';

const json = readFileSync(new URL('../fixtures/thinkgood.json', import.meta.url), 'utf8');

type Row = { contest_pk: number; program_nm: string };
const rows = (JSON.parse(json) as { listJsonData: Row[] }).listJsonData;

const KNOWN_ITEM = {
  id: '112093',
  title: '2026 충북글로벌게임센터 AI 게임 개발 공모전',
  url: 'https://www.thinkcontest.com/thinkgood/user/contest/view.do?contest_pk=112093',
};

describe('parseThinkgood', () => {
  it('parses items with canonical links and clean titles', () => {
    const items = parseThinkgood(json);
    expect(items.length).toBeGreaterThanOrEqual(5);
    for (const i of items) {
      expect(i.id).toMatch(/^\d+$/);
      expect(i.url).toBe(`https://www.thinkcontest.com/thinkgood/user/contest/view.do?contest_pk=${i.id}`);
      expect(i.title).not.toBe('');
      expect(i.title).toBe(i.title.trim());
    }
  });

  it('returns one item for every row in the fixture', () => {
    expect(rows.length).toBeGreaterThan(0);
    expect(parseThinkgood(json)).toHaveLength(rows.length);
  });

  it('includes a known item from the fixture', () => {
    expect(parseThinkgood(json)).toContainEqual(KNOWN_ITEM);
  });

  it('keeps only the id and the title from each row', () => {
    for (const row of rows) {
      expect(Object.keys(row).sort()).toEqual(['contest_pk', 'program_nm']);
    }
  });

  it('collapses whitespace in titles', () => {
    const spaced = '{"listJsonData":[{"contest_pk":5,"program_nm":"  A \\n  B  "}]}';
    expect(parseThinkgood(spaced)).toEqual([
      { id: '5', title: 'A B', url: 'https://www.thinkcontest.com/thinkgood/user/contest/view.do?contest_pk=5' },
    ]);
  });

  it('skips a row without contest_pk', () => {
    const mixed = '{"listJsonData":[{"program_nm":"no id"},{"contest_pk":8,"program_nm":"with id"}]}';
    expect(parseThinkgood(mixed).map((i) => i.id)).toEqual(['8']);
  });

  it('throws when the list is empty', () => {
    expect(() => parseThinkgood('{"listJsonData":[]}')).toThrow(/thinkgood/);
  });

  it('throws when the list is missing', () => {
    expect(() => parseThinkgood('{}')).toThrow(/thinkgood/);
  });
});

describe('thinkgood.read', () => {
  afterEach(() => vi.unstubAllGlobals());

  it('posts the list query as json to the subList endpoint', async () => {
    const fetchMock = vi.fn(async (_url: string, _init: RequestInit) => new Response(json));
    vi.stubGlobal('fetch', fetchMock);
    const items = await thinkgood.read();
    expect(items).toHaveLength(rows.length);
    const [url, init] = fetchMock.mock.calls[0]!;
    expect(url).toBe('https://www.thinkcontest.com/thinkgood/user/contest/subList.do');
    expect(init.method).toBe('POST');
    expect(init.body).toBe(
      '{"recordsPerPage":20,"currentPageNo":1,"contest_field":"CCFD002","host_organ":"","enter_qualified":"","award_size":"","searchStatus":"Y","sidx":"putup_sdt","sord":"DESC"}',
    );
    expect(new Headers(init.headers).get('content-type')).toBe('application/json');
  });
});
