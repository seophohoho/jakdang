import { createFetcher, type Fetcher } from '../collectors/fetch.js';
import type { SourceConfig } from '../collectors/types.js';
import { collectSource } from '../core/collect.js';
import { prepareItems } from '../core/detect.js';
import { SOURCES, selectSources } from '../sources.js';

export interface SourceCheckReport {
  sourceId: string;
  ok: boolean;
  lines: string[];
}

export async function checkSource(source: SourceConfig, fetcher: Fetcher): Promise<SourceCheckReport> {
  const result = await collectSource(source, { fetcher, pages: source.pagination.runPages });
  const prepared = prepareItems(source, result.items);
  const ok = result.status === 'ok' && prepared.items.length + prepared.filteredByKeyword > 0;
  const lines = [
    `[${ok ? '정상' : '실패'}] ${source.id} (${source.name})`,
    `  상태: ${result.status}, 읽은 페이지: ${result.pagesFetched}/${source.pagination.runPages}`,
    `  파싱 ${result.items.length}건 → 유효 ${prepared.items.length}건, 키워드 제외 ${prepared.filteredByKeyword}건, 검증 실패 ${prepared.invalid.length}건`,
  ];
  if (result.error) lines.push(`  오류: ${result.error.kind} (페이지 ${result.error.page}) ${result.error.message}`);
  for (const item of prepared.items.slice(0, 3)) {
    lines.push(`  예시: [${item.externalKey}] ${item.title}`, `        ${item.url}`);
  }
  for (const item of prepared.invalid.slice(0, 3)) {
    lines.push(`  검증 실패: ${item.reason} — ${item.title || '(제목 없음)'}`);
  }
  return { sourceId: source.id, ok, lines };
}

export async function runSourcesCheck(
  sourceIds: string[],
  print: (line: string) => void,
  fetcher: Fetcher = createFetcher(),
  sources: SourceConfig[] = SOURCES,
): Promise<number> {
  const selected = selectSources(sources, sourceIds);
  const reports = await Promise.all(selected.map((source) => checkSource(source, fetcher)));
  for (const report of reports) for (const line of report.lines) print(line);
  const failed = reports.filter((report) => !report.ok).length;
  print(`\n소스 ${reports.length}개 중 ${reports.length - failed}개 정상, ${failed}개 실패`);
  return failed === 0 ? 0 : 1;
}
