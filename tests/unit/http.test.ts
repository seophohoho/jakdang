import { describe, expect, it, vi } from 'vitest';
import type { runSync } from '../../src/core/run-sync.js';
import { emptyDeliverySummary } from '../../src/core/deliver.js';
import { isAuthorized } from '../../src/http/auth.js';
import { createCronHandler } from '../../src/http/cron-handler.js';
import { createHealthHandler } from '../../src/http/health-handler.js';
import { sanitizeText } from '../../src/http/responses.js';
import { silentLogger } from '../../src/log.js';
import * as cronRoute from '../../api/cron.js';
import * as healthRoute from '../../api/health.js';

const SECRET = 's'.repeat(48);
const bearer = (token: string) => ({ authorization: `Bearer ${token}` });
const request = (method = 'GET', headers: Record<string, string> = {}) =>
  new Request('https://example.vercel.app/api/cron', { method, headers });

function fakeRunSync() {
  return vi.fn<typeof runSync>(async () => ({
    runId: 'run-1',
    status: 'success',
    dryRun: false,
    bootstrap: false,
    sources: [],
    totals: { newItems: 0, known: 0, duplicateUrl: 0, baseline: 0, invalid: 0, keywordFiltered: 0, notificationsCreated: 0 },
    skippedUninitialized: [],
    destinations: [],
    dbCompared: true,
    errorSummary: null,
    recoveredClaims: 0,
    delivery: emptyDeliverySummary('empty'),
    backlog: null,
  }));
}

const baseEnv = {
  CRON_SECRET: SECRET,
  DATABASE_URL: 'postgres://u:p@db.invalid/jakdang',
  DISCORD_WEBHOOK_URL: 'https://discord.com/api/webhooks/1/hook-secret',
  NOTIFICATIONS_ENABLED: 'true',
};

const noPool = () => ({ end: async () => {} }) as never;

describe('isAuthorized', () => {
  it('비밀이 없거나 짧으면 어떤 헤더도 허용하지 않는다', () => {
    expect(isAuthorized('Bearer undefined', undefined)).toBe(false);
    expect(isAuthorized('Bearer ', '')).toBe(false);
    expect(isAuthorized('Bearer short', 'short')).toBe(false);
  });

  it('Bearer 형식과 값이 정확히 같을 때만 허용한다', () => {
    expect(isAuthorized(null, SECRET)).toBe(false);
    expect(isAuthorized(SECRET, SECRET)).toBe(false);
    expect(isAuthorized(`Basic ${SECRET}`, SECRET)).toBe(false);
    expect(isAuthorized(`Bearer ${SECRET}x`, SECRET)).toBe(false);
    expect(isAuthorized(`Bearer ${SECRET}`, SECRET)).toBe(true);
  });
});

