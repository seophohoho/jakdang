# 개발 행사 알림 봇 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 사이트 7곳의 목록 첫 페이지를 하루 2번 읽고, 새로 올라온 행사를 Mattermost 웹훅으로 하나씩 보낸다.

**Architecture:** GitHub Actions가 `npm start`를 돌린다. `run()`이 사이트를 하나씩 읽고, 저장소 안 `data/sent.json`과 비교해 새 항목만 보낸다. 그다음 갱신된 파일을 Actions가 커밋한다. 사이트마다 `parseX(body)` 순수 함수가 하나씩 있다. 테스트는 실제 응답을 저장한 fixture로 한다.

**Tech Stack:** Node.js 24, TypeScript, tsx, cheerio, vitest, GitHub Actions

**Spec:** `docs/superpowers/specs/2026-10-25-dev-event-bot-design.md`

## Global Constraints

- 코드에 주석을 달지 않는다(사용자 규칙).
- Node 24. 로컬 기본 `node`는 20.17이다. 모든 명령 전에 `export PATH="$HOME/.nvm/versions/node/v24.22.1/bin:$PATH"`를 실행한다.
- 의존성 버전은 이 저장소가 2026-10-23에 쓰던 값을 따른다. `cheerio ^1.2.0`, `tsx ^4.23.15`, `typescript ^7.0.2`, `vitest ^5.0.5`, `@types/node ^24.19.2`. 이 밖의 의존성은 추가하지 않는다.
- `npm install`이 권한에서 막히면 시도를 반복하지 않는다. 사용자에게 `! npm install` 한 줄을 요청한다. `git push`도 사용자가 실행한다.
- User-Agent는 정확히 `Mozilla/5.0 (compatible; jakdang-event-bot/0.1; personal developer event notifier)`로 한다. 브라우저 UA로 바꾸지 않는다.
- 요청은 한 번에 하나만 보낸다. 같은 호스트에는 요청 사이에 1초 이상 둔다. 타임아웃은 10초다. spec에 적힌 목록 주소만 요청한다. 상세 페이지, 로그인, 우회는 하지 않는다.
- 개발 여부 판정, 키워드 필터, 사이트 간 중복 제거, 한 회차 발송 상한은 만들지 않는다(spec "사용자가 정한 것").
- 알림 글 형식은 정확히 `## 제목\n- 사이트: 사이트이름\n- 링크: 링크`다(Mattermost 마크다운).
- 사이트 id와 이름: `wevity` 위비티, `dacon` DACON, `allcon` 올콘, `thinkgood` 씽굿, `okky` OKKY, `thinkyou` 씽유, `contestkorea` 콘테스트코리아.
- 상태 파일은 `data/sent.json`이다. 저장된 키가 없는 사이트는 보내지 않고 기억만 한다(첫 실행, 나중에 추가한 사이트 모두).
- 실행 시각은 9:00·15:00 KST다. 한국은 서머타임이 없으므로 UTC cron `0 0,6 * * *`로 쓴다.
- 웹훅 주소는 환경변수 `MATTERMOST_WEBHOOK_URL`로 받는다. Actions에서는 같은 이름의 Secret이다.
- 커밋 메시지는 한국어로 쓰고 끝에 `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`를 붙인다.

## Review Focus

1. 사이트 하나가 오류를 내거나 시간 초과 → 나머지 사이트는 보내고, 그 회차는 실패(exit 1)로 끝난다. Task 2 `keeps posting other sources when one source throws`
2. 웹훅이 중간에 실패 → 이미 보낸 항목만 기억하고, 못 보낸 항목은 다음 회차에 보낸다. Task 2 `remembers only posted items when the webhook fails midway`
3. 한 번 읽은 목록에 같은 ID가 두 번 나옴(예: 위비티 광고 항목이 일반 목록에도 있음) → 한 번만 보낸다. Task 2 `posts an item once when the list repeats its id`
4. `data/sent.json`이 없음 → 모든 사이트를 기억만 하고 0건 보낸다. 파일이 깨짐 → 조용히 다시 기억하지 않고 실패한다. Task 1 `loadState returns {} when the file is missing`, `loadState throws on invalid JSON`
5. 제목에 배지 HTML, 엔티티(`&amp;`), 줄바꿈·연속 공백이 섞임 → 알림에는 깨끗한 한 줄 제목이 간다. Task 3 `cleanText`, Task 5 올콘 `strips badge html from titles`

