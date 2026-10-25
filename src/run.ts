import { formatMessage } from './mattermost.js';
import { sleep } from './sleep.js';
import { remember, type State } from './state.js';
import type { Item, Source } from './types.js';

export type Failure = { sourceId: string; error: string };

export type RunDeps = {
  sources: Source[];
  state: State;
  post: (text: string) => Promise<void>;
  pause?: () => Promise<void>;
};

function messageOf(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}

function firstOfEachId(items: Item[]): Item[] {
  const seen = new Set<string>();
  return items.filter((item) => {
    if (seen.has(item.id)) return false;
    seen.add(item.id);
    return true;
  });
}

export async function run(deps: RunDeps): Promise<{ state: State; failures: Failure[]; sent: number }> {
  const { sources, state, post, pause = () => sleep(1000) } = deps;
  const next: State = { ...state };
  const failures: Failure[] = [];
  let sent = 0;

  for (const source of sources) {
    let items: Item[];
    try {
      items = firstOfEachId(await source.read());
    } catch (error) {
      failures.push({ sourceId: source.id, error: messageOf(error) });
      continue;
    }

    const ids = items.map((item) => item.id);
    const prev = state[source.id];
    if (prev === undefined) {
      next[source.id] = remember(undefined, ids);
      continue;
    }

    const known = new Set(prev);
    const notPosted = new Set<string>();
    let stopped = false;
    for (const item of items) {
      if (known.has(item.id)) continue;
      if (stopped) {
        notPosted.add(item.id);
        continue;
      }
      try {
        await post(formatMessage(source.name, item));
      } catch (error) {
        failures.push({ sourceId: source.id, error: messageOf(error) });
        stopped = true;
        notPosted.add(item.id);
        continue;
      }
      sent += 1;
      await pause();
    }
    next[source.id] = remember(prev, ids.filter((id) => !notPosted.has(id)));
  }

  return { state: next, failures, sent };
}
