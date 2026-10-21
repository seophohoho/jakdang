import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest';
import { createDiscordNotifier, discordSendUrl } from '../../src/notifications/discord.js';
import { createMattermostNotifier } from '../../src/notifications/mattermost.js';
import { parseRetryAfterMs } from '../../src/notifications/webhook.js';
import { closedPortUrl, MockWebhookServer } from '../support/mock-webhook.js';

const server = new MockWebhookServer();
const DISCORD_PATH = '/api/webhooks/123/very-secret-token';
const MATTERMOST_PATH = '/hooks/mm-secret-token';
const payload = { content: '[신규] 테스트', allowed_mentions: { parse: [] } };

beforeAll(async () => {
  await server.start();
});

afterAll(async () => {
  await server.stop();
});

beforeEach(() => {
  server.reset();
});

const discord = () => createDiscordNotifier(server.url(DISCORD_PATH));
const mattermost = () => createMattermostNotifier(server.url(MATTERMOST_PATH));

describe('Discord Webhook', () => {
  it('wait=true로 보내고 성공 응답의 메시지 ID를 돌려준다', async () => {
    server.enqueue({ status: 200, body: '{"id":"1234567890","content":"x"}' });
    const outcome = await discord().send(payload);
    expect(outcome).toEqual({ kind: 'sent', remoteMessageId: '1234567890' });
    expect(server.received[0]).toMatchObject({ method: 'POST', path: DISCORD_PATH, body: payload });
    expect(server.received[0]?.query.get('wait')).toBe('true');
    expect(discordSendUrl('https://discord.com/api/webhooks/1/t?thread_id=9')).toBe(
      'https://discord.com/api/webhooks/1/t?thread_id=9&wait=true',
    );
  });

  it('429는 retry_after(초)와 Retry-After 헤더 중 큰 값을 쓴다', async () => {
    server.enqueue({ status: 429, body: '{"message":"You are being rate limited.","retry_after":2.5,"global":false}', headers: { 'retry-after': '1' } });
    expect(await discord().send(payload)).toMatchObject({ kind: 'rate_limited', retryAfterMs: 2_500 });
  });

  it('5xx는 server_error, 400/401/403/404는 rejected로 구분한다', async () => {
    server.enqueue({ status: 502, body: 'bad gateway' });
    expect(await discord().send(payload)).toMatchObject({ kind: 'server_error', status: 502 });
    for (const status of [400, 401, 403, 404]) {
      server.enqueue({ status, body: '{"message":"Unknown Webhook","code":10015}' });
      expect(await discord().send(payload)).toMatchObject({ kind: 'rejected', status });
    }
  });

  it('응답 전에 연결이 끊기거나 시간이 초과되면 uncertain이다', async () => {
    server.enqueue({ drop: true });
    expect((await discord().send(payload)).kind).toBe('uncertain');
    server.enqueue({ hang: true });
    expect(await discord().send(payload, { timeoutMs: 100 })).toMatchObject({ kind: 'uncertain' });
  });

  it('연결 자체가 거부되면 보내지 않은 것으로 본다', async () => {
    const notifier = createDiscordNotifier(await closedPortUrl(DISCORD_PATH));
    expect((await notifier.send(payload)).kind).toBe('not_sent');
  });

  it('오류 설명에 Webhook URL·토큰을 싣지 않는다', async () => {
    server.enqueue({ status: 404, body: `{"message":"no webhook at ${server.url(DISCORD_PATH)}"}` });
    const outcome = await discord().send(payload);
    expect(JSON.stringify(outcome)).not.toContain('very-secret-token');
  });
});

describe('Mattermost Webhook', () => {
  it('text payload를 보내고 200 ok를 성공으로 본다', async () => {
    server.enqueue({ status: 200, body: 'ok', headers: { 'content-type': 'text/plain' } });
    expect(await mattermost().send({ text: 'hello' })).toEqual({ kind: 'sent', remoteMessageId: null });
    expect(server.received[0]).toMatchObject({ path: MATTERMOST_PATH, body: { text: 'hello' } });
  });

  it('429·5xx·잘못된 Webhook을 구분한다', async () => {
    server.enqueue(
      { status: 429, headers: { 'retry-after': '3' } },
      { status: 503 },
      { status: 400, body: '{"id":"web.incoming_webhook.disabled.app_error"}' },
    );
    expect(await mattermost().send({ text: 'a' })).toMatchObject({ kind: 'rate_limited', retryAfterMs: 3_000 });
    expect(await mattermost().send({ text: 'a' })).toMatchObject({ kind: 'server_error', status: 503 });
    expect(await mattermost().send({ text: 'a' })).toMatchObject({ kind: 'rejected', status: 400 });
  });

  it('리디렉션 응답은 따라가지 않고 rejected로 둔다', async () => {
    server.enqueue({ status: 302, headers: { location: 'https://elsewhere.example/' } });
    expect(await mattermost().send({ text: 'a' })).toMatchObject({ kind: 'rejected', status: 302 });
    expect(server.received).toHaveLength(1);
  });
});

describe('parseRetryAfterMs', () => {
  it('초 단위와 HTTP 날짜를 해석한다', () => {
    expect(parseRetryAfterMs('1.2')).toBe(1_200);
    expect(parseRetryAfterMs('Thu, 22 Oct 2026 00:00:10 GMT', Date.parse('Thu, 22 Oct 2026 00:00:00 GMT'))).toBe(10_000);
    expect(parseRetryAfterMs(null)).toBeNull();
    expect(parseRetryAfterMs('soon')).toBeNull();
  });
});
