import { afterAll, beforeEach, describe, expect, it } from 'vitest';
import type { CliContext } from '../../src/cli.js';
import { runResolve, runTestMessage } from '../../src/commands/notifications.js';
import { recordItem } from '../../src/db/repository.js';
import type { WebhookTransport } from '../../src/notifications/webhook.js';
import { createTestPool, resetDatabase, snapshotTables, TEST_DATABASE_URL } from './db.js';
import { memoryLogger, testConfig } from './helpers.js';

const pool = createTestPool(3);

afterAll(async () => {
  await pool.end();
});

beforeEach(async () => {
  await resetDatabase(pool);
});

function context(env: Record<string, string> = {}): CliContext & { output: string[] } {
  const output: string[] = [];
  const config = { ...testConfig(env), databaseUrl: TEST_DATABASE_URL };
  return { config, logger: memoryLogger(), print: (line) => output.push(line), output };
}

describe('notifications:test', () => {
  it('합성 메시지 1건을 지정 채널에 보내고 DB는 바꾸지 않는다', async () => {
    await recordItem(
      pool,
      { sourceId: 's', externalKey: '1', url: 'https://a.test/1', normalizedUrl: 'https://a.test/1', title: '행사' },
      { baseline: false, buildNotifications: () => [{ destinationId: 'discord-main', payload: {} }] },
    );
    const before = await snapshotTables(pool);
    const calls: Array<{ url: string; body: unknown }> = [];
    const transport: WebhookTransport = async (url, init) => {
      calls.push({ url, body: JSON.parse(init.body) });
      return { status: 200, headers: { get: () => null }, text: async () => '{"id":"test-msg"}' };
    };
    const ctx = context();
    const code = await runTestMessage({ name: 'notifications:test', destination: 'discord-main' }, ctx, {
      transport,
      now: () => new Date('2026-10-22T00:00:00Z'),
    });
    expect(code).toBe(0);
    expect(calls).toHaveLength(1);
    expect(calls[0]?.url).toContain('wait=true');
    expect((calls[0]?.body as { content: string }).content).toContain('[테스트] jakdang 알림 연결 확인');
    expect(ctx.output.join('\n')).toContain('전송 성공 (메시지 ID test-msg)');
    expect(ctx.output.join('\n')).not.toContain('test-token');
    expect(await snapshotTables(pool)).toEqual(before);
  });

  it('채널 Webhook이 설정되지 않았으면 보내지 않는다', async () => {
    const ctx = context({ MATTERMOST_WEBHOOK_URL: '' });
    const code = await runTestMessage({ name: 'notifications:test', destination: 'mattermost-main' }, ctx, {
      transport: async () => {
        throw new Error('호출되면 안 됨');
      },
    });
    expect(code).toBe(1);
  });
});

describe('notifications:resolve', () => {
  it('pending 상태는 처리하지 않고 안내한다', async () => {
    const created = await recordItem(
      pool,
      { sourceId: 's', externalKey: '1', url: 'https://a.test/1', normalizedUrl: 'https://a.test/1', title: '행사' },
      { baseline: false, buildNotifications: () => [{ destinationId: 'discord-main', payload: {} }] },
    );
    const ctx = context();
    const code = await runResolve({ name: 'notifications:resolve', id: created.notificationIds[0]!, action: 'sent' }, ctx);
    expect(code).toBe(1);
    expect(ctx.output[0]).toContain('pending');
  });
});
