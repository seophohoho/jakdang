import type { SourceAdapter } from '../types.js';

export const ossAdapter: SourceAdapter = {
  pageUrl(listUrl, page) {
    const url = new URL(listUrl);
    url.searchParams.set('page', String(page));
    return url.toString();
  },
  siteId(link) {
    return link.pathname.match(/^\/pages\/10\/(\d+)$/)?.[1] ?? null;
  },
  canonicalUrl(link, siteId) {
    if (siteId === null) return link.toString();
    return `https://www.oss.kr/pages/10/${siteId}`;
  },
};
