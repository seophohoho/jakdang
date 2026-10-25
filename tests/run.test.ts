import { describe, expect, it } from 'vitest';
import { run } from '../src/run.js';
import type { Item, Source } from '../src/types.js';

const item = (id: string): Item => ({ id, title: `t${id}`, url: `https://x.test/${id}` });
const listing = (id: string, ids: string[]): Source => ({ id, name: id.toUpperCase(), read: async () => ids.map(item) });
const broken = (id: string, message: string): Source => ({ id, name: id, read: async () => { throw new Error(message); } });
const noPause = async () => {};
const msg = (name: string, id: string) => `## t${id}\n- 사이트: ${name}\n- 링크: https://x.test/${id}`;

function recorder(failOnCall?: number) {
  const texts: string[] = [];
  let calls = 0;
  const post = async (text: string) => {
    calls += 1;
    if (calls === failOnCall) throw new Error('webhook 502');
    texts.push(text);
  };
  return { texts, post };
}

describe('run', () => {
  it('seeds a source with no saved ids without posting', async () => {
    const r = recorder();
    const result = await run({ sources: [listing('a', ['1', '2'])], state: {}, post: r.post, pause: noPause });
    expect(r.texts).toEqual([]);
    expect(result).toEqual({ state: { a: ['1', '2'] }, failures: [], sent: 0 });
  });

  it('posts only unseen items in list order', async () => {
    const r = recorder();
    const result = await run({ sources: [listing('a', ['3', '1', '4'])], state: { a: ['1'] }, post: r.post, pause: noPause });
    expect(r.texts).toEqual([msg('A', '3'), msg('A', '4')]);
    expect(result.state.a).toEqual(['3', '1', '4']);
    expect(result.sent).toBe(2);
  });

  it('posts an item once when the list repeats its id', async () => {
    const r = recorder();
    await run({ sources: [listing('a', ['5', '5'])], state: { a: [] }, post: r.post, pause: noPause });
    expect(r.texts).toEqual([msg('A', '5')]);
  });

  it('keeps posting other sources when one source throws', async () => {
    const r = recorder();
    const result = await run({ sources: [broken('bad', 'timeout'), listing('ok', ['2'])], state: { bad: ['x'], ok: ['1'] }, post: r.post, pause: noPause });
    expect(r.texts).toEqual([msg('OK', '2')]);
    expect(result.failures).toEqual([{ sourceId: 'bad', error: 'timeout' }]);
    expect(result.state.bad).toEqual(['x']);
  });

  it('remembers only posted items when the webhook fails midway', async () => {
    const first = recorder(2);
    const a = listing('a', ['1', '2', '3']);
    const result = await run({ sources: [a], state: { a: [] }, post: first.post, pause: noPause });
    expect(first.texts).toEqual([msg('A', '1')]);
    expect(result.failures).toHaveLength(1);
    expect(result.state.a).toEqual(['1']);
    const second = recorder();
    await run({ sources: [a], state: result.state, post: second.post, pause: noPause });
    expect(second.texts).toEqual([msg('A', '2'), msg('A', '3')]);
  });

  it('seeds a newly added source while posting for known ones', async () => {
    const r = recorder();
    const result = await run({ sources: [listing('a', ['2']), listing('b', ['9'])], state: { a: ['1'] }, post: r.post, pause: noPause });
    expect(r.texts).toEqual([msg('A', '2')]);
    expect(result.state.b).toEqual(['9']);
  });

  it('does not mutate the input state', async () => {
    const state = { a: ['1'] };
    await run({ sources: [listing('a', ['2'])], state, post: recorder().post, pause: noPause });
    expect(state).toEqual({ a: ['1'] });
  });
});
