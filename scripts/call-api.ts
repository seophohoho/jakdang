import { existsSync } from 'node:fs';
import { parseArgs } from 'node:util';
import { redact } from '../src/log.js';

const ALLOWED_PATHS = new Set(['cron', 'health']);

async function main(): Promise<number> {
  const { values } = parseArgs({
    options: { path: { type: 'string' }, 'env-path': { type: 'string' } },
    strict: true,
  });
  const envFile = values['env-path'] ?? '.env';
  if (existsSync(envFile)) process.loadEnvFile(envFile);
  const path = values.path ?? '';
  if (!ALLOWED_PATHS.has(path)) {
    process.stderr.write('사용법: npm run api:call -- --path cron|health [--env-path .env.production.local]\n');
    return 2;
  }
  const base = process.env.JAKDANG_BASE_URL?.trim();
  const secret = process.env.CRON_SECRET?.trim();
  if (!base || !/^https:\/\//.test(base)) {
    process.stderr.write('JAKDANG_BASE_URL에 https 배포 주소를 넣으세요\n');
    return 1;
  }
  if (!secret) {
    process.stderr.write('CRON_SECRET이 환경 변수에 없습니다\n');
    return 1;
  }
  const url = new URL(`/api/${path}`, base);
  const started = Date.now();
  const response = await fetch(url, { headers: { authorization: `Bearer ${secret}` }, signal: AbortSignal.timeout(280_000) });
  const body = await response.text();
  process.stdout.write(`${url.origin}/api/${path} → HTTP ${response.status} (${Date.now() - started}ms)\n`);
  try {
    process.stdout.write(`${redact(JSON.stringify(JSON.parse(body), null, 2), [secret])}\n`);
  } catch {
    process.stdout.write(`${redact(body.slice(0, 2000), [secret])}\n`);
  }
  return response.ok ? 0 : 1;
}

main().then(
  (code) => {
    process.exitCode = code;
  },
  (error: unknown) => {
    process.stderr.write(`요청 실패: ${error instanceof Error ? error.message : String(error)}\n`);
    process.exitCode = 1;
  },
);
