import * as cheerio from 'cheerio';
import { fetchText } from '../http.js';
import type { Item, Source } from '../types.js';
import { cleanText, requireItems } from './shared.js';

function linkOf(href: string): { id: string; url: string } | undefined {
  const official = /\/competitions\/official\/(\d+)\//.exec(href)?.[1];
  if (official !== undefined) {
    return { id: official, url: `https://dacon.io/competitions/official/${official}/overview/` };
  }
  const plain = /\/competition\/(\d+)\//.exec(href)?.[1];
  if (plain !== undefined) {
    return { id: plain, url: `https://dacon.io/competition/${plain}/overview` };
  }
  return undefined;
}

export function parseDacon(html: string): Item[] {
  const $ = cheerio.load(html);
  const items: Item[] = [];
  $('div.official-comp div.comp > a').each((_, a) => {
    const link = $(a);
    const target = linkOf(link.attr('href') ?? '');
    if (target === undefined) return;
    const title = cleanText(link.find('p.name').text());
    if (title === '') return;
    items.push({ id: target.id, title, url: target.url });
  });
  return requireItems('dacon', items);
}

export const dacon: Source = {
  id: 'dacon',
  name: 'DACON',
  read: async () => parseDacon(await fetchText('https://dacon.io/competitions')),
};