describe('cron 핸들러', () => {
  it('GET 외 메서드는 405, 모든 응답에 no-store를 붙인다', async () => {
    const handler = createCronHandler({ env: baseEnv, runSyncImpl: fakeRunSync(), createPool: noPool, logger: silentLogger });
    const response = await handler(request('POST', bearer(SECRET)));
    expect(response.status).toBe(405);
    expect(response.headers.get('allow')).toBe('GET');
    expect(response.headers.get('cache-control')).toContain('no-store');
    for (const method of ['POST', 'PUT', 'PATCH', 'DELETE'] as const) {
      const routed = await (cronRoute[method] as () => Promise<Response>)();
      expect(routed.status).toBe(405);
    }
  });

  it('인증 누락·잘못된 토큰·빈 CRON_SECRET이면 401이고 실행하지 않는다', async () => {
    const run = fakeRunSync();
    const handler = createCronHandler({ env: baseEnv, runSyncImpl: run, createPool: noPool, logger: silentLogger });
    expect((await handler(request())).status).toBe(401);
    expect((await handler(request('GET', bearer('wrong')))).status).toBe(401);
    const empty = createCronHandler({ env: { ...baseEnv, CRON_SECRET: '' }, runSyncImpl: run, createPool: noPool, logger: silentLogger });
    expect((await empty(request('GET', bearer('')))).status).toBe(401);
    expect((await empty(request('GET', { authorization: 'Bearer undefined' }))).status).toBe(401);
    const missing = createCronHandler({ env: { ...baseEnv, CRON_SECRET: undefined }, runSyncImpl: run, createPool: noPool, logger: silentLogger });
    const response = await missing(request('GET', { authorization: 'Bearer undefined' }));
    expect(response.status).toBe(401);
    expect(response.headers.get('cache-control')).toContain('no-store');
    expect(run).not.toHaveBeenCalled();
  });

  it('인증되면 cron 모드로 runSync를 부르고 결과를 상태 코드에 반영한다', async () => {
    const run = fakeRunSync();
    const handler = createCronHandler({ env: baseEnv, runSyncImpl: run, createPool: noPool, logger: silentLogger });
    const response = await handler(request('GET', bearer(SECRET)));
    expect(response.status).toBe(200);
    expect(await response.json()).toMatchObject({ ok: true, status: 'success', runId: 'run-1', notificationsEnabled: true });
    expect(run).toHaveBeenCalledTimes(1);
    expect(run.mock.calls[0]?.[1]).toMatchObject({ mode: 'cron' });
    expect(run.mock.calls[0]?.[1].dryRun).toBeUndefined();

    run.mockResolvedValueOnce({ ...(await run.mock.results[0]!.value), status: 'partial' });
    expect((await handler(request('GET', bearer(SECRET)))).status).toBe(207);
    run.mockResolvedValueOnce({ ...(await run.mock.results[0]!.value), status: 'failed' });
    const failed = await handler(request('GET', bearer(SECRET)));
    expect(failed.status).toBe(500);
    expect(((await failed.json()) as { ok: boolean }).ok).toBe(false);
  });

  it('preview 배포에서는 NOTIFICATIONS_ENABLED=true여도 알림이 꺼진 설정으로 실행한다', async () => {
    const run = fakeRunSync();
    const handler = createCronHandler({ env: { ...baseEnv, VERCEL_ENV: 'preview' }, runSyncImpl: run, createPool: noPool, logger: silentLogger });
    await handler(request('GET', bearer(SECRET)));
    expect(run.mock.calls[0]?.[0].config.notificationsEnabled).toBe(false);
  });

  it('설정 오류와 실행 예외는 비밀 없이 500으로 답한다', async () => {
    const badConfig = createCronHandler({
      env: { ...baseEnv, NOTIFICATIONS_ENABLED: 'yes' },
      runSyncImpl: fakeRunSync(),
      createPool: noPool,
      logger: silentLogger,
    });
    const response = await badConfig(request('GET', bearer(SECRET)));
    expect(response.status).toBe(500);
    const crashing = createCronHandler({
      env: baseEnv,
      runSyncImpl: async () => {
        throw new Error(`connect failed ${baseEnv.DATABASE_URL} ${baseEnv.DISCORD_WEBHOOK_URL}`);
      },
      createPool: noPool,
      logger: silentLogger,
    });
    const crashed = await crashing(request('GET', bearer(SECRET)));
    const text = await crashed.text();
    expect(crashed.status).toBe(500);
    expect(text).not.toContain('hook-secret');
    expect(text).not.toContain('u:p@');
  });
});

describe('health 핸들러', () => {
  it('인증 없이는 401, GET 외 메서드는 405다', async () => {
    const handler = createHealthHandler({ env: baseEnv, createPool: noPool, logger: silentLogger });
    expect((await handler(request())).status).toBe(401);
    expect((await handler(request('DELETE', bearer(SECRET)))).status).toBe(405);
    expect((await (healthRoute.POST as () => Promise<Response>)()).status).toBe(405);
  });
});

describe('sanitizeText', () => {
  it('URL은 호스트만 남기고 비밀 값은 지운다', () => {
    expect(sanitizeText('fetch_error: https://www.wevity.com/?c=find&ix=1 실패')).toBe('fetch_error: www.wevity.com 실패');
    expect(sanitizeText('token abc12345 leaked', ['abc12345'])).toBe('token [비밀] leaked');
    expect(sanitizeText('https://user:pw@host.example/path')).toBe('host.example');
  });
});
