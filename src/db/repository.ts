import { withTransaction, type Pool, type Queryable } from './client.js';

export interface SourceStateRow {
  sourceId: string;
  initializedAt: Date | null;
  etag: string | null;
  lastModified: string | null;
  configFingerprint: string | null;
  lastSuccessAt: Date | null;
  lastError: string | null;
  lastErrorAt: Date | null;
}

export async function getSourceStates(q: Queryable, sourceIds: string[]): Promise<Map<string, SourceStateRow>> {
  const { rows } = await q.query(
    `SELECT source_id, initialized_at, etag, last_modified, config_fingerprint, last_success_at, last_error, last_error_at
       FROM source_state WHERE source_id = ANY($1::text[])`,
    [sourceIds],
  );
  return new Map(
    rows.map((row) => [
      row.source_id,
      {
        sourceId: row.source_id,
        initializedAt: row.initialized_at,
        etag: row.etag,
        lastModified: row.last_modified,
        configFingerprint: row.config_fingerprint,
        lastSuccessAt: row.last_success_at,
        lastError: row.last_error,
        lastErrorAt: row.last_error_at,
      },
    ]),
  );
}

export interface SourceSuccessInput {
  etag: string | null;
  lastModified: string | null;
  configFingerprint: string;
}

export async function recordSourceSuccess(q: Queryable, sourceId: string, input: SourceSuccessInput): Promise<void> {
  await q.query(
    `INSERT INTO source_state (source_id, etag, last_modified, config_fingerprint, last_success_at, last_error, last_error_at)
     VALUES ($1, $2, $3, $4, now(), NULL, NULL)
     ON CONFLICT (source_id) DO UPDATE SET
       etag = EXCLUDED.etag,
       last_modified = EXCLUDED.last_modified,
       config_fingerprint = EXCLUDED.config_fingerprint,
       last_success_at = EXCLUDED.last_success_at,
       last_error = NULL,
       last_error_at = NULL`,
    [sourceId, input.etag, input.lastModified, input.configFingerprint],
  );
}

export async function recordSourceError(q: Queryable, sourceId: string, error: string): Promise<void> {
  await q.query(
    `INSERT INTO source_state (source_id, last_error, last_error_at) VALUES ($1, $2, now())
     ON CONFLICT (source_id) DO UPDATE SET last_error = EXCLUDED.last_error, last_error_at = EXCLUDED.last_error_at`,
    [sourceId, error.slice(0, 1000)],
  );
}

export async function markSourceInitialized(q: Queryable, sourceId: string): Promise<void> {
  await q.query(
    `INSERT INTO source_state (source_id, initialized_at) VALUES ($1, now())
     ON CONFLICT (source_id) DO UPDATE SET initialized_at = COALESCE(source_state.initialized_at, EXCLUDED.initialized_at)`,
    [sourceId],
  );
}

export interface ItemInput {
  sourceId: string;
  externalKey: string;
  url: string;
  normalizedUrl: string;
  title: string;
}

export interface NotificationDraft {
  destinationId: string;
  payload: unknown;
}

export interface NotificationContext {
  itemId: string;
  firstSeenAt: Date;
}

export type RecordItemOutcome = 'new' | 'known' | 'duplicate_url' | 'baseline';

export interface RecordItemResult {
  outcome: RecordItemOutcome;
  itemId: string;
  notificationIds: string[];
}

export interface RecordItemOptions {
  baseline: boolean;
  buildNotifications: (context: NotificationContext) => NotificationDraft[];
}

