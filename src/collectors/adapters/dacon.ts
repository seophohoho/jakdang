import type { SourceAdapter } from '../types.js';

export const daconAdapter: SourceAdapter = {
  pageUrl(listUrl) {
    return listUrl;
  },
  siteId(link) {
    return link.pathname.match(/^\/competitions\/official\/(\d+)\//)?.[1] ?? null;
  },
  canonicalUrl(link, siteId) {
    if (siteId === null) return link.toString();
    return `https://dacon.io/competitions/official/${siteId}/overview/`;
  },
};