---

### Task 1: 프로젝트 뼈대와 보낸 목록 저장

**Files:**
- Create: `package.json`, `.nvmrc`, `tsconfig.json`
- Create: `src/types.ts`, `src/state.ts`
- Test: `tests/state.test.ts`

**Interfaces:**
- Produces:
  - `src/types.ts`: `export type Item = { id: string; title: string; url: string }`, `export type Source = { id: string; name: string; read: () => Promise<Item[]> }`
  - `src/state.ts`: `export type State = Record<string, string[]>`, `export const SEEN_LIMIT = 1000`, `loadState(path: string): Promise<State>`, `saveState(path: string, state: State): Promise<void>`, `remember(prev: string[] | undefined, currentIds: string[]): string[]`

- [ ] **Step 1: 뼈대 파일을 만들고 설치한다**

`package.json`: `"name": "jakdang"`, `"private": true`, `"type": "module"`, `"engines": { "node": "24.x" }`. scripts는 `"start": "tsx src/main.ts"`, `"check": "tsx src/check.ts"`, `"test": "vitest run"`, `"typecheck": "tsc --noEmit"`. 의존성은 Global Constraints의 버전을 쓴다. cheerio는 dependencies, 나머지는 devDependencies다.

`.nvmrc`: `24`

`tsconfig.json`: 아래 compilerOptions를 쓰고, `"include": ["src", "tests"]`로 한다.

```json
{
  "compilerOptions": {
    "target": "ES2024",
    "lib": ["ES2024"],
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "verbatimModuleSyntax": true,
    "isolatedModules": true,
    "resolveJsonModule": true,
    "skipLibCheck": true,
    "noEmit": true
  },
  "include": ["src", "tests"]
}
```

Run: `npm install`
Expected: `package-lock.json`과 `node_modules/`가 생긴다.

- [ ] **Step 2: 실패하는 테스트를 쓴다**

`tests/state.test.ts`:

```ts
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
```

- [ ] **Step 3: 실패를 확인한다**

Run: `npx vitest run tests/state.test.ts`
Expected: FAIL (`../src/state.js`를 찾지 못함)

- [ ] **Step 4: `src/types.ts`와 `src/state.ts`를 구현한다**

Interfaces 블록의 시그니처대로 만든다.
- `loadState`: 파일이 없을 때(`ENOENT`)만 `{}`를 돌려준다. 그 밖의 오류와 JSON 파싱 오류는 그대로 던진다.
- `saveState`: 부모 폴더를 `mkdir({ recursive: true })`로 만든다. `JSON.stringify(state, null, 2) + '\n'`로 쓴다.
- `remember`: 이전 목록에서 이번에 다시 본 ID를 빼고, 이번 ID를 중복 없이 뒤에 붙인 다음, 마지막 `SEEN_LIMIT`개만 남긴다.

- [ ] **Step 5: 통과를 확인한다**

Run: `npx vitest run tests/state.test.ts && npm run typecheck`
Expected: 7 passed, 타입 오류 없음

- [ ] **Step 6: 커밋한다**

```bash
git add package.json package-lock.json .nvmrc tsconfig.json src/types.ts src/state.ts tests/state.test.ts
git commit -m "봇: 프로젝트 뼈대와 보낸 목록 저장"
```

---

### Task 2: 알림 보내기와 실행 흐름

**Files:**
- Create: `src/sleep.ts`, `src/mattermost.ts`, `src/run.ts`
- Test: `tests/mattermost.test.ts`, `tests/run.test.ts`

