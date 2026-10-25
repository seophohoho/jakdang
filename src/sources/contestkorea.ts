import * as cheerio from 'cheerio';
import { fetchText } from '../http.js';
import type { Item, Source } from '../types.js';
import { cleanText, requireItems } from './shared.js';

const LIST_URL = 'https://www.contestkorea.com/sub/list.php?int_gbn=1&Txt_bcode=030310001';

export function parseContestkorea(html: string): Item[] {
  const $ = cheerio.load(html);
  const items: Item[] = [];
  $('div.list_style_2 > ul > li').each((_, li) => {
    const link = $(li).find('div.title a').first();
    const href = link.attr('href') ?? '';
    const id = /[?&]str_no=(\d{12})(?:&|$)/.exec(href)?.[1];
    if (id === undefined) return;
    const title = cleanText(link.find('span.txt').text());
    if (title === '') return;
    items.push({ id, title, url: new URL(href, LIST_URL).href });
  });
  return requireItems('contestkorea', items);
}

export const contestkorea: Source = {
  id: 'contestkorea',
  name: '콘테스트코리아',
  read: async () => parseContestkorea(await fetchText(LIST_URL)),
};
