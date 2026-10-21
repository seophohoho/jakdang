import type { SourceAdapter } from '../types.js';
import { daconAdapter } from './dacon.js';
import { genericAdapter } from './generic.js';
import { ossAdapter } from './oss.js';
import { wevityAdapter } from './wevity.js';

const ADAPTERS: Record<string, SourceAdapter> = {
  generic: genericAdapter,
  wevity: wevityAdapter,
  dacon: daconAdapter,
  oss: ossAdapter,
};

export function adapterFor(name: string): SourceAdapter {
  const adapter = ADAPTERS[name];
  if (!adapter) throw new Error(`알 수 없는 어댑터입니다: ${name}`);
  return adapter;
}