**Interfaces:**
- Consumes: Task 1의 `Item`, `Source`, `State`, `remember`
- Produces:
  - `src/sleep.ts`: `sleep(ms: number): Promise<void>`
  - `src/mattermost.ts`: `formatMessage(sourceName: string, item: Item): string`, `postMessage(webhookUrl: string, text: string): Promise<void>`
  - `src/run.ts`: `export type Failure = { sourceId: string; error: string }`, `export type RunDeps = { sources: Source[]; state: State; post: (text: string) => Promise<void>; pause?: () => Promise<void> }`, `run(deps: RunDeps): Promise<{ state: State; failures: Failure[]; sent: number }>`

- [ ] **Step 1: 실패하는 테스트를 쓴다**

`tests/mattermost.test.ts`:

```ts
import { afterEach, describe, expect, it, vi } from 'vitest';
import { formatMessage, postMessage } from '../src/mattermost.js';

afterEach(() => vi.unstubAllGlobals());

describe('mattermost', () => {
  it('formatMessage writes the title as h2 and the site and link as list items', () => {
    const item = { id: '111802', title: '현대자동차그룹 차량용 앱 개발 공모전', url: 'https://www.wevity.com/?c=find&s=1&gbn=view&ix=111802' };
    expect(formatMessage('위비티', item)).toBe('## 현대자동차그룹 차량용 앱 개발 공모전\n- 사이트: 위비티\n- 링크: https://www.wevity.com/?c=find&s=1&gbn=view&ix=111802');
  });

  it('postMessage sends the text as JSON to the webhook', async () => {
    const fetchMock = vi.fn(async (_url: string, _init: RequestInit) => new Response('ok'));
    vi.stubGlobal('fetch', fetchMock);
    await postMessage('https://mm.test/hooks/abc', 'hi');
    const [url, init] = fetchMock.mock.calls[0]!;
    expect(url).toBe('https://mm.test/hooks/abc');
    expect(init.method).toBe('POST');
    expect(new Headers(init.headers).get('content-type')).toBe('application/json');
    expect(JSON.parse(String(init.body))).toEqual({ text: 'hi' });
  });

  it('postMessage throws when the webhook answers non-2xx', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => new Response('bad', { status: 502 })));
    await expect(postMessage('https://mm.test/hooks/abc', 'hi')).rejects.toThrow(/502/);
  });
});
```

`tests/run.test.ts`:

```ts
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
```

- [ ] **Step 2: 실패를 확인한다**

Run: `npx vitest run tests/mattermost.test.ts tests/run.test.ts`
Expected: FAIL (모듈 없음)

- [ ] **Step 3: `src/sleep.ts`, `src/mattermost.ts`, `src/run.ts`를 구현한다**

- `postMessage`: `fetch(webhookUrl, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ text }), signal: AbortSignal.timeout(10_000) })`로 보낸다. `!res.ok`면 상태 코드를 넣은 Error를 던진다.
- `run`: 사이트를 차례로 하나씩 처리한다. `pause` 기본값은 `() => sleep(1000)`이고, 글 하나를 보낼 때마다 호출한다.
  1. `read()`가 던지면 `{ sourceId, error: err.message }`를 failures에 넣는다. 그 사이트의 상태는 그대로 두고 다음 사이트로 간다.
  2. 같은 ID는 처음 나온 것만 남긴다.
  3. `state[id]`가 없으면 `remember(undefined, ids)`로 기억만 한다.
  4. 있으면 안 본 항목만 목록 순서대로 보낸다. `post`가 던지면 failure를 기록하고 그 사이트의 남은 발송을 멈춘다.
  5. 새 상태는 `remember(prev, ids에서 못 보낸 ID를 뺀 것)`이다.
  6. 입력 `state`는 바꾸지 않는다. 새 상태는 입력의 얕은 복사본에서 시작한다. 그래야 이번에 읽지 못한 사이트나 목록에서 빠진 사이트의 키가 남는다.

- [ ] **Step 4: 통과를 확인한다**

Run: `npm test && npm run typecheck`
Expected: 전부 통과, 타입 오류 없음

- [ ] **Step 5: 커밋한다**

