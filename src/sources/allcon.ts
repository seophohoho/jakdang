import * as cheerio from 'cheerio';
import { fetchText } from '../http.js';
import type { Item, Source } from '../types.js';
import { cleanText, requireItems } from './shared.js';

const LIST_URL = 'https://www.all-con.co.kr/page/ajax.contest_list.php';
const LIST_BODY = 'sortorder=asc&page=1&sortname=cl_order&ct[]=5&sc[]=31&stx=&sfl=&rows=15&t=1';

type Row = { cl_srl?: string | number | null; cl_title?: string | null };

function titleOf(html: string): string {
  const $ = cheerio.load(html);
  $('.badge').remove();
  return cleanText($.root().text());
}

export function parseAllcon(json: string): Item[] {
  const rows = (JSON.parse(json) as { rows?: Row[] }).rows ?? [];
  const items: Item[] = [];
  for (const row of rows) {
    if (row.cl_srl === undefined || row.cl_srl === null) continue;
    const id = String(row.cl_srl);
    const title = titleOf(row.cl_title ?? '');
    if (title === '') continue;
    items.push({ id, title, url: `https://www.all-con.co.kr/view/contest/${id}` });
  }
  return requireItems('allcon', items);
}

export const allcon: Source = {
  id: 'allcon',
  name: '올콘',
  read: async () =>
    parseAllcon(
      await fetchText(LIST_URL, {
        method: 'POST',
        headers: { 'content-type': 'application/x-www-form-urlencoded' },
        body: LIST_BODY,
      }),
    ),
};
