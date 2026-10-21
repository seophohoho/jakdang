import { randomUUID } from 'node:crypto';
import type { DestinationId } from '../config.js';
import type { Pool } from '../db/client.js';
import {
  bumpAttempt,
  claimNextDue,
  completeSent,
  countNotifications,
  finishWithStatus,
  recoverExpiredClaims,
  releaseForRetry,
  type NotificationRow,
} from '../db/repository.js';
import { errorMessage, redact, type Logger } from '../log.js';
import { WEBHOOK_TIMEOUT_MS, type Notifier, type SendOutcome } from '../notifications/webhook.js';
import type { Lease } from './lease.js';

export const CLAIM_MS = 60_000;
export const RETRY_SCHEDULE_MS = [60_000, 5 * 60_000, 30 * 60_000];
export const MAX_SERVER_ERROR_ATTEMPTS = RETRY_SCHEDULE_MS.length + 1;
export const MAX_TOTAL_ATTEMPTS = 10;
export const SHORT_RETRY_MAX_WAIT_MS = 5_000;
export const SHORT_RETRY_DEFAULT_WAIT_MS = 2_000;
export const MIN_SEND_WINDOW_MS = 3_000;

export interface DeliverOptions {
  pool: Pool;
  notifiers: Map<DestinationId, Notifier>;
  enabled: boolean;
  limit: number;
  remainingMs: () => number;
  lease?: Lease;
  logger: Logger;
  secrets: readonly string[];
  sleep?: (ms: number) => Promise<void>;
  includeScheduled?: boolean;
}

export type DeliveryStopReason = 'limit' | 'budget' | 'empty' | 'disabled' | 'no_destinations' | 'zero_limit';

export interface DeliverySummary {
  attempted: number;
  sent: number;
  retryScheduled: number;
  failed: number;
  uncertain: number;
  claimLost: number;
  stoppedBy: DeliveryStopReason;
}

export function emptyDeliverySummary(stoppedBy: DeliveryStopReason): DeliverySummary {
  return { attempted: 0, sent: 0, retryScheduled: 0, failed: 0, uncertain: 0, claimLost: 0, stoppedBy };
}

export function mergeDeliverySummaries(first: DeliverySummary, second: DeliverySummary): DeliverySummary {
  return {
    attempted: first.attempted + second.attempted,
    sent: first.sent + second.sent,
    retryScheduled: first.retryScheduled + second.retryScheduled,
    failed: first.failed + second.failed,
    uncertain: first.uncertain + second.uncertain,
    claimLost: first.claimLost + second.claimLost,
    stoppedBy: second.stoppedBy,
  };
}

function isRetryable(outcome: SendOutcome): boolean {
  return outcome.kind === 'server_error' || outcome.kind === 'not_sent' || outcome.kind === 'rate_limited';
}

function shortRetryWait(outcome: SendOutcome): number | null {
  if (outcome.kind === 'rate_limited') return outcome.retryAfterMs <= SHORT_RETRY_MAX_WAIT_MS ? outcome.retryAfterMs : null;
  if (outcome.kind === 'server_error' || outcome.kind === 'not_sent') return SHORT_RETRY_DEFAULT_WAIT_MS;
  return null;
}

function rejectionGuidance(status: number): string {
  if (status === 401 || status === 403) return 'Webhook 권한 또는 토큰을 확인하세요';
  if (status === 404) return 'Webhook이 삭제됐거나 주소가 잘못됐습니다';
  if (status === 400) return 'payload 형식을 확인하세요';
  return '설정을 확인한 뒤 notifications:resolve로 재시도하세요';
}

async function sendOnce(
  notifier: Notifier,
  row: NotificationRow,
  options: DeliverOptions,
): Promise<SendOutcome> {
  const timeoutMs = Math.max(1_000, Math.min(WEBHOOK_TIMEOUT_MS, options.remainingMs() - 1_000));
  try {
    return await notifier.send(row.payload, { timeoutMs });
  } catch (error) {
    return { kind: 'uncertain', detail: `전송 중 예외: ${redact(errorMessage(error), options.secrets)}` };
  }
}

