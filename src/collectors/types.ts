export type SourceKind = 'html' | 'rss';
export type SourceAuthority = 'official' | 'platform' | 'community';

export interface HtmlSelectors {
  container: string;
  item: string;
  title: string;
  titleExclude?: string;
  link?: string;
  idAttr?: string;
}

export interface SourcePagination {
  runPages: number;
  maxPages: number;
}

export interface SourceConfig {
  id: string;
  name: string;
  kind: SourceKind;
  listUrl: string;
  allowedHosts: string[];
  authority: SourceAuthority;
  selectors?: HtmlSelectors;
  keywords?: string[];
  parserVersion: number;
  enabled: boolean;
  pagination: SourcePagination;
  minIntervalMs?: number;
  adapter: string;
}

export interface RawItem {
  title: string;
  url: string;
  siteId: string | null;
}

export interface ParsedElement {
  href: string | null;
  attr: (name: string) => string | null;
}

export interface SourceAdapter {
  pageUrl(listUrl: string, page: number): string;
  siteId(link: URL, element: ParsedElement): string | null;
  canonicalUrl(link: URL, siteId: string | null): string;
}
