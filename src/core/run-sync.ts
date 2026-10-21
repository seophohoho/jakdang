import type { Fetcher } from '../collectors/fetch.js';
import type { SourceConfig } from '../collectors/types.js';
import { secretValues, type AppConfig, type DestinationId } from '../config.js';
import { withReadOnlyTransaction, type Pool } from '../db/client.js';
import {
  finishJobRun,
  findKnownExternalKeys,
  findKnownNormalizedUrls,
  getSourceStates,
  markSourceInitialized,
  recordItem,
  recordSkippedRun,
  recordSourceError,
  recordSourceSuccess,
  startJobRun,
  type NotificationDraft,
  type SourceStateRow,
} from '../db/repository.js';
import { errorMessage, type Logger } from '../log.js';
import { buildPayload } from '../notifications/format.js';
import type { Notifier } from '../notifications/webhook.js';
import { sourceFingerprint } from '../sources.js';
import { collectSource, type CollectErrorKind, type CollectResult } from './collect.js';
import {
  backlogStatus,
  deliverDue,
  emptyDeliverySummary,
  mergeDeliverySummaries,
  recoverExpiredClaims,
  type BacklogStatus,
  type DeliverySummary,
} from './deliver.js';
import { prepareItems, type CandidateItem } from './detect.js';
import { Lease, LockLostError } from './lease.js';

export const SYNC_LOCK_NAME = 'sync';
export const LEASE_MS = 300_000;
export const LEASE_RENEW_EVERY_MS = 30_000;
export const FINISH_RESERVE_MS = 10_000;
export const SOURCE_CONCURRENCY = 3;

export type RunMode = 'cron' | 'cli';

export interface RunSyncOptions {
  mode: RunMode;
  dryRun?: boolean;
  bootstrap?: boolean;
  sources: SourceConfig[];
}

export interface RunSyncDeps {
  pool: Pool | null;
  fetcher: Fetcher;
  config: AppConfig;
  logger: Logger;
  notifiers?: Map<DestinationId, Notifier>;
  now?: () => number;
  sleep?: (ms: number) => Promise<void>;
}

export type SourceRunStatus =
  | 'ok'
  | 'not_modified'
  | 'partial'
  | 'error'
  | 'skipped_uninitialized'
  | 'skipped_budget';

export interface SourceRunReport {
  sourceId: string;
  status: SourceRunStatus;
  error: { kind: CollectErrorKind | 'lock_lost' | 'db_error'; message: string } | null;
  parsed: number;
  valid: number;
  invalid: number;
  keywordFiltered: number;
  newItems: number;
  known: number;
  duplicateUrl: number;
  baseline: number;
  notificationsCreated: number;
  initialized: boolean;
  preview: Array<{ title: string; url: string; externalKey: string; outcome: 'new' | 'known' | 'duplicate_url' | 'baseline' }>;
}

export type RunStatus = 'success' | 'partial' | 'failed' | 'skipped';

export interface RunSyncResult {
  runId: string | null;
  status: RunStatus;
  dryRun: boolean;
  bootstrap: boolean;
  sources: SourceRunReport[];
  totals: {
    newItems: number;
    known: number;
    duplicateUrl: number;
    baseline: number;
    invalid: number;
    keywordFiltered: number;
    notificationsCreated: number;
  };
  skippedUninitialized: string[];
  destinations: DestinationId[];
  dbCompared: boolean;
  errorSummary: string | null;
  recoveredClaims: number;
  delivery: DeliverySummary;
  backlog: BacklogStatus | null;
}

function emptyReport(sourceId: string, status: SourceRunStatus): SourceRunReport {
  return {
    sourceId,
    status,
    error: null,
    parsed: 0,
    valid: 0,
    invalid: 0,
    keywordFiltered: 0,
    newItems: 0,
    known: 0,
    duplicateUrl: 0,
    baseline: 0,
    notificationsCreated: 0,
    initialized: false,
    preview: [],
  };
}

