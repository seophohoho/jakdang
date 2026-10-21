import Parser from 'rss-parser';
import { ParserError } from './errors.js';
import { isAllowedHost } from './html.js';
import type { RawItem, SourceAdapter } from './types.js';

const parser = new Parser();

export async function parseRssFeed(
  xml: string,
  feedUrl: string,
  adapter: SourceAdapter,
  allowedHosts: readonly string[],
): Promise<RawItem[]> {
  let feed: Awaited<ReturnType<typeof parser.parseString>>;
  try {
    feed = await parser.parseString(xml);
  } catch (error) {
    throw new ParserError(`RSS를 해석하지 못했습니다: ${error instanceof Error ? error.message : String(error)}`);
  }
  return (feed.items ?? []).map((entry) => {
    const href = entry.link ?? null;
    let link: URL | null = null;
    if (href) {
      try {
        link = new URL(href, feedUrl);
      } catch {
        link = null;
      }
    }
    const title = entry.title ?? '';
    if (!link || !isAllowedHost(link, allowedHosts)) return { title, url: link?.toString() ?? href ?? '', siteId: null };
    const guid = typeof entry.guid === 'string' && entry.guid.trim() !== '' ? entry.guid.trim() : null;
    const fromAdapter = adapter.siteId(link, { href, attr: () => null });
    const siteId = fromAdapter ?? (guid && !/^https?:\/\//i.test(guid) ? guid : null);
    return { title, url: adapter.canonicalUrl(link, siteId), siteId };
  });
}