export async function recordItem(pool: Pool, item: ItemInput, options: RecordItemOptions): Promise<RecordItemResult> {
  return withTransaction(pool, async (client) => {
    const inserted = await client.query<{ id: string; first_seen_at: Date }>(
      `INSERT INTO source_items (source_id, external_key, url, normalized_url, title, is_baseline)
       VALUES ($1, $2, $3, $4, $5, $6)
       ON CONFLICT (source_id, external_key) DO NOTHING
       RETURNING id, first_seen_at`,
      [item.sourceId, item.externalKey, item.url, item.normalizedUrl, item.title, options.baseline],
    );
    const row = inserted.rows[0];
    if (!row) {
      const touched = await client.query<{ id: string }>(
        `UPDATE source_items SET last_seen_at = now()
          WHERE source_id = $1 AND external_key = $2 RETURNING id`,
        [item.sourceId, item.externalKey],
      );
      const id = touched.rows[0]?.id;
      if (!id) throw new Error('기존 항목을 찾지 못했습니다');
      return { outcome: 'known', itemId: id, notificationIds: [] };
    }
    if (options.baseline) return { outcome: 'baseline', itemId: row.id, notificationIds: [] };
    const duplicate = await client.query(
      'SELECT 1 FROM source_items WHERE normalized_url = $1 AND id <> $2 LIMIT 1',
      [item.normalizedUrl, row.id],
    );
    if ((duplicate.rowCount ?? 0) > 0) return { outcome: 'duplicate_url', itemId: row.id, notificationIds: [] };
    const notificationIds: string[] = [];
    for (const draft of options.buildNotifications({ itemId: row.id, firstSeenAt: row.first_seen_at })) {
      const created = await client.query<{ id: string }>(
        `INSERT INTO notifications (source_item_id, destination_id, kind, dedupe_key, payload, status)
         VALUES ($1, $2, 'new', $3, $4::jsonb, 'pending') RETURNING id`,
        [row.id, draft.destinationId, `${row.id}:new`, JSON.stringify(draft.payload)],
      );
      const id = created.rows[0]?.id;
      if (id) notificationIds.push(id);
    }
    return { outcome: 'new', itemId: row.id, notificationIds };
  });
}

export async function findKnownExternalKeys(q: Queryable, sourceId: string, keys: string[]): Promise<Set<string>> {
  if (keys.length === 0) return new Set();
  const { rows } = await q.query<{ external_key: string }>(
    'SELECT external_key FROM source_items WHERE source_id = $1 AND external_key = ANY($2::text[])',
    [sourceId, keys],
  );
  return new Set(rows.map((row) => row.external_key));
}

export async function findKnownNormalizedUrls(q: Queryable, urls: string[]): Promise<Set<string>> {
  if (urls.length === 0) return new Set();
  const { rows } = await q.query<{ normalized_url: string }>(
    'SELECT DISTINCT normalized_url FROM source_items WHERE normalized_url = ANY($1::text[])',
    [urls],
  );
  return new Set(rows.map((row) => row.normalized_url));
}

export async function tryAcquireLock(q: Queryable, name: string, owner: string, leaseMs: number): Promise<boolean> {
  const { rowCount } = await q.query(
    `INSERT INTO job_locks (name, owner, expires_at)
     VALUES ($1, $2, now() + make_interval(secs => $3::double precision / 1000))
     ON CONFLICT (name) DO UPDATE SET owner = EXCLUDED.owner, expires_at = EXCLUDED.expires_at
       WHERE job_locks.expires_at < now()
     RETURNING owner`,
    [name, owner, leaseMs],
  );
  return (rowCount ?? 0) === 1;
}

export async function renewLock(q: Queryable, name: string, owner: string, leaseMs: number): Promise<boolean> {
  const { rowCount } = await q.query(
    `UPDATE job_locks SET expires_at = now() + make_interval(secs => $3::double precision / 1000)
      WHERE name = $1 AND owner = $2 AND expires_at >= now()`,
    [name, owner, leaseMs],
  );
  return (rowCount ?? 0) === 1;
}

export async function releaseLock(q: Queryable, name: string, owner: string): Promise<boolean> {
  const { rowCount } = await q.query('DELETE FROM job_locks WHERE name = $1 AND owner = $2', [name, owner]);
  return (rowCount ?? 0) === 1;
}