export async function mapWithConcurrency<T, R>(items: T[], limit: number, task: (item: T) => Promise<R>): Promise<R[]> {
  const results = new Array<R>(items.length);
  let next = 0;
  let firstError: { error: unknown } | null = null;
  const workers = Array.from({ length: Math.min(limit, items.length) }, async () => {
    while (next < items.length && firstError === null) {
      const index = next;
      next += 1;
      try {
        results[index] = await task(items[index] as T);
      } catch (error) {
        firstError ??= { error };
      }
    }
  });
  await Promise.all(workers);
  if (firstError !== null) throw (firstError as { error: unknown }).error;
  return results;
}

class Mutex {
  private tail: Promise<void> = Promise.resolve();

  async run<T>(task: () => Promise<T>): Promise<T> {
    const previous = this.tail;
    let release!: () => void;
    this.tail = new Promise<void>((resolve) => {
      release = resolve;
    });
    await previous;
    try {
      return await task();
    } finally {
      release();
    }
  }
}

function configuredDestinations(config: AppConfig): DestinationId[] {
  return (Object.keys(config.webhooks) as DestinationId[]).sort();
}

function summarize(sources: SourceRunReport[]): RunSyncResult['totals'] {
  return sources.reduce(
    (totals, report) => ({
      newItems: totals.newItems + report.newItems,
      known: totals.known + report.known,
      duplicateUrl: totals.duplicateUrl + report.duplicateUrl,
      baseline: totals.baseline + report.baseline,
      invalid: totals.invalid + report.invalid,
      keywordFiltered: totals.keywordFiltered + report.keywordFiltered,
      notificationsCreated: totals.notificationsCreated + report.notificationsCreated,
    }),
    { newItems: 0, known: 0, duplicateUrl: 0, baseline: 0, invalid: 0, keywordFiltered: 0, notificationsCreated: 0 },
  );
}

function overallStatus(sources: SourceRunReport[]): Exclude<RunStatus, 'skipped'> {
  const attempted = sources.filter((report) => report.status !== 'skipped_uninitialized');
  if (attempted.length === 0) return 'success';
  const failed = attempted.filter((report) => report.status === 'error' || report.status === 'skipped_budget');
  const degraded = attempted.filter((report) => report.status === 'partial');
  if (failed.length === attempted.length) return 'failed';
  if (failed.length > 0 || degraded.length > 0) return 'partial';
  return 'success';
}

function errorSummaryOf(sources: SourceRunReport[]): string | null {
  const parts = sources
    .filter((report) => report.error !== null)
    .map((report) => `${report.sourceId}: ${report.error?.kind} ${report.error?.message}`);
  return parts.length > 0 ? parts.join(' | ') : null;
}

export function countsForJobRun(
  result: Pick<RunSyncResult, 'sources' | 'totals' | 'skippedUninitialized' | 'recoveredClaims' | 'delivery' | 'backlog'>,
) {
  return {
    totals: result.totals,
    skippedUninitialized: result.skippedUninitialized,
    recoveredClaims: result.recoveredClaims,
    delivery: result.delivery,
    backlog: result.backlog,
    sources: Object.fromEntries(
      result.sources.map((report) => [
        report.sourceId,
        {
          status: report.status,
          error: report.error,
          parsed: report.parsed,
          valid: report.valid,
          invalid: report.invalid,
          keywordFiltered: report.keywordFiltered,
          new: report.newItems,
          known: report.known,
          duplicateUrl: report.duplicateUrl,
          baseline: report.baseline,
          notificationsCreated: report.notificationsCreated,
          initialized: report.initialized,
        },
      ]),
    ),
  };
}

function notificationBuilder(source: SourceConfig, item: CandidateItem, destinations: DestinationId[]) {
  return ({ itemId, firstSeenAt }: { itemId: string; firstSeenAt: Date }): NotificationDraft[] =>
    destinations.map((destinationId) => ({
      destinationId,
      payload: buildPayload(destinationId, {
        title: item.title,
        url: item.url,
        sourceName: source.name,
        seenAt: firstSeenAt,
        itemId,
      }),
    }));
}

