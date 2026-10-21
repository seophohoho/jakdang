import { z } from 'zod';
import type { RawItem, SourceConfig } from '../collectors/types.js';

export const MAX_TITLE_LENGTH = 200;
export const MAX_URL_LENGTH = 1500;

const TRACKING_PARAMS = new Set([
  'fbclid',
  'gclid',
  'dclid',
  'msclkid',
  'igshid',
  'mc_cid',
  'mc_eid',
  '_hsenc',
  '_hsmi',
]);

function isTrackingParam(name: string): boolean {
  const lower = name.toLowerCase();
  return lower.startsWith('utm_') || TRACKING_PARAMS.has(lower);
}

export function normalizeUrl(raw: string): string {
  const url = new URL(raw);
  url.hash = '';
  url.hostname = url.hostname.toLowerCase();
  if ((url.protocol === 'https:' && url.port === '443') || (url.protocol === 'http:' && url.port === '80')) {
    url.port = '';
  }
  const kept = [...url.searchParams.entries()].filter(([name]) => !isTrackingParam(name));
  kept.sort(([a, aValue], [b, bValue]) => (a === b ? aValue.localeCompare(bValue) : a.localeCompare(b)));
  url.search = '';
  for (const [name, value] of kept) url.searchParams.append(name, value);
  return url.toString();
}

export function cleanTitle(raw: string): string {
  const collapsed = raw.replace(/[\s ​﻿]+/g, ' ').trim();
  const codePoints = Array.from(collapsed);
  if (codePoints.length <= MAX_TITLE_LENGTH) return collapsed;
  return codePoints.slice(0, MAX_TITLE_LENGTH).join('').trimEnd();
}

export function matchesKeywords(title: string, keywords: readonly string[] | undefined): boolean {
  if (!keywords || keywords.length === 0) return true;
  const lower = title.toLowerCase();
  return keywords.some((keyword) => lower.includes(keyword.toLowerCase()));
}

function itemSchema(allowedHosts: readonly string[]) {
  const hosts = allowedHosts.map((host) => host.toLowerCase());
  return z.object({
    title: z.string().min(1, { error: '제목이 비어 있습니다' }),
    url: z
      .string()
      .max(MAX_URL_LENGTH, { error: 'URL이 너무 깁니다' })
      .refine(
        (value) => {
          try {
            const url = new URL(value);
            return (url.protocol === 'https:' || url.protocol === 'http:') && hosts.includes(url.hostname.toLowerCase());
          } catch {
            return false;
          }
        },
        { error: '허용 호스트의 HTTP(S) 링크가 아닙니다' },
      ),
    siteId: z.string().min(1).max(200).nullable(),
  });
}

export interface CandidateItem {
  title: string;
  url: string;
  normalizedUrl: string;
  externalKey: string;
  siteId: string | null;
}

export interface InvalidItem {
  title: string;
  url: string;
  reason: string;
}

export interface PreparedItems {
  items: CandidateItem[];
  invalid: InvalidItem[];
  filteredByKeyword: number;
}

export function prepareItems(source: Pick<SourceConfig, 'allowedHosts' | 'keywords'>, rawItems: RawItem[]): PreparedItems {
  const schema = itemSchema(source.allowedHosts);
  const items: CandidateItem[] = [];
  const invalid: InvalidItem[] = [];
  const seenKeys = new Set<string>();
  let filteredByKeyword = 0;
  for (const raw of rawItems) {
    const candidate = { title: cleanTitle(raw.title), url: raw.url.trim(), siteId: raw.siteId?.trim() || null };
    const parsed = schema.safeParse(candidate);
    if (!parsed.success) {
      invalid.push({
        title: candidate.title,
        url: candidate.url,
        reason: parsed.error.issues.map((issue) => issue.message).join(', '),
      });
      continue;
    }
    if (!matchesKeywords(parsed.data.title, source.keywords)) {
      filteredByKeyword += 1;
      continue;
    }
    const normalizedUrl = normalizeUrl(parsed.data.url);
    const externalKey = parsed.data.siteId ?? normalizedUrl;
    if (seenKeys.has(externalKey)) continue;
    seenKeys.add(externalKey);
    items.push({
      title: parsed.data.title,
      url: parsed.data.url,
      normalizedUrl,
      externalKey,
      siteId: parsed.data.siteId,
    });
  }
  return { items, invalid, filteredByKeyword };
}