async function applyOutcome(
  pool: Pool,
  row: NotificationRow,
  token: string,
  attempts: number,
  outcome: SendOutcome,
): Promise<{ updated: boolean; bucket: 'sent' | 'retryScheduled' | 'failed' | 'uncertain' }> {
  switch (outcome.kind) {
    case 'sent':
      return { updated: await completeSent(pool, row.id, token, outcome.remoteMessageId), bucket: 'sent' };
    case 'rate_limited':
      if (attempts >= MAX_TOTAL_ATTEMPTS) {
        return {
          updated: await finishWithStatus(pool, row.id, token, 'failed', `시도 ${attempts}회 초과: ${outcome.detail}`),
          bucket: 'failed',
        };
      }
      return {
        updated: await releaseForRetry(pool, row.id, token, outcome.retryAfterMs, `429 속도 제한: ${outcome.detail}`),
        bucket: 'retryScheduled',
      };
    case 'server_error':
    case 'not_sent': {
      if (attempts >= MAX_SERVER_ERROR_ATTEMPTS || attempts >= MAX_TOTAL_ATTEMPTS) {
        return {
          updated: await finishWithStatus(pool, row.id, token, 'failed', `재시도 ${attempts}회 후 포기: ${outcome.detail}`),
          bucket: 'failed',
        };
      }
      const delay = RETRY_SCHEDULE_MS[Math.min(attempts - 1, RETRY_SCHEDULE_MS.length - 1)] ?? RETRY_SCHEDULE_MS[0]!;
      return { updated: await releaseForRetry(pool, row.id, token, delay, outcome.detail), bucket: 'retryScheduled' };
    }
    case 'rejected':
      return {
        updated: await finishWithStatus(pool, row.id, token, 'failed', `${outcome.detail} — ${rejectionGuidance(outcome.status)}`),
        bucket: 'failed',
      };
    case 'uncertain':
      return {
        updated: await finishWithStatus(
          pool,
          row.id,
          token,
          'uncertain',
          `${outcome.detail} — 채널에서 참조 ID를 확인한 뒤 notifications:resolve로 처리하세요`,
        ),
        bucket: 'uncertain',
      };
  }
}

export async function deliverDue(options: DeliverOptions): Promise<DeliverySummary> {
  if (!options.enabled) return emptyDeliverySummary('disabled');
  if (options.limit <= 0) return emptyDeliverySummary('zero_limit');
  const destinations = [...options.notifiers.keys()];
  if (destinations.length === 0) return emptyDeliverySummary('no_destinations');
  const sleep = options.sleep ?? ((ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms)));
  const summary = emptyDeliverySummary('limit');
  while (summary.attempted < options.limit) {
    if (options.remainingMs() < MIN_SEND_WINDOW_MS) {
      summary.stoppedBy = 'budget';
      return summary;
    }
    await options.lease?.ensure();
    const token = randomUUID();
    const row = await claimNextDue(options.pool, {
      destinationIds: destinations,
      claimToken: token,
      claimMs: CLAIM_MS,
      includeScheduled: options.includeScheduled,
    });
    if (!row) {
      summary.stoppedBy = 'empty';
      return summary;
    }
    summary.attempted += 1;
    const notifier = options.notifiers.get(row.destinationId as DestinationId) as Notifier;
    let attempts = row.attempts;
    let outcome = await sendOnce(notifier, row, options);
    const wait = shortRetryWait(outcome);
    if (wait !== null && attempts < MAX_TOTAL_ATTEMPTS && options.remainingMs() - wait > MIN_SEND_WINDOW_MS + WEBHOOK_TIMEOUT_MS) {
      options.logger.info('같은 실행 안에서 한 번 더 시도합니다', { notificationId: row.id, waitMs: wait, previous: outcome.kind });
      await sleep(wait);
      if (await bumpAttempt(options.pool, row.id, token)) {
        attempts += 1;
        outcome = await sendOnce(notifier, row, options);
      }
    }
    const { updated, bucket } = await applyOutcome(options.pool, row, token, attempts, outcome);
    if (!updated) {
      summary.claimLost += 1;
      options.logger.warn('알림 claim을 잃어 상태를 갱신하지 못했습니다', { notificationId: row.id, outcome: outcome.kind });
      continue;
    }
    summary[bucket] += 1;
    const level = bucket === 'sent' ? 'info' : isRetryable(outcome) ? 'warn' : 'error';
    options.logger[level]('알림 처리 결과', {
      notificationId: row.id,
      destination: row.destinationId,
      result: outcome.kind,
      attempts,
      detail: 'detail' in outcome ? outcome.detail : undefined,
    });
  }
  return summary;
}

export interface BacklogStatus {
  pending: number;
  duePending: number;
  uncertain: number;
  failed: number;
  warning: boolean;
}

export async function backlogStatus(pool: Pool, maxPerRun: number): Promise<BacklogStatus> {
  const counts = await countNotifications(pool);
  return {
    pending: counts.pending,
    duePending: counts.duePending,
    uncertain: counts.uncertain,
    failed: counts.failed,
    warning: counts.pending > maxPerRun,
  };
}

export { recoverExpiredClaims };
