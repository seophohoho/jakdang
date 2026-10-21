import { createHash } from 'node:crypto';
import { readdir, readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { withTransaction, type Pool } from './client.js';

export const DEFAULT_MIGRATIONS_DIR = fileURLToPath(new URL('../../migrations/', import.meta.url));

export interface MigrationFile {
  version: string;
  sql: string;
  checksum: string;
}

export interface MigrationResult {
  applied: string[];
  skipped: string[];
}

export class MigrationChecksumError extends Error {
  constructor(public readonly version: string) {
    super(`이미 적용된 마이그레이션 ${version}의 내용이 바뀌었습니다. 기존 파일을 수정하지 말고 새 파일을 추가하세요.`);
    this.name = 'MigrationChecksumError';
  }
}

const MIGRATION_LOCK_KEY = 4_205_201_021;

export async function loadMigrationFiles(dir: string = DEFAULT_MIGRATIONS_DIR): Promise<MigrationFile[]> {
  const names = (await readdir(dir)).filter((name) => /^\d{3}_[a-z0-9_]+\.sql$/.test(name)).sort();
  return Promise.all(
    names.map(async (name) => {
      const sql = await readFile(join(dir, name), 'utf8');
      return { version: name.replace(/\.sql$/, ''), sql, checksum: createHash('sha256').update(sql).digest('hex') };
    }),
  );
}

export async function runMigrations(pool: Pool, files: MigrationFile[]): Promise<MigrationResult> {
  const result: MigrationResult = { applied: [], skipped: [] };
  for (const file of files) {
    const outcome = await withTransaction(pool, async (client) => {
      await client.query('SELECT pg_advisory_xact_lock($1)', [MIGRATION_LOCK_KEY]);
      await client.query(`
        CREATE TABLE IF NOT EXISTS schema_migrations (
          version text PRIMARY KEY,
          checksum text NOT NULL,
          applied_at timestamptz NOT NULL DEFAULT now()
        )`);
      const { rows } = await client.query<{ checksum: string }>(
        'SELECT checksum FROM schema_migrations WHERE version = $1',
        [file.version],
      );
      const existing = rows[0];
      if (existing) {
        if (existing.checksum !== file.checksum) throw new MigrationChecksumError(file.version);
        return 'skipped' as const;
      }
      await client.query(file.sql);
      await client.query('INSERT INTO schema_migrations (version, checksum) VALUES ($1, $2)', [
        file.version,
        file.checksum,
      ]);
      return 'applied' as const;
    });
    result[outcome].push(file.version);
  }
  return result;
}
