import { existsSync } from 'node:fs';
import { parseArgs } from 'node:util';
import { ConfigError, loadConfig, requireDatabaseUrl, secretValues } from '../src/config.js';
import { createPool } from '../src/db/client.js';
import { loadMigrationFiles, runMigrations } from '../src/db/migrations.js';
import { errorMessage, redact } from '../src/log.js';

async function main(): Promise<number> {
  const { values } = parseArgs({ options: { 'env-path': { type: 'string' } }, strict: true });
  const envFile = values['env-path'];
  if (envFile !== undefined) {
    if (!existsSync(envFile)) {
      process.stderr.write(`환경 변수 파일이 없습니다: ${envFile}\n`);
      return 1;
    }
    process.loadEnvFile(envFile);
  } else if (existsSync('.env')) {
    process.loadEnvFile('.env');
  }
  let config;
  try {
    config = loadConfig(process.env);
    requireDatabaseUrl(config);
  } catch (error) {
    if (error instanceof ConfigError) {
      process.stderr.write(`${error.message}\n`);
      return 1;
    }
    throw error;
  }
  const secrets = secretValues(config);
  const pool = createPool(config.databaseUrl as string, { max: 1, applicationName: 'jakdang-migrate' });
  try {
    const result = await runMigrations(pool, await loadMigrationFiles());
    process.stdout.write(`적용: ${result.applied.join(', ') || '없음'}\n이미 적용됨: ${result.skipped.join(', ') || '없음'}\n`);
    return 0;
  } catch (error) {
    process.stderr.write(`마이그레이션 실패: ${redact(errorMessage(error), secrets)}\n`);
    return 1;
  } finally {
    await pool.end();
  }
}

main().then((code) => {
  process.exitCode = code;
});
