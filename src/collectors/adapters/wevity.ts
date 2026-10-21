import type { SourceAdapter } from '../types.js';

export const wevityAdapter: SourceAdapter = {
  pageUrl(listUrl, page) {
    const url = new URL(listUrl);
    url.searchParams.set('gp', String(page));
    return url.toString();
  },
  siteId(link) {
    const ix = link.searchParams.get('ix');
    return ix && /^\d+$/.test(ix) ? ix : null;
  },
  canonicalUrl(link, siteId) {
    if (siteId === null) return link.toString();
    return `https://www.wevity.com/?c=find&s=1&gbn=view&ix=${siteId}`;
  },
};
