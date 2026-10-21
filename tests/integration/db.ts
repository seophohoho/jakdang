import { createPool, type Pool } from '../../src/db/client.js';
import { loadMigrationFiles, runMigrations } from '../../src/db/migrations.js';
import { assertDisposableDatabase } from '../../src/db/safety.js';

export const TEST_DATABASE_URL =
  process.env.TEST_DATABASE_URL ?? 'postgres://jakdang:jakdang@localhost:54329/jakdang_test';

export function createTestPool(max = 5): Pool {
  assertDisposableDatabase(TEST_DATABASE_URL, [process.env.DATABASE_URL]);
  return createPool(TEST_DATABASE_URL, { max, applicationName: 'jakdang-test' });
}

export async function resetDatabase(pool: Pool): Promise<void> {
  assertDisposableDatabase(TEST_DATABASE_URL, [process.env.DATABASE_URL]);
  await pool.query('DROP SCHEMA public CASCADE; CREATE SCHEMA public;');
  await runMigrations(pool, await loadMigrationFiles());
}

export async function countRows(pool: Pool, table: string): Promise<number> {
  const { rows } = await pool.query<{ n: string }>(`SELECT count(*) AS n FROM ${table}`);
  return Number(rows[0]?.n ?? 0);
}

export async function snapshotTables(pool: Pool): Promise<Record<string, unknown[]>> {
  const tables = ['source_state', 'source_items', 'notifications', 'job_runs', 'job_locks'];
  const snapshot: Record<string, unknown[]> = {};
  for (const table of tables) {
    const { rows } = await pool.query(`SELECT * FROM ${table} ORDER BY 1`);
    snapshot[table] = rows;
  }
  return snapshot;
}
