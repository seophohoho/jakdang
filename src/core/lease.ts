import { randomUUID } from 'node:crypto';
import type { Queryable } from '../db/client.js';
import { releaseLock, renewLock, tryAcquireLock } from '../db/repository.js';

export class LockLostError extends Error {
  constructor(name: string) {
    super(`실행 잠금(${name})을 잃었습니다. 새 DB 변경과 발송을 중단합니다.`);
    this.name = 'LockLostError';
  }
}

export interface LeaseOptions {
  leaseMs: number;
  renewEveryMs: number;
  now?: () => number;
  owner?: string;
}

export class Lease {
  private lastRenewedAt: number;
  private lost = false;
  private released = false;

  private constructor(
    private readonly db: Queryable,
    readonly name: string,
    readonly owner: string,
    private readonly options: Required<Pick<LeaseOptions, 'leaseMs' | 'renewEveryMs' | 'now'>>,
  ) {
    this.lastRenewedAt = options.now();
  }

  static async acquire(db: Queryable, name: string, options: LeaseOptions): Promise<Lease | null> {
    const owner = options.owner ?? randomUUID();
    const now = options.now ?? Date.now;
    const acquired = await tryAcquireLock(db, name, owner, options.leaseMs);
    if (!acquired) return null;
    return new Lease(db, name, owner, { leaseMs: options.leaseMs, renewEveryMs: options.renewEveryMs, now });
  }

  get isLost(): boolean {
    return this.lost;
  }

  async ensure(): Promise<void> {
    if (this.lost || this.released) throw new LockLostError(this.name);
    if (this.options.now() - this.lastRenewedAt < this.options.renewEveryMs) return;
    await this.renew();
  }

  async renew(): Promise<void> {
    if (this.lost || this.released) throw new LockLostError(this.name);
    const renewed = await renewLock(this.db, this.name, this.owner, this.options.leaseMs);
    if (!renewed) {
      this.lost = true;
      throw new LockLostError(this.name);
    }
    this.lastRenewedAt = this.options.now();
  }

  async release(): Promise<boolean> {
    if (this.released) return false;
    this.released = true;
    if (this.lost) return false;
    return releaseLock(this.db, this.name, this.owner);
  }
}
