import * as cheerio from 'cheerio';
import { fetchText } from '../http.js';
import type { Item, Source } from '../types.js';
import { cleanText, requireItems } from './shared.js';

export function parseDacon(html: string): Item[] {
  const $ = cheerio.load(html);
  const items: Item[] = [];
  $('div.official-comp div.comp > a').each((_, a) => {
    const link = $(a);
    const id = /\/competitions\/official\/(\d+)\//.exec(link.attr('href') ?? '')?.[1];
    if (id === undefined) return;
    const title = cleanText(link.find('p.name').text());
    if (title === '') return;
    items.push({ id, title, url: `https://dacon.io/competitions/official/${id}/overview/` });
  });
  return requireItems('dacon', items);
}

export const dacon: Source = {
  id: 'dacon',
  name: 'DACON',
  read: async () => parseDacon(await fetchText('https://dacon.io/competitions')),
};