function applyCollect(report: SourceRunReport, result: CollectResult) {
  report.status = result.status;
  if (result.error) report.error = { kind: result.error.kind, message: result.error.message };
  report.parsed = result.items.length;
}

async function runDry(
  deps: RunSyncDeps,
  options: RunSyncOptions,
  destinations: DestinationId[],
): Promise<RunSyncResult> {
  const sourceIds = options.sources.map((source) => source.id);
  const states = deps.pool
    ? await withReadOnlyTransaction(deps.pool, (client) => getSourceStates(client, sourceIds))
    : new Map<string, SourceStateRow>();
  const collected = await mapWithConcurrency(options.sources, SOURCE_CONCURRENCY, async (source) => ({
    source,
    result: await collectSource(source, {
      fetcher: deps.fetcher,
      pages: options.bootstrap ? source.pagination.maxPages : source.pagination.runPages,
    }),
  }));
  const reports: SourceRunReport[] = [];
  const skippedUninitialized: string[] = [];
  const seenUrls = new Set<string>();
  for (const { source, result } of collected) {
    const report = emptyReport(source.id, result.status);
    applyCollect(report, result);
    const prepared = prepareItems(source, result.items);
    report.valid = prepared.items.length;
    report.invalid = prepared.invalid.length;
    report.keywordFiltered = prepared.filteredByKeyword;
    const initialized = Boolean(states.get(source.id)?.initializedAt);
    report.initialized = initialized;
    if (!options.bootstrap && deps.pool && !initialized) skippedUninitialized.push(source.id);
    const { knownKeys, knownUrls } = deps.pool
      ? await withReadOnlyTransaction(deps.pool, async (client) => ({
          knownKeys: await findKnownExternalKeys(client, source.id, prepared.items.map((item) => item.externalKey)),
          knownUrls: await findKnownNormalizedUrls(client, prepared.items.map((item) => item.normalizedUrl)),
        }))
      : { knownKeys: new Set<string>(), knownUrls: new Set<string>() };
    for (const item of [...prepared.items].reverse()) {
      let outcome: SourceRunReport['preview'][number]['outcome'];
      if (knownKeys.has(item.externalKey)) outcome = 'known';
      else if (options.bootstrap) outcome = 'baseline';
      else if (knownUrls.has(item.normalizedUrl) || seenUrls.has(item.normalizedUrl)) outcome = 'duplicate_url';
      else outcome = 'new';
      seenUrls.add(item.normalizedUrl);
      if (outcome === 'known') report.known += 1;
      if (outcome === 'baseline') report.baseline += 1;
      if (outcome === 'duplicate_url') report.duplicateUrl += 1;
      if (outcome === 'new') {
        report.newItems += 1;
        report.notificationsCreated += destinations.length;
      }
      report.preview.push({ title: item.title, url: item.url, externalKey: item.externalKey, outcome });
    }
    reports.push(report);
  }
  const totals = summarize(reports);
  return {
    runId: null,
    status: overallStatus(reports),
    dryRun: true,
    bootstrap: Boolean(options.bootstrap),
    sources: reports,
    totals,
    skippedUninitialized,
    destinations,
    dbCompared: deps.pool !== null,
    errorSummary: errorSummaryOf(reports),
    recoveredClaims: 0,
    delivery: emptyDeliverySummary('disabled'),
    backlog: null,
  };
}

