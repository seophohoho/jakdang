import { randomUUID } from 'node:crypto';
import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest';
import type { DestinationId } from '../../src/config.js';
import { deliverDue, type DeliverOptions } from '../../src/core/deliver.js';
import { runSync, type RunSyncDeps } from '../../src/core/run-sync.js';
import { claimNextDue, recordItem, resolveNotification } from '../../src/db/repository.js';
import { createDiscordNotifier } from '../../src/notifications/discord.js';
import { buildPayload } from '../../src/notifications/format.js';
import { createMattermostNotifier } from '../../src/notifications/mattermost.js';
import type { Notifier } from '../../src/notifications/webhook.js';
import { MockWebhookServer } from '../support/mock-webhook.js';
import { countRows, createTestPool, resetDatabase } from './db.js';
import { FakeWeb, listHtml, memoryLogger, testConfig, testSource } from './helpers.js';

const pool = createTestPool(6);
const server = new MockWebhookServer();
const DISCORD_PATH = '/api/webhooks/1/secret-token';
const MATTERMOST_PATH = '/hooks/secret-token';

beforeAll(async () => {
  await server.start();
});

afterAll(async () => {
  await server.stop();
  await pool.end();
});

beforeEach(async () => {
  await resetDatabase(pool);
  server.reset();
});

function notifiers(which: DestinationId[] = ['discord-main']): Map<DestinationId, Notifier> {
  const map = new Map<DestinationId, Notifier>();
  if (which.includes('discord-main')) map.set('discord-main', createDiscordNotifier(server.url(DISCORD_PATH)));
  if (which.includes('mattermost-main')) map.set('mattermost-main', createMattermostNotifier(server.url(MATTERMOST_PATH)));
  return map;
}

async function seed(count: number, destinations: DestinationId[] = ['discord-main']): Promise<string[]> {
  const ids: string[] = [];
  for (let index = 0; index < count; index += 1) {
    const result = await recordItem(
      pool,
      {
        sourceId: 'src',
        externalKey: `k${index}`,
        url: `https://a.test/e/${index}`,
        normalizedUrl: `https://a.test/e/${index}`,
        title: `행사 ${index}`,
      },
      {
        baseline: false,
        buildNotifications: ({ itemId, firstSeenAt }) =>
          destinations.map((destinationId) => ({
            destinationId,
            payload: buildPayload(destinationId, {
              title: `행사 ${index}`,
              url: `https://a.test/e/${index}`,
              sourceName: '테스트',
              seenAt: firstSeenAt,
              itemId,
            }),
          })),
      },
    );
    ids.push(...result.notificationIds);
  }
  return ids;
}

function options(overrides: Partial<DeliverOptions> = {}): DeliverOptions {
  return {
    pool,
    notifiers: notifiers(),
    enabled: true,
    limit: 10,
    remainingMs: () => 200_000,
    logger: memoryLogger(),
    secrets: [],
    sleep: async () => {},
    ...overrides,
  };
}

async function statusOf(id: string) {
  const { rows } = await pool.query(
    `SELECT status, attempts, remote_message_id, last_error, next_attempt_at, claim_token FROM notifications WHERE id = $1`,
    [id],
  );
  return rows[0];
}

