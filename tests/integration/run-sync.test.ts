import { randomUUID } from 'node:crypto';
import { afterAll, beforeEach, describe, expect, it } from 'vitest';
import { FetchError } from '../../src/collectors/fetch.js';
import { runSync, type RunSyncDeps } from '../../src/core/run-sync.js';
import { tryAcquireLock } from '../../src/db/repository.js';
import { countRows, createTestPool, resetDatabase, snapshotTables } from './db.js';
import { FakeWeb, listHtml, memoryLogger, testConfig, testSource } from './helpers.js';

const pool = createTestPool(6);

afterAll(async () => {
  await pool.end();
});

beforeEach(async () => {
  await resetDatabase(pool);
});

const sourceA = testSource('src-a', 'a.test');
const sourceB = testSource('src-b', 'b.test');
const LIST_A = 'https://a.test/list';
const LIST_B = 'https://b.test/list';

function deps(web: FakeWeb, overrides: Partial<RunSyncDeps> = {}): RunSyncDeps {
  return { pool, fetcher: web, config: testConfig(), logger: memoryLogger(), ...overrides };
}

async function bootstrap(web: FakeWeb, sources = [sourceA]) {
  return runSync(deps(web), { mode: 'cli', bootstrap: true, sources });
}

async function cron(web: FakeWeb, sources = [sourceA], overrides: Partial<RunSyncDeps> = {}) {
  return runSync(deps(web, overrides), { mode: 'cron', sources });
}

describe('bootstrap', () => {
  it('알림 없이 항목을 is_baseline으로 저장하고 처리를 마친 소스만 초기화한다', async () => {
    const web = new FakeWeb()
      .set(LIST_A, { body: listHtml([{ id: '1', title: '기존 해커톤' }, { id: '2', title: '기존 밋업' }]) })
      .set(LIST_B, { status: 404 });
    const result = await bootstrap(web, [sourceA, sourceB]);
    expect(result.status).toBe('partial');
    expect(result.totals).toMatchObject({ baseline: 2, newItems: 0, notificationsCreated: 0 });
    expect(await countRows(pool, 'notifications')).toBe(0);
    const { rows } = await pool.query('SELECT bool_and(is_baseline) AS all_baseline FROM source_items');
    expect(rows[0].all_baseline).toBe(true);
    const states = await pool.query('SELECT source_id, initialized_at, last_error FROM source_state ORDER BY source_id');
    expect(states.rows.map((row) => [row.source_id, row.initialized_at !== null])).toEqual([
      ['src-a', true],
      ['src-b', false],
    ]);
    expect(states.rows[1].last_error).toContain('HTTP 404');
    const run = await pool.query('SELECT mode, status, finished_at FROM job_runs');
    expect(run.rows[0]).toMatchObject({ mode: 'bootstrap', status: 'partial' });
    expect(run.rows[0].finished_at).not.toBeNull();
  });

  it('초기화되지 않은 소스는 cron이 건너뛰고 실행 결과에 남긴다', async () => {
    const web = new FakeWeb()
      .set(LIST_A, { body: listHtml([{ id: '1', title: '기존 해커톤' }]) })
      .set(LIST_B, { body: listHtml([{ id: '9', title: '새 소스 행사' }]) });
    await bootstrap(web, [sourceA]);
    web.requests.length = 0;
    const result = await cron(web, [sourceA, sourceB]);
    expect(result.skippedUninitialized).toEqual(['src-b']);
    expect(result.sources.find((report) => report.sourceId === 'src-b')?.status).toBe('skipped_uninitialized');
    expect(web.requests.map((request) => request.url)).toEqual([LIST_A]);
    expect(await countRows(pool, 'notifications')).toBe(0);
    const { rows } = await pool.query(`SELECT counts FROM job_runs WHERE mode = 'cron'`);
    expect(rows[0].counts.skippedUninitialized).toEqual(['src-b']);
  });
});

