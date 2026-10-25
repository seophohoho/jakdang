import { mkdtemp, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { SEEN_LIMIT, loadState, remember, saveState } from '../src/state.js';

const tempDir = () => mkdtemp(join(tmpdir(), 'jakdang-'));

describe('loadState / saveState', () => {
  it('loadState returns {} when the file is missing', async () => {
    expect(await loadState(join(await tempDir(), 'none.json'))).toEqual({});
  });

  it('loadState throws on invalid JSON', async () => {
    const path = join(await tempDir(), 'broken.json');
    await writeFile(path, '{not json');
    await expect(loadState(path)).rejects.toThrow();
  });

  it('saveState creates the parent folder and round-trips', async () => {
    const path = join(await tempDir(), 'data', 'sent.json');
    await saveState(path, { wevity: ['1', '2'] });
    expect(await loadState(path)).toEqual({ wevity: ['1', '2'] });
  });
});

describe('remember', () => {
  it('appends new ids after old ones', () => {
    expect(remember(['a', 'b'], ['c'])).toEqual(['a', 'b', 'c']);
  });

  it('moves ids seen again to the end', () => {
    expect(remember(['a', 'b', 'c'], ['a'])).toEqual(['b', 'c', 'a']);
  });

  it('drops duplicates in the current ids', () => {
    expect(remember(undefined, ['x', 'x', 'y'])).toEqual(['x', 'y']);
  });

  it('keeps only the last SEEN_LIMIT ids', () => {
    const prev = Array.from({ length: SEEN_LIMIT }, (_, i) => String(i));
    const next = remember(prev, ['new']);
    expect(next).toHaveLength(SEEN_LIMIT);
    expect(next[0]).toBe('1');
    expect(next.at(-1)).toBe('new');
  });
});