```bash
git add src/sleep.ts src/mattermost.ts src/run.ts tests/mattermost.test.ts tests/run.test.ts
git commit -m "봇: Mattermost 발송과 실행 흐름"
```

---

### Task 3: HTTP 도우미, 점검 명령, 위비티·DACON

**Files:**
- Create: `src/http.ts`, `src/sources/shared.ts`, `src/sources/wevity.ts`, `src/sources/dacon.ts`, `src/sources/index.ts`, `src/check.ts`
- Create: `tests/fixtures/wevity-1.html`, `tests/fixtures/dacon.html`
- Test: `tests/http.test.ts`, `tests/sources/shared.test.ts`, `tests/sources/wevity.test.ts`, `tests/sources/dacon.test.ts`

**Interfaces:**
- Consumes: Task 1 `Item`, `Source`. Task 2 `sleep`
- Produces:
  - `src/http.ts`: `export const USER_AGENT`, `fetchText(url: string, init?: RequestInit): Promise<string>`
  - `src/sources/shared.ts`: `cleanText(text: string): string`, `requireItems(sourceId: string, items: Item[]): Item[]`
  - `src/sources/wevity.ts`: `parseWevity(html: string): Item[]`, `export const wevity: Source`
  - `src/sources/dacon.ts`: `parseDacon(html: string): Item[]`, `export const dacon: Source`
  - `src/sources/index.ts`: `export const sources: Source[]`. Task 4·5가 여기에 추가한다. 최종 순서는 wevity, dacon, allcon, thinkgood, okky, thinkyou, contestkorea다.
  - `src/check.ts`: `npm run check`. 사이트마다 실제로 읽는다. 결과는 한 줄씩 `id<TAB>N건<TAB>첫 제목`, 실패하면 `id<TAB>실패<TAB>메시지`로 찍는다. 하나라도 실패하면 exit code 1이다.

- [ ] **Step 1: robots.txt를 확인하고 fixture를 받는다**

```bash
UA='Mozilla/5.0 (compatible; jakdang-event-bot/0.1; personal developer event notifier)'
mkdir -p tests/fixtures
curl -s -A "$UA" https://www.wevity.com/robots.txt; sleep 1
curl -s -A "$UA" 'https://www.wevity.com/?c=find&s=1&gub=1&cidx=20&gp=1' -o tests/fixtures/wevity-1.html; sleep 1
curl -s -A "$UA" https://dacon.io/robots.txt; sleep 1
curl -s -A "$UA" https://dacon.io/competitions -o tests/fixtures/dacon.html
grep -c 'ms-list' tests/fixtures/wevity-1.html; grep -c 'official-comp' tests/fixtures/dacon.html
```

Expected: robots.txt가 위 목록 경로를 막지 않는다. 두 grep이 모두 1 이상이다. 막혀 있으면 멈추고 사용자에게 알린다.

- [ ] **Step 2: 실패하는 테스트를 쓴다**

`tests/http.test.ts`에서는 `fetch`를 `vi.stubGlobal`로 바꾼다.
- `sends the bot user agent`: `new Headers(init.headers).get('user-agent') === USER_AGENT`
- `keeps caller headers, method and body`: `fetchText(url, { method: 'POST', body: 'a=1', headers: { 'content-type': 'application/x-www-form-urlencoded' } })`를 부르면 method, body, content-type, user-agent가 모두 넘어간다.
- `throws on non-2xx`: 404 응답이면 `/404/`로 reject된다.

`tests/sources/shared.test.ts`:
- `cleanText`: `cleanText('  A & B\n\t 해커톤 ') === 'A & B 해커톤'`
- `requireItems`: 빈 배열이면 `/okky/`를 담은 Error를 던지고, 아니면 같은 배열을 돌려준다.

사이트 parser 테스트는 아래 모양을 따른다. Task 4·5도 같다.