export async function runSync(deps: RunSyncDeps, options: RunSyncOptions): Promise<RunSyncResult> {
  const destinations = configuredDestinations(deps.config);
  if (options.dryRun) return runDry(deps, options, destinations);
  if (!deps.pool) throw new Error('DB 연결 없이 실제 실행을 할 수 없습니다');
  const pool = deps.pool;
  const now = deps.now ?? Date.now;
  const bootstrap = Boolean(options.bootstrap);
  const modeLabel = bootstrap ? 'bootstrap' : options.mode;
  const deadline = bootstrap ? Number.POSITIVE_INFINITY : now() + deps.config.runBudgetMs;
  const remainingMs = () => deadline - now() - FINISH_RESERVE_MS;

  const lease = await Lease.acquire(pool, SYNC_LOCK_NAME, { leaseMs: LEASE_MS, renewEveryMs: LEASE_RENEW_EVERY_MS, now });
  if (!lease) {
    const runId = await recordSkippedRun(pool, modeLabel, '다른 실행이 잠금을 보유하고 있어 건너뜀');
    deps.logger.warn('다른 실행이 진행 중이라 이번 실행을 건너뜁니다', { runId });
    return {
      runId,
      status: 'skipped',
      dryRun: false,
      bootstrap,
      sources: [],
      totals: summarize([]),
      skippedUninitialized: [],
      destinations,
      dbCompared: true,
      errorSummary: '다른 실행이 잠금을 보유 중',
      recoveredClaims: 0,
      delivery: emptyDeliverySummary('disabled'),
      backlog: null,
    };
  }

  const runId = await startJobRun(pool, modeLabel);
  const reports: SourceRunReport[] = [];
  const skippedUninitialized: string[] = [];
  let fatal: string | null = null;
  let recoveredClaims = 0;
  let delivery = emptyDeliverySummary(bootstrap ? 'disabled' : 'empty');
  let backlog: BacklogStatus | null = null;
  const maxPerRun = deps.config.maxNotificationsPerRun;
  const deliver = (limit: number) =>
    deliverDue({
      pool,
      notifiers: deps.notifiers ?? new Map(),
      enabled: deps.config.notificationsEnabled,
      limit,
      remainingMs,
      lease,
      logger: deps.logger,
      secrets: secretValues(deps.config),
      sleep: deps.sleep,
    });
  try {
    recoveredClaims = await recoverExpiredClaims(pool);
    if (recoveredClaims > 0) deps.logger.warn('전송 중 끊긴 알림을 uncertain으로 돌렸습니다', { count: recoveredClaims });
    if (!bootstrap) delivery = await deliver(Math.ceil(maxPerRun / 2));
    if (destinations.length === 0 && !bootstrap) {
      deps.logger.warn('설정된 알림 채널이 없어 새 항목의 알림을 만들지 않습니다');
    }
    const states = await getSourceStates(
      pool,
      options.sources.map((source) => source.id),
    );
    const recorder = new Mutex();
    const results = await mapWithConcurrency(options.sources, SOURCE_CONCURRENCY, async (source) => {
      const state = states.get(source.id);
      if (!bootstrap && !state?.initializedAt) {
        skippedUninitialized.push(source.id);
        return emptyReport(source.id, 'skipped_uninitialized');
      }
      if (remainingMs() < 2_000) {
        const report = emptyReport(source.id, 'skipped_budget');
        report.error = { kind: 'budget_exhausted', message: '작업 시간이 부족해 소스를 건너뜀' };
        report.initialized = Boolean(state?.initializedAt);
        return report;
      }
      const fingerprint = sourceFingerprint(source);
      const conditional =
        !bootstrap && state && state.configFingerprint === fingerprint && (state.etag || state.lastModified)
          ? { etag: state.etag, lastModified: state.lastModified }
          : null;
      const result = await collectSource(source, {
        fetcher: deps.fetcher,
        pages: bootstrap ? source.pagination.maxPages : source.pagination.runPages,
        remainingMs,
        conditional,
      });
      try {
        return await recorder.run(() =>
          recordSourceResult(pool, lease, deps, source, result, { bootstrap, destinations, fingerprint, state, remainingMs }),
        );
      } catch (error) {
        if (error instanceof LockLostError) throw error;
        const report = emptyReport(source.id, 'error');
        applyCollect(report, result);
        report.status = 'error';
        report.error = { kind: 'db_error', message: errorMessage(error) };
        deps.logger.error('소스 결과 저장 실패', { sourceId: source.id, error: report.error.message });
        return report;
      }
    });
    reports.push(...results);
    if (!bootstrap) {
      delivery = mergeDeliverySummaries(delivery, await deliver(maxPerRun - delivery.attempted));
      backlog = await backlogStatus(pool, maxPerRun);
      if (backlog.warning) {
        deps.logger.warn('미발송 알림이 쌓이고 있습니다', { pending: backlog.pending, maxPerRun });
      }
    }
  } catch (error) {
    fatal = error instanceof LockLostError ? error.message : `실행 중 오류: ${errorMessage(error)}`;
    deps.logger.error('동기화 실행 실패', { runId, error: fatal });
  }

  const totals = summarize(reports);
  const status = fatal ? 'failed' : overallStatus(reports);
  const errorSummary = [fatal, errorSummaryOf(reports)].filter(Boolean).join(' | ') || null;
  const result: RunSyncResult = {
    runId,
    status,
    dryRun: false,
    bootstrap,
    sources: reports,
    totals,
    skippedUninitialized,
    destinations,
    dbCompared: true,
    errorSummary,
    recoveredClaims,
    delivery,
    backlog,
  };
  try {
    await finishJobRun(pool, runId, status, countsForJobRun(result), errorSummary);
  } finally {
    await lease.release().catch(() => false);
  }
  deps.logger.info('동기화 실행 완료', { runId, status, totals, delivery, backlog });
  return result;
}