export const NOTIFICATION_STATUSES = ['pending', 'sending', 'sent', 'failed', 'uncertain'] as const;
export type NotificationStatus = (typeof NOTIFICATION_STATUSES)[number];

export interface NotificationRow {
  id: string;
  sourceItemId: string;
  destinationId: string;
  kind: string;
  dedupeKey: string;
  payload: unknown;
  status: NotificationStatus;
  attempts: number;
  nextAttemptAt: Date | null;
  claimedUntil: Date | null;
  claimToken: string | null;
  remoteMessageId: string | null;
  lastError: string | null;
  createdAt: Date;
  sentAt: Date | null;
}

const NOTIFICATION_COLUMNS = `id, source_item_id, destination_id, kind, dedupe_key, payload, status, attempts,
  next_attempt_at, claimed_until, claim_token, remote_message_id, last_error, created_at, sent_at`;

function toNotification(row: Record<string, unknown>): NotificationRow {
  return {
    id: row.id as string,
    sourceItemId: row.source_item_id as string,
    destinationId: row.destination_id as string,
    kind: row.kind as string,
    dedupeKey: row.dedupe_key as string,
    payload: row.payload,
    status: row.status as NotificationStatus,
    attempts: row.attempts as number,
    nextAttemptAt: row.next_attempt_at as Date | null,
    claimedUntil: row.claimed_until as Date | null,
    claimToken: row.claim_token as string | null,
    remoteMessageId: row.remote_message_id as string | null,
    lastError: row.last_error as string | null,
    createdAt: row.created_at as Date,
    sentAt: row.sent_at as Date | null,
  };
}

export async function getNotification(q: Queryable, id: string): Promise<NotificationRow | null> {
  const { rows } = await q.query(`SELECT ${NOTIFICATION_COLUMNS} FROM notifications WHERE id = $1`, [id]);
  return rows[0] ? toNotification(rows[0]) : null;
}

export async function recoverExpiredClaims(q: Queryable): Promise<number> {
  const { rowCount } = await q.query(
    `UPDATE notifications
        SET status = 'uncertain', claim_token = NULL, claimed_until = NULL, updated_at = clock_timestamp(),
            last_error = '전송 중 처리가 끝나지 않아 전달 여부를 알 수 없습니다'
      WHERE status = 'sending' AND claimed_until < now()`,
  );
  return rowCount ?? 0;
}

export interface ClaimOptions {
  destinationIds: string[];
  claimToken: string;
  claimMs: number;
}

export async function claimNextDue(q: Queryable, options: ClaimOptions): Promise<NotificationRow | null> {
  const { rows } = await q.query(
    `UPDATE notifications
        SET status = 'sending', claim_token = $2,
            claimed_until = now() + make_interval(secs => $3::double precision / 1000),
            attempts = attempts + 1, updated_at = clock_timestamp()
      WHERE id = (
        SELECT id FROM notifications
         WHERE status = 'pending'
           AND destination_id = ANY($1::text[])
           AND (next_attempt_at IS NULL OR next_attempt_at <= now())
         ORDER BY created_at, id
         LIMIT 1
         FOR UPDATE SKIP LOCKED)
      RETURNING ${NOTIFICATION_COLUMNS}`,
    [options.destinationIds, options.claimToken, options.claimMs],
  );
  return rows[0] ? toNotification(rows[0]) : null;
}

export async function completeSent(
  q: Queryable,
  id: string,
  claimToken: string,
  remoteMessageId: string | null,
): Promise<boolean> {
  const { rowCount } = await q.query(
    `UPDATE notifications
        SET status = 'sent', remote_message_id = $3, sent_at = clock_timestamp(), last_error = NULL,
            claim_token = NULL, claimed_until = NULL, next_attempt_at = NULL, updated_at = clock_timestamp()
      WHERE id = $1 AND claim_token = $2 AND status = 'sending'`,
    [id, claimToken, remoteMessageId],
  );
  return (rowCount ?? 0) === 1;
}