```ts
import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { parseWevity } from '../../src/sources/wevity.js';

const html = readFileSync(new URL('../fixtures/wevity-1.html', import.meta.url), 'utf8');

describe('parseWevity', () => {
  it('parses items with canonical links and clean titles', () => {
    const items = parseWevity(html);
    expect(items.length).toBeGreaterThanOrEqual(5);
    for (const i of items) {
      expect(i.id).toMatch(/^\d+$/);
      expect(i.url).toBe(`https://www.wevity.com/?c=find&s=1&gbn=view&ix=${i.id}`);
      expect(i.title).not.toBe('');
      expect(i.title).toBe(i.title.trim());
      expect(i.title).not.toMatch(/^(SPECIAL|신규|IDEA)/);
    }
  });

  it('includes a known item from the fixture', () => {
    expect(parseWevity(html)).toContainEqual(KNOWN_ITEM);
  });

  it('throws when the list is missing', () => {
    expect(() => parseWevity('<html></html>')).toThrow(/wevity/);
  });
});
```

`KNOWN_ITEM`에는 fixture에서 눈으로 확인한 일반 항목 하나를 `{ id, title, url }` 그대로 넣는다.

DACON은 같은 모양이다. 차이는 세 가지다. 건수는 `>= 5`, ID는 `/^\d+$/`, url은 `https://dacon.io/competitions/official/${id}/overview/`다.

- [ ] **Step 3: 실패를 확인한다**

Run: `npx vitest run tests/http.test.ts tests/sources`
Expected: FAIL (모듈 없음)

- [ ] **Step 4: 구현한다**

- `fetchText`: `init.headers`에 `user-agent: USER_AGENT`를 더한다. `signal: AbortSignal.timeout(10_000)`을 넣는다. `!res.ok`면 상태 코드와 url을 넣은 Error를 던진다. 성공하면 `res.text()`를 돌려준다.
- `cleanText`: 연속 공백을 하나로 줄이고 앞뒤를 자른다.
- `requireItems`: 빈 배열이면 `Error(\`${sourceId}: 목록에서 항목을 찾지 못했다\`)`를 던진다.
- `parseWevity`: spec "1. 위비티"의 선택자를 쓴다. 컨테이너가 없으면 `requireItems`가 던지게 빈 배열로 끝낸다. 제목에서 `span`을 지운 뒤 `cleanText`를 적용한다.
- `wevity.read`: `gp=1`, `gp=2` 두 페이지를 읽는다(`...&cidx=20&gp=<n>`). 사이에 `sleep(1000)`을 둔다. 두 결과를 이어 붙인다. 하루 2회 사이에 1페이지 일반 항목(약 8건)을 넘게 올라오는 날을 대비해서다.
- `parseDacon`·`dacon.read`: spec "2. DACON"의 선택자와 주소를 쓴다. 한 페이지만 읽는다.
- `index.ts`에는 `[wevity, dacon]`을 넣고, `check.ts`를 만든다.

- [ ] **Step 5: 통과를 확인하고 실제 사이트로 점검한다**

Run: `npm test && npm run typecheck && npm run check`
Expected: 테스트가 전부 통과한다. check는 `wevity  N건  …`, `dacon  N건  …` 두 줄이고 N은 1 이상, exit 0이다.

- [ ] **Step 6: 커밋한다**

```bash
git add src/http.ts src/sources src/check.ts tests/http.test.ts tests/sources tests/fixtures
git commit -m "봇: HTTP 도우미, 점검 명령, 위비티·DACON 읽기"
```

---

### Task 4: OKKY·씽유·콘테스트코리아

**Files:**
- Create: `src/sources/okky.ts`, `src/sources/thinkyou.ts`, `src/sources/contestkorea.ts`
- Modify: `src/sources/index.ts`
- Create: `tests/fixtures/okky.html`, `tests/fixtures/thinkyou.html`, `tests/fixtures/contestkorea.html`
- Test: `tests/sources/okky.test.ts`, `tests/sources/thinkyou.test.ts`, `tests/sources/contestkorea.test.ts`

**Interfaces:**
- Consumes: Task 3 `fetchText`, `cleanText`, `requireItems`
- Produces: `parseOkky(html)`, `okky`, `parseThinkyou(html)`, `thinkyou`, `parseContestkorea(html)`, `contestkorea`. 모두 Task 3과 같은 모양이다.

