import * as cheerio from 'cheerio';
import { fetchText } from '../http.js';
import type { Item, Source } from '../types.js';
import { cleanText, requireItems } from './shared.js';

const LIST_URL =
  'https://thinkyou.co.kr/contest/?page=1&pagesize=45&serstatus=&serdivision=&serfield=5&sertarget=&serprizeMoney=&seritem=0&searchstr=';

export function parseThinkyou(html: string): Item[] {
  const $ = cheerio.load(html);
  const items: Item[] = [];
  $('div.tr:not(.notice)').each((_, row) => {
    const link = $(row).find('div.title a').first();
    const id = /\/contest\/(\d+)\//.exec(link.attr('href') ?? '')?.[1];
    if (id === undefined) return;
    const title = cleanText(link.find('dl dt h3').text());
    if (title === '') return;
    items.push({ id, title, url: `https://thinkyou.co.kr/contest/${id}/` });
  });
  return requireItems('thinkyou', items);
}

export const thinkyou: Source = {
  id: 'thinkyou',
  name: '씽유',
  read: async () => parseThinkyou(await fetchText(LIST_URL)),
};
