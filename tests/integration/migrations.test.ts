import { afterAll, beforeEach, describe, expect, it } from 'vitest';
import { loadMigrationFiles, MigrationChecksumError, runMigrations } from '../../src/db/migrations.js';
import { createTestPool, resetDatabase } from './db.js';

const pool = createTestPool();

afterAll(async () => {
  await pool.end();
});

beforeEach(async () => {
  await resetDatabase(pool);
});

describe('마이그레이션', () => {
  it('재실행해도 다시 적용하지 않는다', async () => {
    const files = await loadMigrationFiles();
    const again = await runMigrations(pool, files);
    expect(again.applied).toEqual([]);
    expect(again.skipped).toEqual(files.map((file) => file.version));
    const { rows } = await pool.query('SELECT version FROM schema_migrations');
    expect(rows).toHaveLength(files.length);
  });

  it('이미 적용된 파일 내용이 바뀌면 거부한다', async () => {
    const files = await loadMigrationFiles();
    const tampered = files.map((file) => ({ ...file, checksum: `${file.checksum}x` }));
    await expect(runMigrations(pool, tampered)).rejects.toBeInstanceOf(MigrationChecksumError);
  });

  it('동시에 실행해도 한 번만 적용된다', async () => {
    await pool.query('DROP SCHEMA public CASCADE; CREATE SCHEMA public;');
    const files = await loadMigrationFiles();
    const results = await Promise.all([runMigrations(pool, files), runMigrations(pool, files)]);
    const appliedCount = results.reduce((sum, result) => sum + result.applied.length, 0);
    expect(appliedCount).toBe(files.length);
  });

  it('5개 업무 테이블을 만든다', async () => {
    const { rows } = await pool.query<{ table_name: string }>(
      `SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' ORDER BY table_name`,
    );
    expect(rows.map((row) => row.table_name)).toEqual([
      'job_locks',
      'job_runs',
      'notifications',
      'schema_migrations',
      'source_items',
      'source_state',
    ]);
  });
});
