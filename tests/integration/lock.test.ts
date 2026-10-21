import { randomUUID } from 'node:crypto';
import { afterAll, beforeEach, describe, expect, it } from 'vitest';
import { Lease, LockLostError } from '../../src/core/lease.js';
import { releaseLock, renewLock, tryAcquireLock } from '../../src/db/repository.js';
import { createTestPool, resetDatabase } from './db.js';

const pool = createTestPool(8);

afterAll(async () => {
  await pool.end();
});

beforeEach(async () => {
  await resetDatabase(pool);
});

describe('job_locks 임대 잠금', () => {
  it('동시에 두 실행이 잡으면 하나만 성공한다', async () => {
    for (let round = 0; round < 20; round += 1) {
      await pool.query('DELETE FROM job_locks');
      const results = await Promise.all([
        tryAcquireLock(pool, 'sync', randomUUID(), 60_000),
        tryAcquireLock(pool, 'sync', randomUUID(), 60_000),
      ]);
      expect(results.filter(Boolean)).toHaveLength(1);
    }
  });

  it('소유자가 다르면 갱신·해제하지 못한다', async () => {
    const owner = randomUUID();
    expect(await tryAcquireLock(pool, 'sync', owner, 60_000)).toBe(true);
    expect(await renewLock(pool, 'sync', randomUUID(), 60_000)).toBe(false);
    expect(await releaseLock(pool, 'sync', randomUUID())).toBe(false);
    expect(await renewLock(pool, 'sync', owner, 60_000)).toBe(true);
    expect(await releaseLock(pool, 'sync', owner)).toBe(true);
    expect(await tryAcquireLock(pool, 'sync', randomUUID(), 60_000)).toBe(true);
  });

  it('만료된 잠금은 다른 실행이 회수하고, 이전 소유자는 갱신하지 못한다', async () => {
    const stale = randomUUID();
    expect(await tryAcquireLock(pool, 'sync', stale, 60_000)).toBe(true);
    expect(await tryAcquireLock(pool, 'sync', randomUUID(), 60_000)).toBe(false);
    await pool.query(`UPDATE job_locks SET expires_at = now() - interval '1 second'`);
    const fresh = randomUUID();
    expect(await tryAcquireLock(pool, 'sync', fresh, 60_000)).toBe(true);
    expect(await renewLock(pool, 'sync', stale, 60_000)).toBe(false);
    const { rows } = await pool.query('SELECT owner FROM job_locks WHERE name = $1', ['sync']);
    expect(rows[0].owner).toBe(fresh);
  });

  it('만료 후 아무도 가져가지 않았어도 이전 소유자의 갱신은 실패로 본다', async () => {
    const owner = randomUUID();
    await tryAcquireLock(pool, 'sync', owner, 60_000);
    await pool.query(`UPDATE job_locks SET expires_at = now() - interval '1 second'`);
    expect(await renewLock(pool, 'sync', owner, 60_000)).toBe(false);
  });
});

describe('Lease', () => {
  it('갱신 주기가 지나면 ensure가 임대를 연장한다', async () => {
    let clock = 0;
    const lease = await Lease.acquire(pool, 'sync', { leaseMs: 60_000, renewEveryMs: 1_000, now: () => clock });
    expect(lease).not.toBeNull();
    const before = await pool.query('SELECT expires_at FROM job_locks');
    clock = 1_500;
    await new Promise((resolve) => setTimeout(resolve, 20));
    await lease!.ensure();
    const after = await pool.query('SELECT expires_at FROM job_locks');
    expect(after.rows[0].expires_at.getTime()).toBeGreaterThan(before.rows[0].expires_at.getTime());
    expect(await lease!.release()).toBe(true);
  });

  it('잠금을 빼앗기면 ensure가 LockLostError를 던지고 이후에도 계속 막는다', async () => {
    let clock = 0;
    const lease = await Lease.acquire(pool, 'sync', { leaseMs: 60_000, renewEveryMs: 1_000, now: () => clock });
    await pool.query(`UPDATE job_locks SET owner = $1`, [randomUUID()]);
    clock = 2_000;
    await expect(lease!.ensure()).rejects.toBeInstanceOf(LockLostError);
    clock = 2_001;
    await expect(lease!.ensure()).rejects.toBeInstanceOf(LockLostError);
    expect(lease!.isLost).toBe(true);
    expect(await lease!.release()).toBe(false);
    expect((await pool.query('SELECT count(*)::int AS n FROM job_locks')).rows[0].n).toBe(1);
  });

  it('이미 잡힌 잠금이면 acquire가 null을 돌려준다', async () => {
    await Lease.acquire(pool, 'sync', { leaseMs: 60_000, renewEveryMs: 1_000 });
    expect(await Lease.acquire(pool, 'sync', { leaseMs: 60_000, renewEveryMs: 1_000 })).toBeNull();
  });
});
