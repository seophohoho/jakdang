import { readFileSync } from 'node:fs';
import * as cheerio from 'cheerio';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { allcon, parseAllcon } from '../../src/sources/allcon.js';

const json = readFileSync(new URL('../fixtures/allcon.json', import.meta.url), 'utf8');

type Row = { cl_srl: string; cl_title: string };
const rows = (JSON.parse(json) as { rows: Row[] }).rows;

const KNOWN_ITEM = {
  id: '544012',
  title: '현대자동차그룹 차량용 앱 개발 공모전',
  url: 'https://www.all-con.co.kr/view/contest/544012',
};

const AD_ROW_ITEM = {
  id: '543905',
  title: '[6G Vision Fest 2026] 6G 서비스 시나리오 공모전',
  url: 'https://www.all-con.co.kr/view/contest/543905',
};

describe('parseAllcon', () => {
  it('parses items with canonical links and clean titles', () => {
    const items = parseAllcon(json);
    expect(items.length).toBeGreaterThanOrEqual(5);
    for (const i of items) {
      expect(i.id).toMatch(/^\d+$/);
      expect(i.url).toBe(`https://www.all-con.co.kr/view/contest/${i.id}`);
      expect(i.title).not.toBe('');
      expect(i.title).toBe(i.title.trim());
    }
  });

  it('returns one item for every row in the fixture', () => {
    expect(rows.length).toBeGreaterThan(0);
    expect(parseAllcon(json)).toHaveLength(rows.length);
  });

  it('builds the same path the site puts in its own row links', () => {
    const items = parseAllcon(json);
    let checked = 0;
    for (const [index, row] of rows.entries()) {
      const href = cheerio.load(row.cl_title)('a').attr('href') ?? '';
      const path = /^\/view\/contest\/(\d+)\?/.exec(href)?.[1];
      if (path === undefined) continue;
      expect(items[index]?.url).toBe(`https://www.all-con.co.kr/view/contest/${path}`);
      checked += 1;
    }
    expect(checked).toBeGreaterThanOrEqual(5);
  });

  it('includes a known item from the fixture', () => {
    expect(parseAllcon(json)).toContainEqual(KNOWN_ITEM);
  });

  it('includes the row whose site link goes through the hit counter', () => {
    expect(parseAllcon(json)).toContainEqual(AD_ROW_ITEM);
  });

  it('strips badge html from titles', () => {
    for (const i of parseAllcon(json)) {
      expect(i.title).not.toMatch(/[<>]|&amp;/);
    }
    const badged = '{"rows":[{"cl_srl":"1","cl_title":"<span class=\\"badge\\">BADGE</span> A &amp; B 해커톤"}]}';
    expect(parseAllcon(badged)).toEqual([
      { id: '1', title: 'A & B 해커톤', url: 'https://www.all-con.co.kr/view/contest/1' },
    ]);
  });

  it('skips a row without cl_srl the way the site list does', () => {
    const mixed = '{"rows":[{"cl_title":"no id"},{"cl_srl":7,"cl_title":"<a href=\'/x\'>with id</a>"}]}';
    expect(parseAllcon(mixed)).toEqual([
      { id: '7', title: 'with id', url: 'https://www.all-con.co.kr/view/contest/7' },
    ]);
  });

  it('throws when rows are empty', () => {
    expect(() => parseAllcon('{"rows":[]}')).toThrow(/allcon/);
  });

  it('throws when rows are missing', () => {
    expect(() => parseAllcon('{}')).toThrow(/allcon/);
  });
});

describe('allcon.read', () => {
  afterEach(() => vi.unstubAllGlobals());

  it('posts the list form to the ajax endpoint', async () => {
    const fetchMock = vi.fn(async (_url: string, _init: RequestInit) => new Response(json));
    vi.stubGlobal('fetch', fetchMock);
    const items = await allcon.read();
    expect(items).toHaveLength(rows.length);
    const [url, init] = fetchMock.mock.calls[0]!;
    expect(url).toBe('https://www.all-con.co.kr/page/ajax.contest_list.php');
    expect(init.method).toBe('POST');
    expect(init.body).toBe('sortorder=asc&page=1&sortname=cl_order&ct[]=5&sc[]=31&stx=&sfl=&rows=15&t=1');
    expect(new Headers(init.headers).get('content-type')).toBe('application/x-www-form-urlencoded');
  });
});
