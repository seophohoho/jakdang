import { secretValues } from '../config.js';
import { createPool, type Pool } from '../db/client.js';
import { countNotifications, getSourceStates, lastSuccessfulRun, latestJobRuns } from '../db/repository.js';
import { createLogger, errorMessage } from '../log.js';
import { SOURCES } from '../sources.js';
import { isAuthorized } from './auth.js';
import { loadHandlerConfig, type HandlerDeps } from './cron-handler.js';
import { json, methodNotAllowed, sanitizeText, unauthorized } from './responses.js';

export const STALE_RUN_AFTER_MS = 10 * 60_000;

export function createHealthHandler(deps: Omit<HandlerDeps, 'fetcher' | 'transport' | 'runSyncImpl'> & { now?: () => number } = {}) {
  return async function handle(request: Request): Promise<Response> {
    if (request.method !== 'GET') return methodNotAllowed();
    const env = deps.env ?? process.env;
    if (!isAuthorized(request.headers.get('authorization'), env.CRON_SECRET?.trim() || undefined)) return unauthorized();
    const bootLogger = deps.logger ?? createLogger({ level: 'info' });
    const config = loadHandlerConfig(env, bootLogger);
    if (config instanceof Response) return config;
    const secrets = secretValues(config);
    const now = deps.now ?? Date.now;
    const sources = deps.sources ?? SOURCES;
    if (!config.databaseUrl) return json(503, { ok: false, db: 'not_configured' });
    let pool: Pool | undefined;
    try {
      pool = (deps.createPool ?? ((url: string) => createPool(url, { max: 1, applicationName: 'jakdang-health' })))(
        config.databaseUrl,
      );
      await pool.query('SELECT 1');
      const [runs, lastSuccess, states, counts] = await Promise.all([
        latestJobRuns(pool, 1),
        lastSuccessfulRun(pool),
        getSourceStates(
          pool,
          sources.map((source) => source.id),
        ),
        countNotifications(pool),
      ]);
      const latest = runs[0];
      const stale =
        latest !== undefined && latest.finishedAt === null && now() - latest.startedAt.getTime() > STALE_RUN_AFTER_MS;
      const lastRun = latest
        ? {
            id: latest.id,
            mode: latest.mode,
            status: stale ? 'stale' : latest.status,
            startedAt: latest.startedAt.toISOString(),
            finishedAt: latest.finishedAt?.toISOString() ?? null,
            errorSummary: sanitizeText(latest.errorSummary, secrets),
          }
        : null;
      const backlogWarning = counts.pending > config.maxNotificationsPerRun;
      const ok = lastRun !== null && !stale && lastRun.status !== 'failed';
      return json(200, {
        ok,
        db: 'ok',
        checkedAt: new Date(now()).toISOString(),
        deployEnv: config.deployEnv,
        notificationsEnabled: config.notificationsEnabled,
        lastRun,
        lastSuccessAt: lastSuccess?.startedAt.toISOString() ?? null,
        sources: sources.map((source) => {
          const state = states.get(source.id);
          return {
            id: source.id,
            enabled: source.enabled,
            initialized: Boolean(state?.initializedAt),
            lastSuccessAt: state?.lastSuccessAt?.toISOString() ?? null,
            lastError: sanitizeText(state?.lastError ?? null, secrets),
            lastErrorAt: state?.lastErrorAt?.toISOString() ?? null,
          };
        }),
        notifications: counts,
        backlogWarning,
      });
    } catch (error) {
      bootLogger.error('health DB 확인 실패', { error: sanitizeText(errorMessage(error), secrets) });
      return json(503, { ok: false, db: 'error' });
    } finally {
      await pool?.end().catch(() => {});
    }
  };
}
