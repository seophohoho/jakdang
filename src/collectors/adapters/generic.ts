import type { SourceAdapter } from '../types.js';

export const genericAdapter: SourceAdapter = {
  pageUrl(listUrl) {
    return listUrl;
  },
  siteId() {
    return null;
  },
  canonicalUrl(link) {
    return link.toString();
  },
};
