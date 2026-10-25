import * as cheerio from 'cheerio';
import { fetchText } from '../http.js';
import { sleep } from '../sleep.js';
import type { Item, Source } from '../types.js';
import { cleanText, requireItems } from './shared.js';

const LIST_URL = 'https://www.wevity.com/?c=find&s=1&gub=1&cidx=20';

export function parseWevity(html: string): Item[] {
  const $ = cheerio.load(html);
  const items: Item[] = [];
  $('div.ms-list > ul.list > li:not(.top)').each((_, li) => {
    const link = $(li).find('div.tit > a').first();
    const id = /[?&]ix=(\d+)/.exec(link.attr('href') ?? '')?.[1];
    if (id === undefined) return;
    const title = link.clone();
    title.find('span').remove();
    const text = cleanText(title.text());
    if (text === '') return;
    items.push({ id, title: text, url: `https://www.wevity.com/?c=find&s=1&gbn=view&ix=${id}` });
  });
  return requireItems('wevity', items);
}

export const wevity: Source = {
  id: 'wevity',
  name: '위비티',
  read: async () => {
    const first = parseWevity(await fetchText(`${LIST_URL}&gp=1`));
    await sleep(1000);
    const second = parseWevity(await fetchText(`${LIST_URL}&gp=2`));
    return [...first, ...second];
  },
};
