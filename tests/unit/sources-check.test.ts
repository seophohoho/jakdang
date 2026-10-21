import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import type { Fetcher } from '../../src/collectors/fetch.js';
import { runSourcesCheck } from '../../src/commands/sources-check.js';

const fixture = (path: string) => readFileSync(new URL(`../fixtures/${path}`, import.meta.url), 'utf8');

function fixtureFetcher(map: (url: URL) => string | number): Fetcher {
  return {
    async get(request) {
      const result = map(new URL(request.url));
      const status = typeof result === 'number' ? result : 200;
      return { status, url: request.url, body: typeof result === 'string' ? result : '', etag: null, lastModified: null, contentType: 'text/html' };
    },
  };
}

const healthy = (url: URL) => {
  if (url.hostname === 'dacon.io') return fixture('sources/dacon-competitions.html');
  if (url.hostname === 'www.oss.kr') return fixture('sources/oss-notice-page1.html');
  return fixture(url.searchParams.get('gp') === '2' ? 'sources/wevity-it-page2.html' : 'sources/wevity-it-page1.html');
};

describe('sources:check', () => {
  it('세 소스가 모두 파싱되면 0으로 끝난다', async () => {
    const lines: string[] = [];
    const code = await runSourcesCheck([], (line) => lines.push(line), fixtureFetcher(healthy));
    expect(code).toBe(0);
    expect(lines.join('\n')).toContain('소스 3개 중 3개 정상, 0개 실패');
  });

  it('한 소스라도 404·선택자 고장이면 1로 끝나고 오류 종류를 보여 준다', async () => {
    const lines: string[] = [];
    const broken = (url: URL) => (url.hostname === 'dacon.io' ? 404 : url.hostname === 'www.oss.kr' ? fixture('synthetic/wevity-no-container.html') : healthy(url));
    const code = await runSourcesCheck([], (line) => lines.push(line), fixtureFetcher(broken));
    expect(code).toBe(1);
    const output = lines.join('\n');
    expect(output).toContain('http_error');
    expect(output).toContain('parser_error');
  });
});
