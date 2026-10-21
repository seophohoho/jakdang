import type { CliCommand, CliContext } from '../cli.js';
import { createFetcher } from '../collectors/fetch.js';
import { requireDatabaseUrl } from '../config.js';
import { createPool } from '../db/client.js';
import { createNotifiers } from '../notifications/index.js';
import { runSync, type RunSyncResult, type SourceRunReport } from '../core/run-sync.js';
import { SOURCES, selectSources } from '../sources.js';

const OUTCOME_LABEL = { new: '신규', known: '기존', duplicate_url: 'URL 중복', baseline: '기준' } as const;

function sourceLine(report: SourceRunReport): string {
  const error = report.error ? ` 오류=${report.error.kind}: ${report.error.message}` : '';
  return (
    `- ${report.sourceId}: ${report.status} | 파싱 ${report.parsed}, 유효 ${report.valid}, 키워드 제외 ${report.keywordFiltered}, 검증 실패 ${report.invalid}` +
    ` | 신규 ${report.newItems}, 기존 ${report.known}, URL 중복 ${report.duplicateUrl}, 기준 ${report.baseline}, 알림 ${report.notificationsCreated}${error}`
  );
}

export function formatSyncResult(result: RunSyncResult, verbose: boolean): string[] {
  const lines: string[] = [];
  if (result.dryRun) {
    lines.push(
      `[dry-run] DB 변경·잠금·실행 기록·Webhook 호출 없음. DB 비교: ${result.dbCompared ? '함' : '안 함(DATABASE_URL 없음, 전부 신규로 가정)'}`,
    );
  }
  lines.push(`실행 ${result.runId ?? '(기록 없음)'} | ${result.bootstrap ? 'bootstrap' : 'sync'} | 상태: ${result.status}`);
  for (const report of result.sources) {
    lines.push(sourceLine(report));
    const shown = report.preview.filter((entry) => verbose || entry.outcome !== 'known');
    for (const entry of shown.slice(0, 20)) {
      lines.push(`    [${OUTCOME_LABEL[entry.outcome]}] ${entry.title} — ${entry.url}`);
    }
    if (shown.length > 20) lines.push(`    … 외 ${shown.length - 20}건`);
  }
  const totals = result.totals;
  lines.push(
    `합계: 신규 ${totals.newItems}, 기존 ${totals.known}, URL 중복 ${totals.duplicateUrl}, 기준 ${totals.baseline}, 알림 ${result.dryRun ? '예상 ' : ''}${totals.notificationsCreated}건`,
  );
  lines.push(`알림 채널: ${result.destinations.length > 0 ? result.destinations.join(', ') : '없음(알림을 만들지 않음)'}`);
  if (result.skippedUninitialized.length > 0) {
    lines.push(
      `초기화 안 된 소스는 ${result.dryRun ? '실제 실행에서 ' : ''}건너뜁니다: ${result.skippedUninitialized.join(', ')}`,
      `  → npm run sync -- --bootstrap ${result.skippedUninitialized.map((id) => `--source ${id}`).join(' ')}`,
    );
  }
  if (!result.dryRun && !result.bootstrap && result.runId) {
    const delivery = result.delivery;
    lines.push(
      delivery.stoppedBy === 'disabled'
        ? '발송: NOTIFICATIONS_ENABLED=false(또는 preview)라 보내지 않았습니다. 알림은 pending으로 남습니다.'
        : `발송: 시도 ${delivery.attempted}, 성공 ${delivery.sent}, 재시도 예약 ${delivery.retryScheduled}, 실패 ${delivery.failed}, 불확실 ${delivery.uncertain} (멈춘 이유: ${delivery.stoppedBy})`,
    );
    if (result.recoveredClaims > 0) lines.push(`전송 중 끊긴 알림 ${result.recoveredClaims}건을 uncertain으로 복구했습니다.`);
    if (result.backlog) {
      lines.push(
        `남은 알림: pending ${result.backlog.pending}, uncertain ${result.backlog.uncertain}, failed ${result.backlog.failed}` +
          (result.backlog.warning ? ' — backlog 경고: 실행당 한도보다 많이 쌓였습니다' : ''),
      );
    }
  }
  if (result.errorSummary) lines.push(`오류 요약: ${result.errorSummary}`);
  return lines;
}

export async function runSyncCommand(
  command: Extract<CliCommand, { name: 'sync' }>,
  context: CliContext,
): Promise<number> {
  const sources = selectSources(SOURCES, command.sourceIds);
  const databaseUrl = command.dryRun ? context.config.databaseUrl : requireDatabaseUrl(context.config);
  const pool = databaseUrl ? createPool(databaseUrl, { applicationName: 'jakdang-cli' }) : null;
  try {
    const result = await runSync(
      {
        pool,
        fetcher: createFetcher(),
        config: context.config,
        logger: context.logger,
        notifiers: createNotifiers(context.config),
      },
      { mode: 'cli', dryRun: command.dryRun, bootstrap: command.bootstrap, sources },
    );
    for (const line of formatSyncResult(result, command.dryRun)) context.print(line);
    return result.status === 'success' ? 0 : 1;
  } finally {
    await pool?.end();
  }
}