describe('알림 상태 전이 (모의 HTTP)', () => {
  it('성공하면 sent와 원격 메시지 ID를 저장한다', async () => {
    const [id] = await seed(1);
    server.enqueue({ status: 200, body: '{"id":"discord-msg-1"}' });
    const summary = await deliverDue(options());
    expect(summary).toMatchObject({ attempted: 1, sent: 1, stoppedBy: 'empty' });
    expect(await statusOf(id!)).toMatchObject({ status: 'sent', attempts: 1, remote_message_id: 'discord-msg-1', claim_token: null });
    expect(server.received[0]?.body).toMatchObject({ allowed_mentions: { parse: [] } });
  });

  it('429는 Retry-After만큼 next_attempt_at을 미루고 sent를 찍지 않는다', async () => {
    const [id] = await seed(1);
    server.enqueue({ status: 429, body: '{"retry_after":120}' });
    const summary = await deliverDue(options());
    expect(summary).toMatchObject({ retryScheduled: 1, sent: 0 });
    const row = await statusOf(id!);
    expect(row.status).toBe('pending');
    const delayMs = row.next_attempt_at.getTime() - Date.now();
    expect(delayMs).toBeGreaterThan(100_000);
    expect(delayMs).toBeLessThanOrEqual(120_000);
  });

  it('짧은 429·5xx는 같은 실행 안에서 한 번만 다시 시도한다', async () => {
    const [first, second] = await seed(2);
    const waits: number[] = [];
    server.enqueue({ status: 429, body: '{"retry_after":1.5}' }, { status: 200, body: '{"id":"after-retry"}' });
    server.enqueue({ status: 503 }, { status: 503 });
    const summary = await deliverDue(options({ sleep: async (ms) => void waits.push(ms) }));
    expect(waits).toEqual([1_500, 2_000]);
    expect(await statusOf(first!)).toMatchObject({ status: 'sent', attempts: 2, remote_message_id: 'after-retry' });
    expect(await statusOf(second!)).toMatchObject({ status: 'pending', attempts: 2 });
    expect(summary).toMatchObject({ attempted: 2, sent: 1, retryScheduled: 1 });
    expect(server.received).toHaveLength(4);
  });

  it('5xx는 1분·5분·30분 순서로 재시도를 예약하고 한도를 넘으면 failed로 바꾼다', async () => {
    const [id] = await seed(1);
    server.setFallback({ status: 500 });
    const delays: number[] = [];
    for (let round = 0; round < 3; round += 1) {
      await deliverDue(options({ remainingMs: () => 5_000 }));
      const row = await statusOf(id!);
      expect(row.status).toBe('pending');
      delays.push(Math.round((row.next_attempt_at.getTime() - Date.now()) / 60_000));
      await pool.query(`UPDATE notifications SET next_attempt_at = now() - interval '1 second'`);
    }
    expect(delays).toEqual([1, 5, 30]);
    await deliverDue(options({ remainingMs: () => 5_000 }));
    expect(await statusOf(id!)).toMatchObject({ status: 'failed', attempts: 4 });
  });

  it('400/401/403/404는 조치 사유와 함께 failed로 두고 수동 재시도할 수 있다', async () => {
    const ids = await seed(4);
    server.enqueue({ status: 400 }, { status: 401 }, { status: 403 }, { status: 404 });
    const summary = await deliverDue(options());
    expect(summary).toMatchObject({ attempted: 4, failed: 4, sent: 0 });
    const errors = await Promise.all(ids.map(async (id) => (await statusOf(id)).last_error as string));
    expect(errors[0]).toContain('payload 형식');
    expect(errors[1]).toContain('권한 또는 토큰');
    expect(errors[3]).toContain('삭제됐거나');
    expect(errors.join(' ')).not.toContain('secret-token');
    expect(await resolveNotification(pool, ids[3]!, 'retry')).toMatchObject({ kind: 'resolved', notification: { status: 'pending' } });
    server.enqueue({ status: 200, body: '{"id":"fixed"}' });
    await deliverDue(options());
    expect(await statusOf(ids[3]!)).toMatchObject({ status: 'sent', remote_message_id: 'fixed' });
  });

  it('응답 유실은 uncertain으로 두고 자동으로 다시 보내지 않는다', async () => {
    const [id] = await seed(1);
    server.enqueue({ drop: true });
    expect(await deliverDue(options())).toMatchObject({ uncertain: 1 });
    expect(await statusOf(id!)).toMatchObject({ status: 'uncertain' });
    expect(await deliverDue(options())).toMatchObject({ attempted: 0, stoppedBy: 'empty' });
    expect(server.received).toHaveLength(1);
    expect(await resolveNotification(pool, id!, 'sent')).toMatchObject({ kind: 'resolved', notification: { status: 'sent' } });
  });

  it('전송 중 프로세스가 죽어 claim이 만료되면 다음 실행 시작 때 uncertain으로 복구된다', async () => {
    const source = testSource('src-a', 'a.test');
    const web = new FakeWeb().set('https://a.test/list', { body: listHtml([{ id: '1', title: '기존' }]) });
    await runSync({ pool, fetcher: web, config: testConfig(), logger: memoryLogger() }, { mode: 'cli', bootstrap: true, sources: [source] });
    const [id] = await seed(1);
    await claimNextDue(pool, { destinationIds: ['discord-main'], claimToken: randomUUID(), claimMs: 60_000 });
    await pool.query(`UPDATE notifications SET claimed_until = now() - interval '1 second'`);
    const result = await runSync(
      { pool, fetcher: web, config: testConfig({ NOTIFICATIONS_ENABLED: 'true' }), logger: memoryLogger(), notifiers: notifiers() },
      { mode: 'cron', sources: [source] },
    );
    expect(result.recoveredClaims).toBe(1);
    expect(await statusOf(id!)).toMatchObject({ status: 'uncertain' });
    expect(server.received).toHaveLength(0);
  });

  it('알림이 꺼져 있으면 보내지 않고 pending으로 남긴다', async () => {
    const [id] = await seed(1);
    expect(await deliverDue(options({ enabled: false }))).toMatchObject({ attempted: 0, stoppedBy: 'disabled' });
    expect(await statusOf(id!)).toMatchObject({ status: 'pending', attempts: 0 });
    expect(server.received).toHaveLength(0);
  });
});

