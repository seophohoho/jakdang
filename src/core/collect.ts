import { adapterFor } from '../collectors/adapters/index.js';
import { ParserError } from '../collectors/errors.js';
import { DEFAULT_TIMEOUT_MS, FetchError, type Fetcher } from '../collectors/fetch.js';
import { parseHtmlList } from '../collectors/html.js';
import { parseRssFeed } from '../collectors/rss.js';
import type { RawItem, SourceConfig } from '../collectors/types.js';

export type CollectErrorKind = 'fetch_error' | 'http_error' | 'parser_error' | 'budget_exhausted';

export interface CollectError {
  kind: CollectErrorKind;
  message: string;
  page: number;
}

export interface CollectResult {
  sourceId: string;
  status: 'ok' | 'partial' | 'not_modified' | 'error';
  items: RawItem[];
  pagesFetched: number;
  error: CollectError | null;
  etag: string | null;
  lastModified: string | null;
}

export interface CollectOptions {
  fetcher: Fetcher;
  pages: number;
  remainingMs?: () => number;
  conditional?: { etag: string | null; lastModified: string | null } | null;
}

const MIN_REQUEST_WINDOW_MS = 2_000;
const REQUEST_SAFETY_MARGIN_MS = 1_000;

export async function parsePage(source: SourceConfig, body: string, pageUrl: string): Promise<RawItem[]> {
  const adapter = adapterFor(source.adapter);
  if (source.kind === 'rss') return parseRssFeed(body, pageUrl, adapter, source.allowedHosts);
  if (!source.selectors) throw new ParserError('selectors 설정이 없습니다');
  return parseHtmlList(body, pageUrl, source.selectors, adapter, source.allowedHosts);
}

function itemKey(item: RawItem): string {
  return item.siteId !== null ? `id:${item.siteId}` : `url:${item.url}`;
}

export async function collectSource(source: SourceConfig, options: CollectOptions): Promise<CollectResult> {
  const adapter = adapterFor(source.adapter);
  const items: RawItem[] = [];
  const seen = new Set<string>();
  const result: CollectResult = {
    sourceId: source.id,
    status: 'ok',
    items,
    pagesFetched: 0,
    error: null,
    etag: null,
    lastModified: null,
  };
  const fail = (kind: CollectErrorKind, message: string, page: number): CollectResult => {
    result.error = { kind, message, page };
    result.status = items.length > 0 ? 'partial' : 'error';
    return result;
  };

  for (let page = 1; page <= options.pages; page += 1) {
    const remaining = options.remainingMs?.() ?? Number.POSITIVE_INFINITY;
    if (remaining < MIN_REQUEST_WINDOW_MS) {
      return fail('budget_exhausted', '남은 작업 시간이 부족해 목록 요청을 멈췄습니다', page);
    }
    const url = adapter.pageUrl(source.listUrl, page);
    const conditional = page === 1 ? options.conditional : null;
    let fetched;
    try {
      fetched = await options.fetcher.get({
        url,
        allowedHosts: source.allowedHosts,
        timeoutMs: Math.min(DEFAULT_TIMEOUT_MS, remaining - REQUEST_SAFETY_MARGIN_MS),
        minIntervalMs: source.minIntervalMs,
        etag: conditional?.etag ?? null,
        lastModified: conditional?.lastModified ?? null,
      });
    } catch (error) {
      const message = error instanceof FetchError ? `${error.kind}: ${error.message}` : String(error);
      return fail('fetch_error', message, page);
    }
    result.pagesFetched += 1;
    if (page === 1) {
      result.etag = fetched.etag;
      result.lastModified = fetched.lastModified;
    }
    if (fetched.status === 304 && page === 1 && conditional) {
      result.status = 'not_modified';
      return result;
    }
    if (fetched.status !== 200) return fail('http_error', `HTTP ${fetched.status}`, page);
    let parsed: RawItem[];
    try {
      parsed = await parsePage(source, fetched.body, fetched.url);
    } catch (error) {
      if (error instanceof ParserError) return fail('parser_error', error.message, page);
      throw error;
    }
    if (parsed.length === 0) {
      if (page === 1) return fail('parser_error', '목록이 비어 있습니다', page);
      break;
    }
    let added = 0;
    for (const item of parsed) {
      const key = itemKey(item);
      if (seen.has(key)) continue;
      seen.add(key);
      items.push(item);
      added += 1;
    }
    if (added === 0) break;
  }
  return result;
}
