import { createFetcher, type Fetcher } from '../collectors/fetch.js';
import type { SourceConfig } from '../collectors/types.js';
import { ConfigError, loadConfig, requireDatabaseUrl, secretValues, type AppConfig } from '../config.js';
import { runSync, type RunSyncResult } from '../core/run-sync.js';
import { createPool, type Pool } from '../db/client.js';
import { createLogger, errorMessage, type Logger } from '../log.js';
import { createNotifiers } from '../notifications/index.js';
import type { WebhookTransport } from '../notifications/webhook.js';
import { SOURCES, selectSources } from '../sources.js';
import { isAuthorized } from './auth.js';
import { json, methodNotAllowed, sanitizeText, unauthorized } from './responses.js';

export interface HandlerDeps {
  env?: NodeJS.ProcessEnv;
  createPool?: (url: string) => Pool;
  fetcher?: Fetcher;
  transport?: WebhookTransport;
  sources?: SourceConfig[];
  logger?: Logger;
  runSyncImpl?: typeof runSync;
}

const STATUS_CODES: Record<RunSyncResult['status'], number> = { success: 200, partial: 207, failed: 500, skipped: 409 };

export function loadHandlerConfig(env: NodeJS.ProcessEnv, logger: Logger): AppConfig | Response {
  try {
    return loadConfig(env);
  } catch (error) {
    if (error instanceof ConfigError) {
      logger.error('환경 변수 설정 오류', { issues: error.issues });
      return json(500, { ok: false, error: '서버 설정 오류' });
    }
    throw error;
  }
}

export function createCronHandler(deps: HandlerDeps = {}) {
  return async function handle(request: Request): Promise<Response> {
    if (request.method !== 'GET') return methodNotAllowed();
    const env = deps.env ?? process.env;
    if (!isAuthorized(request.headers.get('authorization'), env.CRON_SECRET?.trim() || undefined)) return unauthorized();
    const bootLogger = deps.logger ?? createLogger({ level: 'info' });
    const config = loadHandlerConfig(env, bootLogger);
    if (config instanceof Response) return config;
    const secrets = secretValues(config);
    const logger = deps.logger ?? createLogger({ level: config.logLevel, secrets });
    let pool: Pool | undefined;
    try {
      pool = (deps.createPool ?? ((url: string) => createPool(url, { applicationName: 'jakdang-cron' })))(
        requireDatabaseUrl(config),
      );
      const result = await (deps.runSyncImpl ?? runSync)(
        {
          pool,
          fetcher: deps.fetcher ?? createFetcher(),
          config,
          logger,
          notifiers: createNotifiers(config, deps.transport),
        },
        { mode: 'cron', sources: selectSources(deps.sources ?? SOURCES, []) },
      );
      return json(STATUS_CODES[result.status], {
        ok: result.status === 'success',
        status: result.status,
        runId: result.runId,
        totals: result.totals,
        delivery: result.delivery,
        backlog: result.backlog,
        recoveredClaims: result.recoveredClaims,
        skippedUninitialized: result.skippedUninitialized,
        notificationsEnabled: config.notificationsEnabled,
        errorSummary: sanitizeText(result.errorSummary, secrets),
      });
    } catch (error) {
      logger.error('cron 실행 실패', { error: errorMessage(error) });
      return json(500, { ok: false, status: 'failed', error: sanitizeText(errorMessage(error), secrets) });
    } finally {
      await pool?.end().catch(() => {});
    }
  };
}