describe('신규 판정', () => {
  it('같은 목록을 다시 처리해도 신규 알림은 항목당 채널별 1개다', async () => {
    const web = new FakeWeb().set(LIST_A, { body: listHtml([{ id: '1', title: '기존 해커톤' }]) });
    await bootstrap(web);
    web.set(LIST_A, { body: listHtml([{ id: '2', title: '새 컨퍼런스' }, { id: '1', title: '기존 해커톤' }]) });
    const first = await cron(web);
    expect(first.status).toBe('success');
    expect(first.totals).toMatchObject({ newItems: 1, known: 1, notificationsCreated: 2 });
    for (let round = 0; round < 3; round += 1) {
      const again = await cron(web);
      expect(again.totals).toMatchObject({ newItems: 0, known: 2, notificationsCreated: 0 });
    }
    const { rows } = await pool.query(
      `SELECT n.destination_id, n.status, n.dedupe_key, n.payload, i.external_key
         FROM notifications n JOIN source_items i ON i.id = n.source_item_id ORDER BY n.destination_id`,
    );
    expect(rows).toHaveLength(2);
    expect(rows.map((row) => row.destination_id)).toEqual(['discord-main', 'mattermost-main']);
    expect(rows.every((row) => row.status === 'pending' && row.external_key === '2')).toBe(true);
    expect(rows[0].payload.content).toContain('[신규] 새 컨퍼런스');
    expect(rows[0].payload.allowed_mentions).toEqual({ parse: [] });
    expect(rows[1].payload.text).toContain('링크: https://a.test/events/2?utm_source=list');
  });

  it('여러 신규 항목은 목록 아래쪽(오래된 것)부터 생성 순서를 갖는다', async () => {
    const web = new FakeWeb().set(LIST_A, { body: listHtml([{ id: '1', title: '기존' }]) });
    await bootstrap(web);
    web.set(LIST_A, {
      body: listHtml([
        { id: '4', title: '가장 최근' },
        { id: '3', title: '중간' },
        { id: '2', title: '가장 오래됨' },
        { id: '1', title: '기존' },
      ]),
    });
    await cron(web, [sourceA], { config: testConfig({ MATTERMOST_WEBHOOK_URL: '' }) });
    const { rows } = await pool.query(
      `SELECT i.external_key FROM notifications n JOIN source_items i ON i.id = n.source_item_id ORDER BY n.created_at, n.id`,
    );
    expect(rows.map((row) => row.external_key)).toEqual(['2', '3', '4']);
  });

  it('다른 소스에서 정규화 URL이 같은 공고는 알림을 만들지 않는다', async () => {
    const shared = 'https://shared.test/contest/77';
    const sourceC = testSource('src-c', 'c.test', { allowedHosts: ['c.test', 'shared.test'] });
    const sourceD = testSource('src-d', 'd.test', { allowedHosts: ['d.test', 'shared.test'] });
    const web = new FakeWeb()
      .set('https://c.test/list', { body: listHtml([{ id: 'x', title: '기존' }]) })
      .set('https://d.test/list', { body: listHtml([{ id: 'y', title: '기존' }]) });
    await bootstrap(web, [sourceC, sourceD]);
    web
      .set('https://c.test/list', { body: listHtml([{ id: 'c77', title: '같은 대회', href: `${shared}?utm_campaign=c` }]) })
      .set('https://d.test/list', { body: listHtml([{ id: 'd77', title: '같은 대회(다른 제목)', href: `${shared}#apply` }]) });
    const result = await cron(web, [sourceC, sourceD]);
    expect(result.totals).toMatchObject({ newItems: 1, duplicateUrl: 1, notificationsCreated: 2 });
    expect(await countRows(pool, 'notifications')).toBe(2);
    const { rows } = await pool.query(`SELECT DISTINCT normalized_url FROM source_items WHERE external_key IN ('c77','d77')`);
    expect(rows).toEqual([{ normalized_url: shared }]);
  });

  it('제목이 비었거나 허용 호스트가 아닌 링크는 저장하지 않고 개수를 기록한다', async () => {
    const web = new FakeWeb().set(LIST_A, { body: listHtml([{ id: '1', title: '기존' }]) });
    await bootstrap(web);
    web.set(LIST_A, {
      body: listHtml([
        { id: '5', title: '   ' },
        { id: '6', title: '외부 링크', href: 'https://phishing.test/x' },
        { id: '7', title: '정상 행사' },
      ]),
    });
    const result = await cron(web);
    expect(result.sources[0]).toMatchObject({ invalid: 2, newItems: 1 });
    const { rows } = await pool.query(`SELECT counts FROM job_runs WHERE mode = 'cron'`);
    expect(rows[0].counts.sources['src-a'].invalid).toBe(2);
    expect(await countRows(pool, 'source_items')).toBe(2);
  });
});

