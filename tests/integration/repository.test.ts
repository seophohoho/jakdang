import { randomUUID } from 'node:crypto';
import { afterAll, beforeEach, describe, expect, it } from 'vitest';
import { withReadOnlyTransaction } from '../../src/db/client.js';
import {
  claimNextDue,
  completeSent,
  countNotifications,
  finishWithStatus,
  getNotification,
  getSourceStates,
  markSourceInitialized,
  recordItem,
  recordSourceError,
  recordSourceSuccess,
  recoverExpiredClaims,
  releaseForRetry,
  resolveNotification,
  type ItemInput,
  type NotificationDraft,
} from '../../src/db/repository.js';
import { countRows, createTestPool, resetDatabase } from './db.js';

const pool = createTestPool(8);

afterAll(async () => {
  await pool.end();
});

beforeEach(async () => {
  await resetDatabase(pool);
});

function item(overrides: Partial<ItemInput> = {}): ItemInput {
  const key = overrides.externalKey ?? randomUUID().slice(0, 8);
  return {
    sourceId: 'source-a',
    externalKey: key,
    url: `https://events.example.com/e/${key}`,
    normalizedUrl: `https://events.example.com/e/${key}`,
    title: `행사 ${key}`,
    ...overrides,
  };
}

const twoDestinations = (): NotificationDraft[] => [
  { destinationId: 'discord-main', payload: { content: 'd' } },
  { destinationId: 'mattermost-main', payload: { text: 'm' } },
];

describe('항목·알림 저장', () => {
  it('같은 source_id/external_key는 한 번만 저장하고 알림도 한 번만 만든다', async () => {
    const input = item({ externalKey: '42' });
    const first = await recordItem(pool, input, { baseline: false, buildNotifications: twoDestinations });
    const second = await recordItem(pool, input, { baseline: false, buildNotifications: twoDestinations });
    expect(first.outcome).toBe('new');
    expect(first.notificationIds).toHaveLength(2);
    expect(second.outcome).toBe('known');
    expect(second.itemId).toBe(first.itemId);
    expect(await countRows(pool, 'source_items')).toBe(1);
    expect(await countRows(pool, 'notifications')).toBe(2);
    const { rows } = await pool.query('SELECT first_seen_at, last_seen_at FROM source_items');
    expect(rows[0].last_seen_at.getTime()).toBeGreaterThanOrEqual(rows[0].first_seen_at.getTime());
  });

  it('다른 소스라도 정규화 URL이 같으면 알림을 만들지 않는다', async () => {
    const shared = 'https://events.example.com/e/shared';
    await recordItem(pool, item({ sourceId: 'source-a', normalizedUrl: shared }), {
      baseline: false,
      buildNotifications: twoDestinations,
    });
    const other = await recordItem(pool, item({ sourceId: 'source-b', normalizedUrl: shared }), {
      baseline: false,
      buildNotifications: twoDestinations,
    });
    expect(other.outcome).toBe('duplicate_url');
    expect(await countRows(pool, 'notifications')).toBe(2);
  });

  it('bootstrap 항목은 is_baseline으로 저장하고 알림을 만들지 않는다', async () => {
    const result = await recordItem(pool, item(), { baseline: true, buildNotifications: twoDestinations });
    expect(result.outcome).toBe('baseline');
    const { rows } = await pool.query('SELECT is_baseline FROM source_items');
    expect(rows[0].is_baseline).toBe(true);
    expect(await countRows(pool, 'notifications')).toBe(0);
  });

  it('알림 INSERT가 실패하면 항목 INSERT도 롤백된다', async () => {
    const conflicting = (): NotificationDraft[] => [
      { destinationId: 'discord-main', payload: {} },
      { destinationId: 'discord-main', payload: {} },
    ];
    await expect(recordItem(pool, item(), { baseline: false, buildNotifications: conflicting })).rejects.toThrow();
    expect(await countRows(pool, 'source_items')).toBe(0);
    expect(await countRows(pool, 'notifications')).toBe(0);
  });

  it('알림 생성 콜백이 예외를 던져도 항목은 저장되지 않는다', async () => {
    const throwing = (): NotificationDraft[] => {
      throw new Error('payload 생성 실패');
    };
    await expect(recordItem(pool, item(), { baseline: false, buildNotifications: throwing })).rejects.toThrow(
      'payload 생성 실패',
    );
    expect(await countRows(pool, 'source_items')).toBe(0);
  });

  it('DB 제약: 알림의 source_item_id는 필수이고 실제 항목을 가리켜야 한다', async () => {
    await expect(
      pool.query(
        `INSERT INTO notifications (source_item_id, destination_id, kind, dedupe_key, payload) VALUES (NULL, 'd', 'new', 'k', '{}')`,
      ),
    ).rejects.toThrow(/null value/);
    await expect(
      pool.query(
        `INSERT INTO notifications (source_item_id, destination_id, kind, dedupe_key, payload) VALUES ($1, 'd', 'new', 'k', '{}')`,
        [randomUUID()],
      ),
    ).rejects.toThrow(/foreign key/);
  });

  it('DB 제약: 알림 상태와 claim 필드 조합을 검사한다', async () => {
    const created = await recordItem(pool, item(), { baseline: false, buildNotifications: twoDestinations });
    const id = created.notificationIds[0];
    await expect(pool.query(`UPDATE notifications SET status = 'done' WHERE id = $1`, [id])).rejects.toThrow(
      /check constraint/,
    );
    await expect(pool.query(`UPDATE notifications SET status = 'sending' WHERE id = $1`, [id])).rejects.toThrow(
      /check constraint/,
    );
  });

  it('쓰기 금지 트랜잭션에서는 저장이 거부된다', async () => {
    await expect(
      withReadOnlyTransaction(pool, (client) =>
        client.query(`INSERT INTO source_state (source_id) VALUES ('x')`),
      ),
    ).rejects.toThrow(/read-only/);
    expect(await countRows(pool, 'source_state')).toBe(0);
  });
});