- [ ] **Step 1: robots.txt를 확인하고 fixture를 받는다**

Task 3 Step 1처럼 한다. 주소는 spec "5. OKKY", "6. 씽유", "7. 콘테스트코리아"의 목록 주소다. 받은 뒤 아래를 확인한다.
- OKKY: 2026-10-25에 받은 1페이지는 46KB였고 2페이지부터는 약 180KB였다. fixture에서 `a[href^="/articles/"]`가 10개 이상 나오는지 본다. 안 나오면 같은 HTML의 `self.__next_f` JSON(`content[].{id, title}`)에서 뽑는다.
- 콘테스트코리아: fixture에서 정렬 링크·select를 찾아 등록일순 값을 확인한다. 있으면 목록 주소에 더해서 다시 받는다. 없으면 기본 정렬로 두고 사용자 보고에 적는다. 항목 링크의 실제 모양(`str_no=` 포함)도 확인한다.

- [ ] **Step 2: 실패하는 테스트를 쓴다**

Task 3의 parser 테스트 모양을 따른다. 사이트별 값:
- OKKY: 건수 `>= 10`, ID `/^\d+$/`, url `https://okky.kr/articles/${id}`
- 씽유: 건수 `>= 10`, ID `/^\d+$/`, url `https://thinkyou.co.kr/contest/${id}/`. 고정 공지 `div.tr.notice`는 결과에 없다. fixture에 있는 공지 제목 하나로 `not.toContainEqual`을 검사한다.
- 콘테스트코리아: 건수 `>= 5`, ID `/^\d{12}$/`. url은 목록 링크를 절대 주소로 바꾼 것이다. 모든 url에 `str_no=${id}`가 들어 있어야 한다. 항목 수는 `div.list_style_2 > ul > li` 개수와 같다. 목록 밖 `str_no` 링크가 섞이지 않았는지 보는 것이다.

- [ ] **Step 3: 실패를 확인한다**

Run: `npx vitest run tests/sources`
Expected: 새 세 파일 FAIL

- [ ] **Step 4: 구현하고 `index.ts`에 추가한다**

각 사이트는 한 페이지만 읽는다. 선택자는 spec과 Step 1에서 확인한 값을 쓴다. 제목에는 `cleanText`를 적용하고, 끝에서 `requireItems`를 거친다.

- [ ] **Step 5: 통과를 확인하고 실제 사이트로 점검한다**

Run: `npm test && npm run typecheck && npm run check`
Expected: 테스트가 전부 통과한다. check는 다섯 줄이 모두 1건 이상이고 exit 0이다.

- [ ] **Step 6: 커밋한다**

```bash
git add src/sources tests/sources tests/fixtures
git commit -m "봇: OKKY·씽유·콘테스트코리아 읽기"
```

---

### Task 5: 올콘·씽굿 (숨은 API)

**Files:**
- Create: `src/sources/allcon.ts`, `src/sources/thinkgood.ts`
- Modify: `src/sources/index.ts`
- Create: `tests/fixtures/allcon.json`, `tests/fixtures/thinkgood.json`
- Test: `tests/sources/allcon.test.ts`, `tests/sources/thinkgood.test.ts`

**Interfaces:**
- Consumes: Task 3 `fetchText`, `cleanText`, `requireItems`
- Produces: `parseAllcon(json: string): Item[]`, `allcon`, `parseThinkgood(json: string): Item[]`, `thinkgood`

- [ ] **Step 1: robots.txt를 확인하고, 항목 링크 모양을 찾고, fixture를 받는다**