export async function releaseForRetry(
  q: Queryable,
  id: string,
  claimToken: string,
  delayMs: number,
  error: string,
): Promise<boolean> {
  const { rowCount } = await q.query(
    `UPDATE notifications
        SET status = 'pending', next_attempt_at = now() + make_interval(secs => $3::double precision / 1000),
            last_error = $4, claim_token = NULL, claimed_until = NULL, updated_at = clock_timestamp()
      WHERE id = $1 AND claim_token = $2 AND status = 'sending'`,
    [id, claimToken, delayMs, error.slice(0, 1000)],
  );
  return (rowCount ?? 0) === 1;
}

export async function finishWithStatus(
  q: Queryable,
  id: string,
  claimToken: string,
  status: 'failed' | 'uncertain',
  error: string,
): Promise<boolean> {
  const { rowCount } = await q.query(
    `UPDATE notifications
        SET status = $3, last_error = $4, claim_token = NULL, claimed_until = NULL, updated_at = clock_timestamp()
      WHERE id = $1 AND claim_token = $2 AND status = 'sending'`,
    [id, claimToken, status, error.slice(0, 1000)],
  );
  return (rowCount ?? 0) === 1;
}

export type ResolveAction = 'retry' | 'sent';

export type ResolveResult =
  | { kind: 'resolved'; notification: NotificationRow }
  | { kind: 'not_found' }
  | { kind: 'ambiguous'; candidates: string[] }
  | { kind: 'invalid_status'; status: NotificationStatus };

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function findNotificationIds(q: Queryable, idOrPrefix: string): Promise<string[]> {
  const value = idOrPrefix.trim().toLowerCase();
  if (UUID_RE.test(value)) {
    const { rows } = await q.query<{ id: string }>('SELECT id FROM notifications WHERE id = $1', [value]);
    return rows.map((row) => row.id);
  }
  if (!/^[0-9a-f-]{8,35}$/.test(value)) return [];
  const { rows } = await q.query<{ id: string }>(
    'SELECT id FROM notifications WHERE id::text LIKE $1 ORDER BY created_at LIMIT 10',
    [`${value}%`],
  );
  return rows.map((row) => row.id);
}

export async function resolveNotification(q: Queryable, idOrPrefix: string, action: ResolveAction): Promise<ResolveResult> {
  const ids = await findNotificationIds(q, idOrPrefix);
  if (ids.length === 0) return { kind: 'not_found' };
  if (ids.length > 1) return { kind: 'ambiguous', candidates: ids };
  const id = ids[0] as string;
  const update =
    action === 'retry'
      ? `UPDATE notifications
            SET status = 'pending', attempts = 0, next_attempt_at = NULL,
                last_error = '수동 재시도 요청: ' || COALESCE(last_error, ''), updated_at = clock_timestamp()
          WHERE id = $1 AND status IN ('uncertain', 'failed')
          RETURNING ${NOTIFICATION_COLUMNS}`
      : `UPDATE notifications
            SET status = 'sent', sent_at = clock_timestamp(),
                last_error = '수동 전송 완료 처리: ' || COALESCE(last_error, ''), updated_at = clock_timestamp()
          WHERE id = $1 AND status IN ('uncertain', 'failed')
          RETURNING ${NOTIFICATION_COLUMNS}`;
  const { rows } = await q.query(update, [id]);
  if (rows[0]) return { kind: 'resolved', notification: toNotification(rows[0]) };
  const current = await getNotification(q, id);
  if (!current) return { kind: 'not_found' };
  return { kind: 'invalid_status', status: current.status };
}

export type NotificationCounts = Record<NotificationStatus, number> & { duePending: number };

export async function countNotifications(q: Queryable): Promise<NotificationCounts> {
  const { rows } = await q.query<{ status: NotificationStatus; total: string; due: string }>(
    `SELECT status, count(*) AS total,
            count(*) FILTER (WHERE next_attempt_at IS NULL OR next_attempt_at <= now()) AS due
       FROM notifications GROUP BY status`,
  );
  const counts: NotificationCounts = { pending: 0, sending: 0, sent: 0, failed: 0, uncertain: 0, duePending: 0 };
  for (const row of rows) {
    counts[row.status] = Number(row.total);
    if (row.status === 'pending') counts.duePending = Number(row.due);
  }
  return counts;
}

