import { afterAll, beforeEach, describe, expect, it } from 'vitest';
import { createCronHandler } from '../../src/http/cron-handler.js';
import { createHealthHandler } from '../../src/http/health-handler.js';
import { recordSourceError } from '../../src/db/repository.js';
import { createTestPool, resetDatabase, TEST_DATABASE_URL } from './db.js';
import { FakeWeb, listHtml, memoryLogger, testSource } from './helpers.js';

const pool = createTestPool(3);
const SECRET = 'k'.repeat(40);
const env = {
  CRON_SECRET: SECRET,
  DATABASE_URL: TEST_DATABASE_URL,
  NOTIFICATIONS_ENABLED: 'false',
  DISCORD_WEBHOOK_URL: 'https://discord.com/api/webhooks/1/hook-secret',
};
const source = testSource('src-a', 'a.test');
const auth = { authorization: `Bearer ${SECRET}` };

afterAll(async () => {
  await pool.end();
});

beforeEach(async () => {
  await resetDatabase(pool);
});

describe('Vercel cron 함수', () => {
  it('CLI와 같은 runSync로 실제 DB에 cron 실행을 기록한다', async () => {
    const web = new FakeWeb().set('https://a.test/list', { body: listHtml([{ id: '1', title: '행사' }]) });
    await pool.query(`INSERT INTO source_state (source_id, initialized_at) VALUES ('src-a', now())`);
    const handler = createCronHandler({ env, fetcher: web, sources: [source], logger: memoryLogger() });
    const response = await handler(new Request('https://x.vercel.app/api/cron', { headers: auth }));
    expect(response.status).toBe(200);
    const body = (await response.json()) as { runId: string };
    expect(body).toMatchObject({ ok: true, status: 'success', totals: { newItems: 1, notificationsCreated: 1 } });
    const { rows } = await pool.query('SELECT id, mode, status FROM job_runs');
    expect(rows).toEqual([{ id: body.runId, mode: 'cron', status: 'success' }]);
    const pending = await pool.query(`SELECT status FROM notifications`);
    expect(pending.rows).toEqual([{ status: 'pending' }]);
  });

  it('인증이 틀리면 DB에 아무것도 남기지 않는다', async () => {
    const handler = createCronHandler({ env, fetcher: new FakeWeb(), sources: [source], logger: memoryLogger() });
    const response = await handler(new Request('https://x.vercel.app/api/cron', { headers: { authorization: 'Bearer nope' } }));
    expect(response.status).toBe(401);
    expect((await pool.query('SELECT count(*)::int AS n FROM job_runs')).rows[0].n).toBe(0);
  });
});

describe('Vercel health 함수', () => {
  it('최근 실행·소스 상태·알림 개수를 URL과 토큰 없이 보여 준다', async () => {
    const web = new FakeWeb().set('https://a.test/list', { body: listHtml([{ id: '1', title: '행사' }]) });
    await pool.query(`INSERT INTO source_state (source_id, initialized_at) VALUES ('src-a', now())`);
    await createCronHandler({ env, fetcher: web, sources: [source], logger: memoryLogger() })(
      new Request('https://x.vercel.app/api/cron', { headers: auth }),
    );
    await recordSourceError(pool, 'src-a', 'fetch_error: https://a.test/list?token=abc 실패 https://discord.com/api/webhooks/1/hook-secret');
    const handler = createHealthHandler({ env, sources: [source], logger: memoryLogger() });
    const response = await handler(new Request('https://x.vercel.app/api/health', { headers: auth }));
    expect(response.status).toBe(200);
    expect(response.headers.get('cache-control')).toContain('no-store');
    const text = await response.text();
    const body = JSON.parse(text);
    expect(body).toMatchObject({
      ok: true,
      db: 'ok',
      lastRun: { mode: 'cron', status: 'success' },
      sources: [{ id: 'src-a', initialized: true }],
      notifications: { pending: 1 },
      notificationsEnabled: false,
    });
    expect(body.sources[0].lastError).toBe('fetch_error: a.test 실패 [비밀]');
    expect(text).not.toContain('hook-secret');
    expect(text).not.toContain('token=abc');
    expect(text).not.toContain(SECRET);
    expect(text).not.toContain('jakdang:jakdang');
  });

  it('끝나지 않은 오래된 실행은 stale로 보여 주고 ok=false다', async () => {
    await pool.query(`INSERT INTO job_runs (mode, started_at) VALUES ('cron', now() - interval '20 minutes')`);
    const handler = createHealthHandler({ env, sources: [source], logger: memoryLogger() });
    const body = await (await handler(new Request('https://x.vercel.app/api/health', { headers: auth }))).json();
    expect(body).toMatchObject({ ok: false, lastRun: { status: 'stale', finishedAt: null } });
  });

  it('DB에 연결할 수 없으면 503이다', async () => {
    const handler = createHealthHandler({
      env: { ...env, DATABASE_URL: 'postgres://nobody:none@127.0.0.1:1/none_test' },
      sources: [source],
      logger: memoryLogger(),
    });
    const response = await handler(new Request('https://x.vercel.app/api/health', { headers: auth }));
    expect(response.status).toBe(503);
    expect(await response.json()).toEqual({ ok: false, db: 'error' });
  });
});