```bash
UA='Mozilla/5.0 (compatible; jakdang-event-bot/0.1; personal developer event notifier)'
curl -s -A "$UA" https://www.all-con.co.kr/robots.txt; sleep 1
curl -s -A "$UA" -X POST -H 'content-type: application/x-www-form-urlencoded' \
  --data 'sortorder=asc&page=1&sortname=cl_order&ct[]=5&sc[]=31&stx=&sfl=&rows=15&t=1' \
  https://www.all-con.co.kr/page/ajax.contest_list.php -o tests/fixtures/allcon.json; sleep 1
curl -s -A "$UA" https://www.thinkcontest.com/robots.txt; sleep 1
curl -s -A "$UA" -X POST -H 'content-type: application/json' \
  --data '{"recordsPerPage":20,"currentPageNo":1,"contest_field":"CCFD002","host_organ":"","enter_qualified":"","award_size":"","searchStatus":"Y","sidx":"putup_sdt","sord":"DESC"}' \
  https://www.thinkcontest.com/thinkgood/user/contest/subList.do -o tests/fixtures/thinkgood.json
```

Expected: 두 fixture가 JSON으로 파싱된다(`node -e "JSON.parse(require('fs').readFileSync('tests/fixtures/allcon.json','utf8'))"`). 올콘에는 `rows`, 씽굿에는 `listJsonData`가 있다.

항목 링크 모양은 화면 페이지(`https://www.all-con.co.kr/list/contest/1`, `https://www.thinkcontest.com/thinkgood/user/contest/index.do`)와 그 페이지가 불러오는 목록 스크립트에서 찾는다. 상세 링크를 만드는 코드에서 `cl_srl`, `contest_pk`가 들어가는 주소 틀을 확인한다.

씽굿 fixture에서는 `program_nm`, `contest_pk`를 뺀 나머지 칸을 지운다. 담당자 개인정보 칸을 커밋하지 않기 위해서다.

- [ ] **Step 2: 실패하는 테스트를 쓴다**

Task 3의 parser 테스트 모양을 따르되, fixture를 `utf8` 문자열로 읽어 넘긴다.
- 올콘: 건수 `>= 5`, ID `/^\d+$/`, url은 Step 1에서 찾은 틀에 `cl_srl`을 넣은 값이다. `throws when rows are empty`: `parseAllcon('{"rows":[]}')`이 `/allcon/`으로 던진다.
- 올콘 `strips badge html from titles`: 모든 제목에 `<`, `>`, `&amp;`가 없다. fixture의 배지 섞인 `cl_title` 하나가 배지 글자 없이 나오는지 확인한다. 배지가 fixture에 없으면 이 행으로 검사한다. `{"rows":[{"cl_srl":"1","cl_title":"<span class=\"badge\">BADGE</span> A &amp; B 해커톤"}]}` → 제목 `A & B 해커톤`
- 씽굿: 건수 `>= 5`, ID `/^\d+$/`, url은 Step 1에서 찾은 틀이다. `throws when the list is empty`: `parseThinkgood('{"listJsonData":[]}')`이 `/thinkgood/`으로 던진다.

- [ ] **Step 3: 실패를 확인한다**

Run: `npx vitest run tests/sources`
Expected: 새 두 파일 FAIL

- [ ] **Step 4: 구현하고 `index.ts`에 추가한다**

`read`는 Step 1과 같은 주소·본문·content-type으로 `fetchText`를 POST한다. 올콘 제목은 `cheerio.load(cl_title).text()`로 태그를 지우고 엔티티를 디코드한 다음 `cleanText`를 적용한다. 배지 요소가 있으면 그 요소를 먼저 지운다. `id`는 `String()`으로 바꾼다.

- [ ] **Step 5: 통과를 확인하고 실제 사이트로 점검한다**

Run: `npm test && npm run typecheck && npm run check`
Expected: 테스트가 전부 통과한다. check는 일곱 줄이 모두 1건 이상이고 exit 0이다.

- [ ] **Step 6: 커밋한다**

```bash
git add src/sources tests/sources tests/fixtures
git commit -m "봇: 올콘·씽굿 읽기"
```

---

### Task 6: 실행 진입점과 GitHub Actions

**Files:**
- Create: `src/main.ts`, `.github/workflows/notify.yml`

**Interfaces:**
- Consumes: `sources`, `loadState`, `saveState`, `run`, `postMessage`

- [ ] **Step 1: `src/main.ts`를 구현한다**

