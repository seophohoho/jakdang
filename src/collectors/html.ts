import * as cheerio from 'cheerio';
import { ParserError } from './errors.js';
import type { HtmlSelectors, RawItem, SourceAdapter } from './types.js';

export function isAllowedHost(link: URL, allowedHosts: readonly string[]): boolean {
  return (
    (link.protocol === 'https:' || link.protocol === 'http:') &&
    allowedHosts.some((host) => host.toLowerCase() === link.hostname.toLowerCase())
  );
}

export function parseHtmlList(
  html: string,
  pageUrl: string,
  selectors: HtmlSelectors,
  adapter: SourceAdapter,
  allowedHosts: readonly string[],
): RawItem[] {
  const $ = cheerio.load(html);
  const container = $(selectors.container).first();
  if (container.length === 0) throw new ParserError(`필수 선택자를 찾지 못했습니다: ${selectors.container}`);
  const items: RawItem[] = [];
  container.find(selectors.item).each((_, element) => {
    const item = $(element);
    const titleElement = item.find(selectors.title).first().clone();
    if (selectors.titleExclude) titleElement.find(selectors.titleExclude).remove();
    const linkElement = selectors.link ? item.find(selectors.link).first() : item;
    const href = linkElement.attr('href') ?? null;
    const attr = (name: string) => linkElement.attr(name) ?? item.attr(name) ?? null;
    let link: URL | null = null;
    if (href) {
      try {
        link = new URL(href, pageUrl);
      } catch {
        link = null;
      }
    }
    if (!link || !isAllowedHost(link, allowedHosts)) {
      items.push({ title: titleElement.text(), url: link?.toString() ?? href ?? '', siteId: null });
      return;
    }
    const attrId = selectors.idAttr ? attr(selectors.idAttr)?.trim() || null : null;
    const siteId = attrId ?? adapter.siteId(link, { href, attr });
    items.push({ title: titleElement.text(), url: adapter.canonicalUrl(link, siteId), siteId });
  });
  return items;
}
