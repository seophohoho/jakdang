import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname } from 'node:path';

export type State = Record<string, string[]>;

export const SEEN_LIMIT = 1000;

export async function loadState(path: string): Promise<State> {
  let text: string;
  try {
    text = await readFile(path, 'utf8');
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') return {};
    throw error;
  }
  return JSON.parse(text) as State;
}

export async function saveState(path: string, state: State): Promise<void> {
  await mkdir(dirname(path), { recursive: true });
  await writeFile(path, JSON.stringify(state, null, 2) + '\n');
}

export function remember(prev: string[] | undefined, currentIds: string[]): string[] {
  const current = [...new Set(currentIds)];
  const seenAgain = new Set(current);
  const kept = (prev ?? []).filter((id) => !seenAgain.has(id));
  return [...kept, ...current].slice(-SEEN_LIMIT);
}
