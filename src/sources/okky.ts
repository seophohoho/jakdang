import * as cheerio from 'cheerio';
import { fetchText } from '../http.js';
import type { Item, Source } from '../types.js';
import { cleanText, requireItems } from './shared.js';

const LIST_URL = 'https://okky.kr/events/it';

export function parseOkky(html: string): Item[] {
  const $ = cheerio.load(html);
  const items: Item[] = [];
  $('ul.divide-y > li').each((_, li) => {
    $(li)
      .find('a[href^="/articles/"]')
      .each((__, a) => {
        const id = /^\/articles\/(\d+)$/.exec($(a).attr('href') ?? '')?.[1];
        const title = cleanText($(a).text());
        if (id === undefined || title === '') return;
        items.push({ id, title, url: `https://okky.kr/articles/${id}` });
        return false;
      });
  });
  return requireItems('okky', items);
}

export const okky: Source = {
  id: 'okky',
  name: 'OKKY',
  read: async () => parseOkky(await fetchText(LIST_URL)),
};
