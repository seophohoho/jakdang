import type { FetchedPage, Fetcher, FetchRequest } from '../../src/collectors/fetch.js';
import type { SourceConfig } from '../../src/collectors/types.js';
import { loadConfig, type AppConfig } from '../../src/config.js';
import type { Logger } from '../../src/log.js';

export interface ListEntry {
  id: string;
  title: string;
  href?: string;
}

export function listHtml(entries: ListEntry[]): string {
  const items = entries
    .map((entry) => `<li data-id="${entry.id}"><a href="${entry.href ?? `/events/${entry.id}?utm_source=list`}">${entry.title}</a></li>`)
    .join('\n');
  return `<!doctype html><html><body><ul id="events">\n${items}\n</ul></body></html>`;
}

export function testSource(id: string, host: string, overrides: Partial<SourceConfig> = {}): SourceConfig {
  return {
    id,
    name: `테스트 소스 ${id}`,
    kind: 'html',
    listUrl: `https://${host}/list`,
    allowedHosts: [host],
    authority: 'community',
    selectors: { container: 'ul#events', item: 'li', title: 'a', link: 'a', idAttr: 'data-id' },
    parserVersion: 1,
    enabled: true,
    pagination: { runPages: 1, maxPages: 1 },
    adapter: 'generic',
    ...overrides,
  };
}

export interface FakeSite {
  status?: number;
  body?: string;
  etag?: string | null;
  error?: Error;
}

export class FakeWeb implements Fetcher {
  readonly requests: FetchRequest[] = [];
  private readonly sites = new Map<string, FakeSite>();

  set(url: string, site: FakeSite): this {
    this.sites.set(url, site);
    return this;
  }

  async get(request: FetchRequest): Promise<FetchedPage> {
    this.requests.push(request);
    const site = this.sites.get(request.url);
    if (!site) return this.page(request, 404, '');
    if (site.error) throw site.error;
    if (site.etag && request.etag === site.etag) return this.page(request, 304, '', site.etag);
    return this.page(request, site.status ?? 200, site.body ?? '', site.etag ?? null);
  }

  private page(request: FetchRequest, status: number, body: string, etag: string | null = null): FetchedPage {
    return { status, url: request.url, body, etag, lastModified: null, contentType: 'text/html' };
  }
}

export function testConfig(overrides: Record<string, string> = {}): AppConfig {
  return loadConfig({
    DISCORD_WEBHOOK_URL: 'https://discord.com/api/webhooks/1/test-token',
    MATTERMOST_WEBHOOK_URL: 'https://chat.example.com/hooks/test-token',
    NOTIFICATIONS_ENABLED: 'false',
    ...overrides,
  });
}

export function memoryLogger(): Logger & { lines: Array<{ level: string; message: string; fields?: unknown }> } {
  const lines: Array<{ level: string; message: string; fields?: unknown }> = [];
  const push = (level: string) => (message: string, fields?: unknown) => lines.push({ level, message, fields });
  return { lines, debug: push('debug'), info: push('info'), warn: push('warn'), error: push('error') };
}