export interface AttentionNotification {
  id: string;
  destinationId: string;
  status: NotificationStatus;
  attempts: number;
  lastError: string | null;
  itemRef: string;
  title: string;
  createdAt: Date;
}

export async function listAttentionNotifications(q: Queryable, limit = 20): Promise<AttentionNotification[]> {
  const { rows } = await q.query(
    `SELECT n.id, n.destination_id, n.status, n.attempts, n.last_error, n.created_at, i.id AS item_id, i.title
       FROM notifications n JOIN source_items i ON i.id = n.source_item_id
      WHERE n.status IN ('uncertain', 'failed')
      ORDER BY n.created_at, n.id
      LIMIT $1`,
    [limit],
  );
  return rows.map((row) => ({
    id: row.id,
    destinationId: row.destination_id,
    status: row.status,
    attempts: row.attempts,
    lastError: row.last_error,
    itemRef: String(row.item_id).slice(0, 8),
    title: row.title,
    createdAt: row.created_at,
  }));
}

export type JobRunStatus = 'running' | 'success' | 'partial' | 'failed' | 'skipped';

export async function startJobRun(q: Queryable, mode: string): Promise<string> {
  const { rows } = await q.query<{ id: string }>('INSERT INTO job_runs (mode) VALUES ($1) RETURNING id', [mode]);
  return (rows[0] as { id: string }).id;
}

export async function finishJobRun(
  q: Queryable,
  id: string,
  status: Exclude<JobRunStatus, 'running'>,
  counts: unknown,
  errorSummary: string | null,
): Promise<void> {
  await q.query(
    `UPDATE job_runs SET status = $2, counts = $3::jsonb, error_summary = $4, finished_at = clock_timestamp()
      WHERE id = $1`,
    [id, status, JSON.stringify(counts), errorSummary === null ? null : errorSummary.slice(0, 2000)],
  );
}

export async function recordSkippedRun(q: Queryable, mode: string, reason: string): Promise<string> {
  const { rows } = await q.query<{ id: string }>(
    `INSERT INTO job_runs (mode, status, finished_at, error_summary)
     VALUES ($1, 'skipped', clock_timestamp(), $2) RETURNING id`,
    [mode, reason],
  );
  return (rows[0] as { id: string }).id;
}

export interface JobRunRow {
  id: string;
  mode: string;
  startedAt: Date;
  finishedAt: Date | null;
  status: JobRunStatus;
  counts: unknown;
  errorSummary: string | null;
}

export async function latestJobRuns(q: Queryable, limit = 5): Promise<JobRunRow[]> {
  const { rows } = await q.query(
    `SELECT id, mode, started_at, finished_at, status, counts, error_summary
       FROM job_runs ORDER BY started_at DESC LIMIT $1`,
    [limit],
  );
  return rows.map((row) => ({
    id: row.id,
    mode: row.mode,
    startedAt: row.started_at,
    finishedAt: row.finished_at,
    status: row.status,
    counts: row.counts,
    errorSummary: row.error_summary,
  }));
}

export async function lastSuccessfulRun(q: Queryable): Promise<JobRunRow | null> {
  const { rows } = await q.query(
    `SELECT id, mode, started_at, finished_at, status, counts, error_summary
       FROM job_runs WHERE status IN ('success', 'partial') ORDER BY started_at DESC LIMIT 1`,
  );
  const row = rows[0];
  if (!row) return null;
  return {
    id: row.id,
    mode: row.mode,
    startedAt: row.started_at,
    finishedAt: row.finished_at,
    status: row.status,
    counts: row.counts,
    errorSummary: row.error_summary,
  };
}
