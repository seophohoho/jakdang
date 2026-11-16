import * as cheerio from 'cheerio';
import { fetchRenderedHtml } from '../browser.js';
import type { Item, Source } from '../types.js';
import { cleanText, requireItems } from './shared.js';

const LIST_ANCHOR = 'div.official-comp div.comp > a';

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
  $(LIST_ANCHOR).each((_, a) => {
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
  read: async () => parseDacon(await fetchRenderedHtml('https://dacon.io/competitions', LIST_ANCHOR)),
};