interface RecordContext {
  bootstrap: boolean;
  destinations: DestinationId[];
  fingerprint: string;
  state: SourceStateRow | undefined;
  remainingMs: () => number;
}

async function recordSourceResult(
  pool: Pool,
  lease: Lease,
  deps: RunSyncDeps,
  source: SourceConfig,
  result: CollectResult,
  context: RecordContext,
): Promise<SourceRunReport> {
  const report = emptyReport(source.id, result.status);
  applyCollect(report, result);
  report.initialized = Boolean(context.state?.initializedAt);
  await lease.ensure();
  if (result.status === 'error') {
    await recordSourceError(pool, source.id, `${result.error?.kind}: ${result.error?.message}`);
    deps.logger.warn('소스 수집 실패', { sourceId: source.id, error: report.error });
    return report;
  }
  if (result.status === 'not_modified') {
    await recordSourceSuccess(pool, source.id, {
      etag: context.state?.etag ?? result.etag,
      lastModified: context.state?.lastModified ?? result.lastModified,
      configFingerprint: context.fingerprint,
    });
    return report;
  }
  const prepared = prepareItems(source, result.items);
  report.valid = prepared.items.length;
  report.invalid = prepared.invalid.length;
  report.keywordFiltered = prepared.filteredByKeyword;
  let interrupted = false;
  for (const item of [...prepared.items].reverse()) {
    if (!context.bootstrap && context.remainingMs() < 1_000) {
      interrupted = true;
      break;
    }
    await lease.ensure();
    const recorded = await recordItem(pool, { ...item, sourceId: source.id }, {
      baseline: context.bootstrap,
      buildNotifications: notificationBuilder(source, item, context.destinations),
    });
    if (recorded.outcome === 'new') report.newItems += 1;
    if (recorded.outcome === 'known') report.known += 1;
    if (recorded.outcome === 'duplicate_url') report.duplicateUrl += 1;
    if (recorded.outcome === 'baseline') report.baseline += 1;
    report.notificationsCreated += recorded.notificationIds.length;
    if (recorded.outcome !== 'known') {
      report.preview.push({ title: item.title, url: item.url, externalKey: item.externalKey, outcome: recorded.outcome });
    }
  }
  await lease.ensure();
  if (interrupted) {
    report.status = 'partial';
    report.error = { kind: 'budget_exhausted', message: '작업 시간이 부족해 일부 항목 저장을 다음 실행으로 미룸' };
    await recordSourceError(pool, source.id, `budget_exhausted: ${report.error.message}`);
    return report;
  }
  if (result.status === 'partial') {
    await recordSourceError(pool, source.id, `${result.error?.kind}: ${result.error?.message}`);
    return report;
  }
  await recordSourceSuccess(pool, source.id, {
    etag: result.etag,
    lastModified: result.lastModified,
    configFingerprint: context.fingerprint,
  });
  if (context.bootstrap) {
    await markSourceInitialized(pool, source.id);
    report.initialized = true;
  }
  return report;
}