1. `MATTERMOST_WEBHOOK_URL`이 비어 있으면 상태 파일을 건드리기 전에 Error를 던진다.
2. `loadState('data/sent.json')`으로 상태를 읽고 `run({ sources, state, post: text => postMessage(url, text) })`을 부른다.
3. `saveState`로 저장한다.
4. `보냄 N건, 실패 M곳`을 찍는다. 실패마다 `sourceId: error`를 `console.error`로 찍는다.
5. 실패가 하나라도 있으면 `process.exitCode = 1`로 한다.

- [ ] **Step 2: 진입점을 확인한다**

Run: `MATTERMOST_WEBHOOK_URL= npm start; echo "exit $?"; ls data 2>&1`
Expected: 웹훅 주소가 없다는 오류가 나고 exit 1이다. `data`가 없다.

Run: `MATTERMOST_WEBHOOK_URL=http://127.0.0.1:9/ npm start; echo "exit $?"; node -e "console.log(Object.keys(JSON.parse(require('fs').readFileSync('data/sent.json','utf8'))))"; rm -r data`
Expected: `보냄 0건, 실패 0곳`, exit 0. 키 7개(첫 실행이라 기억만 함)가 나온다. 이 로컬 상태는 지운다. 첫 기억은 Actions에서 한다.

- [ ] **Step 3: `.github/workflows/notify.yml`을 쓴다**

`actions/checkout`, `actions/setup-node`는 쓸 때 기준 최신 메이저 버전을 쓴다(아래는 v5).

```yaml
name: notify
on:
  schedule:
    - cron: '0 0,6 * * *'
  workflow_dispatch:
permissions:
  contents: write
concurrency:
  group: notify
  cancel-in-progress: false
jobs:
  notify:
    runs-on: ubuntu-latest
    timeout-minutes: 10
    steps:
      - uses: actions/checkout@v5
      - uses: actions/setup-node@v5
        with:
          node-version-file: .nvmrc
          cache: npm
      - run: npm ci
      - run: npm start
        env:
          MATTERMOST_WEBHOOK_URL: ${{ secrets.MATTERMOST_WEBHOOK_URL }}
      - if: always()
        run: |
          [ -f data/sent.json ] || exit 0
          git config user.name 'github-actions[bot]'
          git config user.email '41898282+github-actions[bot]@users.noreply.github.com'
          git add data/sent.json
          git diff --cached --quiet || { git commit -m '봇: 보낸 목록 갱신' && git push; }
```

- [ ] **Step 4: 전체를 확인한다**

Run: `npm test && npm run typecheck`
Expected: 전부 통과

- [ ] **Step 5: 커밋한다**

```bash
git add src/main.ts .github/workflows/notify.yml
git commit -m "봇: 실행 진입점과 GitHub Actions 예약 실행"
```

---

### Task 7: 운영 시작 (사용자가 실행)

예약 실행(`schedule`)은 기본 브랜치(main)에서만 돈다. 아래 명령은 push나 외부 설정이 들어가므로 사용자에게 `!` 한 줄씩 요청한다.

- [ ] **Step 1: 브랜치를 main에 합친다.** superpowers:finishing-a-development-branch로 방법을 정하고, push는 사용자가 한다.
- [ ] **Step 2: Secret을 넣는다.** `! gh secret set MATTERMOST_WEBHOOK_URL --repo seophohoho/jakdang`. 주소는 Mattermost 통합 > Incoming Webhooks에서 복사한다.
- [ ] **Step 3: 첫 실행으로 기억만 시킨다.** `! gh workflow run notify --repo seophohoho/jakdang`
  Expected: Actions 실행이 성공한다. main에 `봇: 보낸 목록 갱신` 커밋이 생기고, `data/sent.json`에 키 7개가 있다. 채널에는 글이 올라오지 않는다.
- [ ] **Step 4: 다음 9:00 또는 15:00 실행을 확인한다.** Actions 기록에 `보냄 N건, 실패 0곳`이 있고, N이 1 이상이면 채널에 그만큼 글이 올라와 있다.
