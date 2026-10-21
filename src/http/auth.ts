import { createHash, timingSafeEqual } from 'node:crypto';
import { MIN_CRON_SECRET_LENGTH } from '../config.js';

const digest = (value: string) => createHash('sha256').update(value, 'utf8').digest();

export function isAuthorized(authorization: string | null, secret: string | undefined): boolean {
  if (secret === undefined || secret.length < MIN_CRON_SECRET_LENGTH) return false;
  if (authorization === null) return false;
  const match = authorization.match(/^Bearer (.+)$/);
  if (!match?.[1]) return false;
  return timingSafeEqual(digest(match[1]), digest(secret));
}