describe('수집 실패', () => {
  it('선택자 고장·빈 목록·404·네트워크 오류가 기존 항목을 지우지 않는다', async () => {
    const web = new FakeWeb().set(LIST_A, { body: listHtml([{ id: '1', title: '기존 A' }, { id: '2', title: '기존 B' }]) });
    await bootstrap(web);
    const before = await pool.query('SELECT id, last_seen_at FROM source_items ORDER BY id');
    const failures = [
      { body: '<html><body><div class="redesigned"></div></body></html>' },
      { body: '<html><body><ul id="events"></ul></body></html>' },
      { status: 404 },
      { error: new FetchError('network', '연결 실패') },
    ];
    for (const failure of failures) {
      web.set(LIST_A, failure);
      const result = await cron(web);
      expect(result.status).toBe('failed');
      expect(result.sources[0]?.status).toBe('error');
    }
    const after = await pool.query('SELECT id, last_seen_at FROM source_items ORDER BY id');
    expect(after.rows).toEqual(before.rows);
    const state = await pool.query(`SELECT last_error FROM source_state WHERE source_id = 'src-a'`);
    expect(state.rows[0].last_error).toContain('fetch_error');
    const runs = await pool.query(`SELECT counts FROM job_runs WHERE mode = 'cron' ORDER BY started_at`);
    expect(runs.rows.map((row) => row.counts.sources['src-a'].error.kind)).toEqual([
      'parser_error',
      'parser_error',
      'http_error',
      'fetch_error',
    ]);
  });

  it('일부 소스만 실패하면 partial, 전부 실패하면 failed로 기록한다', async () => {
    const web = new FakeWeb()
      .set(LIST_A, { body: listHtml([{ id: '1', title: 'A' }]) })
      .set(LIST_B, { body: listHtml([{ id: '1', title: 'B' }]) });
    await bootstrap(web, [sourceA, sourceB]);
    web.set(LIST_B, { status: 500 });
    expect((await cron(web, [sourceA, sourceB])).status).toBe('partial');
    web.set(LIST_A, { status: 500 });
    expect((await cron(web, [sourceA, sourceB])).status).toBe('failed');
  });
});

describe('키워드 필터', () => {
  it('키워드 없는 제목은 저장하지 않고, 키워드를 늘리면 다음 실행에서 그 공고를 알린다', async () => {
    const narrow = testSource('src-k', 'k.test', { keywords: ['해커톤'] });
    const web = new FakeWeb().set('https://k.test/list', { body: listHtml([{ id: '1', title: '기존 해커톤' }]), etag: '"v1"' });
    await bootstrap(web, [narrow]);
    web.set('https://k.test/list', {
      body: listHtml([
        { id: '3', title: 'Cloud Native 컨퍼런스' },
        { id: '2', title: '여름 사진 공모전' },
        { id: '1', title: '기존 해커톤' },
      ]),
      etag: '"v2"',
    });
    const first = await cron(web, [narrow]);
    expect(first.sources[0]).toMatchObject({ keywordFiltered: 2, newItems: 0, known: 1 });
    expect(await countRows(pool, 'source_items')).toBe(1);

    const unchanged = await cron(web, [narrow]);
    expect(unchanged.sources[0]?.status).toBe('not_modified');

    const widened = { ...narrow, keywords: ['해커톤', '컨퍼런스'] };
    const second = await cron(web, [widened]);
    expect(second.sources[0]).toMatchObject({ status: 'ok', keywordFiltered: 1, newItems: 1, notificationsCreated: 2 });
    const { rows } = await pool.query(
      `SELECT i.title FROM notifications n JOIN source_items i ON i.id = n.source_item_id`,
    );
    expect(new Set(rows.map((row) => row.title))).toEqual(new Set(['Cloud Native 컨퍼런스']));
  });

  it('대소문자를 구분하지 않는다', async () => {
    const source = testSource('src-case', 'case.test', { keywords: ['AI'] });
    const web = new FakeWeb().set('https://case.test/list', { body: listHtml([{ id: '0', title: '기존 ai' }]) });
    await bootstrap(web, [source]);
    web.set('https://case.test/list', { body: listHtml([{ id: '1', title: 'Gen ai 챌린지' }, { id: '0', title: '기존 ai' }]) });
    const result = await cron(web, [source]);
    expect(result.sources[0]).toMatchObject({ newItems: 1, keywordFiltered: 0 });
  });
});