describe('소스 상태', () => {
  it('초기화 시각은 처음 기록한 값을 유지하고 성공 시 오류를 지운다', async () => {
    await markSourceInitialized(pool, 'source-a');
    const first = (await getSourceStates(pool, ['source-a'])).get('source-a');
    await recordSourceError(pool, 'source-a', 'parser_error: 목록이 비었습니다');
    await markSourceInitialized(pool, 'source-a');
    const afterError = (await getSourceStates(pool, ['source-a'])).get('source-a');
    expect(afterError?.initializedAt?.getTime()).toBe(first?.initializedAt?.getTime());
    expect(afterError?.lastError).toContain('parser_error');
    await recordSourceSuccess(pool, 'source-a', { etag: '"v1"', lastModified: null, configFingerprint: 'fp' });
    const afterSuccess = (await getSourceStates(pool, ['source-a'])).get('source-a');
    expect(afterSuccess?.lastError).toBeNull();
    expect(afterSuccess?.etag).toBe('"v1"');
    expect(afterSuccess?.initializedAt?.getTime()).toBe(first?.initializedAt?.getTime());
  });
});

describe('알림 claim', () => {
  async function seed(count: number): Promise<string[]> {
    const ids: string[] = [];
    for (let index = 0; index < count; index += 1) {
      const result = await recordItem(pool, item({ externalKey: `k${index}` }), {
        baseline: false,
        buildNotifications: () => [{ destinationId: 'discord-main', payload: { n: index } }],
      });
      ids.push(...result.notificationIds);
    }
    return ids;
  }

  it('생성 순서대로 claim한다', async () => {
    const ids = await seed(3);
    const claimed: string[] = [];
    for (let index = 0; index < 3; index += 1) {
      const row = await claimNextDue(pool, { destinationIds: ['discord-main'], claimToken: randomUUID(), claimMs: 60_000 });
      if (row) claimed.push(row.id);
    }
    expect(claimed).toEqual(ids);
  });

  it('동시에 claim해도 같은 알림을 두 번 잡지 않는다', async () => {
    await seed(5);
    const results = await Promise.all(
      Array.from({ length: 8 }, () =>
        claimNextDue(pool, { destinationIds: ['discord-main'], claimToken: randomUUID(), claimMs: 60_000 }),
      ),
    );
    const ids = results.filter((row) => row !== null).map((row) => row.id);
    expect(ids).toHaveLength(5);
    expect(new Set(ids).size).toBe(5);
  });

  it('claim_token이 다르면 상태를 바꾸지 못한다', async () => {
    await seed(1);
    const token = randomUUID();
    const row = await claimNextDue(pool, { destinationIds: ['discord-main'], claimToken: token, claimMs: 60_000 });
    expect(row?.status).toBe('sending');
    expect(await completeSent(pool, row!.id, randomUUID(), 'remote')).toBe(false);
    expect(await completeSent(pool, row!.id, token, 'remote-1')).toBe(true);
    const sent = await getNotification(pool, row!.id);
    expect(sent).toMatchObject({ status: 'sent', remoteMessageId: 'remote-1', claimToken: null, attempts: 1 });
  });

  it('재시도 예약 시각 전에는 다시 claim하지 않는다', async () => {
    await seed(1);
    const token = randomUUID();
    const row = await claimNextDue(pool, { destinationIds: ['discord-main'], claimToken: token, claimMs: 60_000 });
    await releaseForRetry(pool, row!.id, token, 60_000, 'HTTP 503');
    expect(await claimNextDue(pool, { destinationIds: ['discord-main'], claimToken: randomUUID(), claimMs: 1 })).toBeNull();
    await pool.query(`UPDATE notifications SET next_attempt_at = now() - interval '1 second'`);
    const again = await claimNextDue(pool, { destinationIds: ['discord-main'], claimToken: randomUUID(), claimMs: 1 });
    expect(again?.attempts).toBe(2);
  });

  it('claim이 만료된 sending은 uncertain으로 복구되고 resolve로 해결한다', async () => {
    await seed(2);
    const first = await claimNextDue(pool, { destinationIds: ['discord-main'], claimToken: randomUUID(), claimMs: 60_000 });
    const second = await claimNextDue(pool, { destinationIds: ['discord-main'], claimToken: randomUUID(), claimMs: 60_000 });
    await pool.query(`UPDATE notifications SET claimed_until = now() - interval '1 second'`);
    expect(await recoverExpiredClaims(pool)).toBe(2);
    expect((await getNotification(pool, first!.id))?.status).toBe('uncertain');
    expect(await claimNextDue(pool, { destinationIds: ['discord-main'], claimToken: randomUUID(), claimMs: 1 })).toBeNull();

    const retried = await resolveNotification(pool, first!.id, 'retry');
    expect(retried).toMatchObject({ kind: 'resolved', notification: { status: 'pending', attempts: 0 } });
    const confirmed = await resolveNotification(pool, second!.id.slice(0, 8), 'sent');
    expect(confirmed).toMatchObject({ kind: 'resolved', notification: { status: 'sent' } });
    expect(await resolveNotification(pool, second!.id, 'retry')).toEqual({ kind: 'invalid_status', status: 'sent' });
    expect(await resolveNotification(pool, randomUUID(), 'retry')).toEqual({ kind: 'not_found' });
  });

  it('failed 처리와 상태별 개수를 집계한다', async () => {
    await seed(2);
    const token = randomUUID();
    const row = await claimNextDue(pool, { destinationIds: ['discord-main'], claimToken: token, claimMs: 60_000 });
    await finishWithStatus(pool, row!.id, token, 'failed', 'HTTP 404');
    const counts = await countNotifications(pool);
    expect(counts).toMatchObject({ pending: 1, failed: 1, sending: 0, duePending: 1 });
  });
});