describe('runSync와 발송', () => {
  const source = testSource('src-a', 'a.test');
  const LIST = 'https://a.test/list';

  function syncDeps(web: FakeWeb, env: Record<string, string>, extra: Partial<RunSyncDeps> = {}): RunSyncDeps {
    return {
      pool,
      fetcher: web,
      config: testConfig(env),
      logger: memoryLogger(),
      notifiers: notifiers(['discord-main', 'mattermost-main']),
      sleep: async () => {},
      ...extra,
    };
  }

  async function prepare(newCount: number) {
    const web = new FakeWeb().set(LIST, { body: listHtml([{ id: 'base', title: '기존' }]) });
    await runSync(syncDeps(web, {}), { mode: 'cli', bootstrap: true, sources: [source] });
    const entries = Array.from({ length: newCount }, (_, index) => ({ id: `n${newCount - index}`, title: `신규 ${newCount - index}` }));
    web.set(LIST, { body: listHtml([...entries, { id: 'base', title: '기존' }]) });
    return web;
  }

  it('NOTIFICATIONS_ENABLED=false 동안 쌓인 알림은 다시 켠 뒤 생성 순서대로 한도 안에서 나간다', async () => {
    const web = await prepare(3);
    const disabled = await runSync(syncDeps(web, { NOTIFICATIONS_ENABLED: 'false' }), { mode: 'cron', sources: [source] });
    expect(disabled.totals.notificationsCreated).toBe(6);
    expect(disabled.delivery.stoppedBy).toBe('disabled');
    expect(server.received).toHaveLength(0);
    expect(await countRows(pool, 'notifications')).toBe(6);

    const enabled = await runSync(syncDeps(web, { NOTIFICATIONS_ENABLED: 'true', MAX_NOTIFICATIONS_PER_RUN: '4' }), {
      mode: 'cron',
      sources: [source],
    });
    expect(enabled.delivery).toMatchObject({ attempted: 4, sent: 4 });
    const sentTitles = server.received.map((request) => {
      const body = request.body as { content?: string; text?: string };
      return (body.content ?? body.text ?? '').split('\n')[0];
    });
    expect(sentTitles).toEqual(['[신규] 신규 1', '[신규] 신규 1', '[신규] 신규 2', '[신규] 신규 2']);
    expect(enabled.backlog).toMatchObject({ pending: 2 });

    const next = await runSync(syncDeps(web, { NOTIFICATIONS_ENABLED: 'true', MAX_NOTIFICATIONS_PER_RUN: '4' }), {
      mode: 'cron',
      sources: [source],
    });
    expect(next.delivery).toMatchObject({ attempted: 2, sent: 2, stoppedBy: 'empty' });
    expect(server.received.slice(4).map((request) => request.path).sort()).toEqual([DISCORD_PATH, MATTERMOST_PATH]);
    expect(await countRows(pool, 'notifications')).toBe(6);
  });

  it('preview 배포에서는 NOTIFICATIONS_ENABLED=true여도 보내지 않는다', async () => {
    const web = await prepare(1);
    const result = await runSync(syncDeps(web, { NOTIFICATIONS_ENABLED: 'true', VERCEL_ENV: 'preview' }), {
      mode: 'cron',
      sources: [source],
    });
    expect(result.delivery.stoppedBy).toBe('disabled');
    expect(server.received).toHaveLength(0);
  });

  it('작업 시간이 다하면 발송을 멈추고 남은 알림은 다음 실행에서 이어 보낸다', async () => {
    const web = await prepare(2);
    let clock = 0;
    const result = await runSync(
      syncDeps(web, { NOTIFICATIONS_ENABLED: 'true', RUN_BUDGET_MS: '20000' }, { now: () => clock }),
      { mode: 'cron', sources: [source] },
    );
    expect(result.totals.notificationsCreated).toBe(4);
    expect(result.delivery.attempted).toBe(4);
    server.reset();
    await pool.query(`UPDATE notifications SET status = 'pending', sent_at = NULL, remote_message_id = NULL, attempts = 0`);

    clock = 0;
    const slowNow = () => {
      clock += 3_000;
      return clock;
    };
    const limited = await runSync(syncDeps(web, { NOTIFICATIONS_ENABLED: 'true', RUN_BUDGET_MS: '20000' }, { now: slowNow }), {
      mode: 'cron',
      sources: [source],
    });
    expect(limited.delivery.stoppedBy).toBe('budget');
    expect(limited.delivery.attempted).toBeLessThan(4);
    const pendingAfter = Number((await pool.query(`SELECT count(*) FROM notifications WHERE status = 'pending'`)).rows[0].count);
    expect(pendingAfter).toBe(4 - limited.delivery.attempted);

    const resumed = await runSync(syncDeps(web, { NOTIFICATIONS_ENABLED: 'true' }), { mode: 'cron', sources: [source] });
    expect(resumed.delivery).toMatchObject({ attempted: pendingAfter, sent: pendingAfter });
    expect(Number((await pool.query(`SELECT count(*) FROM notifications WHERE status = 'sent'`)).rows[0].count)).toBe(4);
  });
});