describe('dry-run', () => {
  it('DB 상태를 바꾸지 않고 잠금·실행 기록·알림을 만들지 않는다', async () => {
    const web = new FakeWeb().set(LIST_A, { body: listHtml([{ id: '1', title: '기존' }]) });
    await bootstrap(web);
    web.set(LIST_A, { body: listHtml([{ id: '2', title: '새 행사' }, { id: '1', title: '기존' }]) });
    const before = await snapshotTables(pool);
    const result = await runSync(deps(web), { mode: 'cli', dryRun: true, sources: [sourceA] });
    expect(result.dryRun).toBe(true);
    expect(result.runId).toBeNull();
    expect(result.totals).toMatchObject({ newItems: 1, known: 1, notificationsCreated: 2 });
    expect(result.sources[0]?.preview.find((entry) => entry.outcome === 'new')?.title).toBe('새 행사');
    expect(await snapshotTables(pool)).toEqual(before);
  });

  it('DB 없이도 실행되고, 다른 실행이 잠금을 잡고 있어도 막히지 않는다', async () => {
    await tryAcquireLock(pool, 'sync', randomUUID(), 60_000);
    const web = new FakeWeb().set(LIST_A, { body: listHtml([{ id: '1', title: '행사' }]) });
    const withoutDb = await runSync(deps(web, { pool: null }), { mode: 'cli', dryRun: true, sources: [sourceA] });
    expect(withoutDb).toMatchObject({ dbCompared: false, totals: { newItems: 1 } });
    const withLock = await runSync(deps(web), { mode: 'cli', dryRun: true, sources: [sourceA] });
    expect(withLock.status).toBe('success');
    expect(await countRows(pool, 'job_runs')).toBe(0);
  });
});

describe('잠금과 작업 시간', () => {
  it('다른 실행이 잠금을 잡고 있으면 skipped 실행 기록만 남긴다', async () => {
    await tryAcquireLock(pool, 'sync', randomUUID(), 60_000);
    const web = new FakeWeb().set(LIST_A, { body: listHtml([{ id: '1', title: '행사' }]) });
    const result = await bootstrap(web);
    expect(result.status).toBe('skipped');
    expect(web.requests).toHaveLength(0);
    expect(await countRows(pool, 'source_items')).toBe(0);
    const { rows } = await pool.query('SELECT status, finished_at FROM job_runs');
    expect(rows[0].status).toBe('skipped');
  });

  it('실행이 끝나면 잠금을 해제한다', async () => {
    const web = new FakeWeb().set(LIST_A, { body: listHtml([{ id: '1', title: '행사' }]) });
    await bootstrap(web);
    expect(await countRows(pool, 'job_locks')).toBe(0);
  });

  it('작업 시간이 남지 않으면 소스를 건너뛰고 partial이 아닌 failed로 남긴다', async () => {
    const web = new FakeWeb().set(LIST_A, { body: listHtml([{ id: '1', title: '행사' }]) });
    await bootstrap(web);
    let clock = 0;
    const result = await runSync(
      deps(web, {
        now: () => {
          clock += 100_000;
          return clock;
        },
      }),
      { mode: 'cron', sources: [sourceA] },
    );
    expect(result.sources[0]?.status).toBe('skipped_budget');
    expect(result.status).toBe('failed');
    expect(await countRows(pool, 'job_locks')).toBe(0);
  });
});
