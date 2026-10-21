import { createHash } from 'node:crypto';
import { z } from 'zod';
import type { SourceConfig } from './collectors/types.js';

const hostPattern = /^[a-z0-9.-]+$/;

const SourceConfigSchema = z
  .object({
    id: z.string().regex(/^[a-z0-9-]+$/),
    name: z.string().min(1),
    kind: z.enum(['html', 'rss']),
    listUrl: z.url({ protocol: /^https?$/ }),
    allowedHosts: z.array(z.string().regex(hostPattern)).min(1),
    authority: z.enum(['official', 'platform', 'community']),
    selectors: z
      .object({
        container: z.string().min(1),
        item: z.string().min(1),
        title: z.string().min(1),
        titleExclude: z.string().min(1).optional(),
        link: z.string().min(1).optional(),
        idAttr: z.string().min(1).optional(),
      })
      .optional(),
    keywords: z.array(z.string().trim().min(1)).min(1).optional(),
    parserVersion: z.number().int().positive(),
    enabled: z.boolean(),
    pagination: z.object({
      runPages: z.number().int().min(1).max(10),
      maxPages: z.number().int().min(1).max(20),
    }),
    minIntervalMs: z.number().int().min(1000).optional(),
    adapter: z.string().min(1),
  })
  .refine((source) => source.kind !== 'html' || source.selectors !== undefined, {
    error: 'html 소스에는 selectors가 필요합니다',
  })
  .refine((source) => source.pagination.runPages <= source.pagination.maxPages, {
    error: 'runPages는 maxPages 이하여야 합니다',
  })
  .refine((source) => source.allowedHosts.includes(new URL(source.listUrl).hostname), {
    error: 'listUrl 호스트가 allowedHosts에 있어야 합니다',
  });

export function validateSources(sources: SourceConfig[]): SourceConfig[] {
  const ids = new Set<string>();
  return sources.map((source) => {
    const parsed = SourceConfigSchema.safeParse(source);
    if (!parsed.success) {
      throw new Error(
        `소스 설정 오류(${source.id}): ${parsed.error.issues.map((issue) => `${issue.path.join('.')} ${issue.message}`).join('; ')}`,
      );
    }
    if (ids.has(source.id)) throw new Error(`소스 id가 중복됐습니다: ${source.id}`);
    ids.add(source.id);
    return source;
  });
}

export const SOURCES: SourceConfig[] = validateSources([
  {
    id: 'wevity-it',
    name: '위비티 웹/모바일/IT 공모전',
    kind: 'html',
    listUrl: 'https://www.wevity.com/?c=find&s=1&gub=1&cidx=20',
    allowedHosts: ['www.wevity.com', 'wevity.com'],
    authority: 'platform',
    selectors: {
      container: 'div.ms-list > ul.list',
      item: 'li:not(.top)',
      title: 'div.tit > a',
      titleExclude: 'span',
      link: 'div.tit > a',
    },
    keywords: [
      '해커톤',
      '개발',
      '앱',
      '소프트웨어',
      'SW',
      '프로그래밍',
      '코딩',
      '알고리즘',
      '데이터',
      'data',
      'AI',
      '인공지능',
      '보안',
      '해킹',
      '사이버',
      '클라우드',
      '오픈소스',
      '블록체인',
      '메타버스',
      '로봇',
      '게임',
    ],
    parserVersion: 1,
    enabled: true,
    pagination: { runPages: 2, maxPages: 5 },
    adapter: 'wevity',
  },
  {
    id: 'dacon',
    name: 'DACON 대회',
    kind: 'html',
    listUrl: 'https://dacon.io/competitions',
    allowedHosts: ['dacon.io'],
    authority: 'platform',
    selectors: {
      container: 'div.official-comp',
      item: 'div.comp > a',
      title: 'p.name',
    },
    parserVersion: 1,
    enabled: true,
    pagination: { runPages: 1, maxPages: 1 },
    adapter: 'dacon',
  },
  {
    id: 'oss-notice',
    name: '오픈소스 포털(NIPA) 공지사항',
    kind: 'html',
    listUrl: 'https://www.oss.kr/pages/10?pageSize=20',
    allowedHosts: ['www.oss.kr', 'oss.kr'],
    authority: 'official',
    selectors: {
      container: 'ul#list',
      item: 'li.search-item',
      title: 'p.title > strong > span:last-of-type',
      link: 'a.post-link',
      idAttr: 'data-post-id',
    },
    keywords: [
      '행사',
      '컨퍼런스',
      '콘퍼런스',
      '세미나',
      '밋업',
      '해커톤',
      '대회',
      '공모',
      '챌린지',
      '포럼',
      '워크숍',
      '웨비나',
      '데모데이',
      '심포지엄',
    ],
    parserVersion: 1,
    enabled: true,
    pagination: { runPages: 1, maxPages: 3 },
    minIntervalMs: 1000,
    adapter: 'oss',
  },
]);

export function sourceFingerprint(source: SourceConfig): string {
  const material = JSON.stringify({
    kind: source.kind,
    listUrl: source.listUrl,
    selectors: source.selectors ?? null,
    keywords: source.keywords ?? null,
    parserVersion: source.parserVersion,
    adapter: source.adapter,
  });
  return createHash('sha256').update(material).digest('hex').slice(0, 16);
}

export function selectSources(sources: SourceConfig[], ids: string[]): SourceConfig[] {
  if (ids.length === 0) return sources.filter((source) => source.enabled);
  const unknown = ids.filter((id) => !sources.some((source) => source.id === id));
  if (unknown.length > 0) throw new Error(`알 수 없는 소스입니다: ${unknown.join(', ')}`);
  return sources.filter((source) => ids.includes(source.id));
}
