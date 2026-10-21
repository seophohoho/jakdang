import { describe, expect, it } from 'vitest';
import { ConfigError, loadConfig, requireDatabaseUrl, usableCronSecret } from '../../src/config.js';

const DISCORD = 'https://discord.com/api/webhooks/123/abc';
const MATTERMOST = 'https://chat.example.com/hooks/xyz';

describe('loadConfig', () => {
  it('외부 키 없이 기본값으로 동작한다', () => {
    const config = loadConfig({});
    expect(config.databaseUrl).toBeUndefined();
    expect(config.notificationsEnabled).toBe(false);
    expect(config.maxNotificationsPerRun).toBe(10);
    expect(config.runBudgetMs).toBe(210_000);
    expect(config.logLevel).toBe('info');
    expect(config.webhooks).toEqual({});
  });

  it('.env.example처럼 빈 문자열은 미설정으로 본다', () => {
    const config = loadConfig({ DATABASE_URL: '', CRON_SECRET: '', DISCORD_WEBHOOK_URL: '  ', NOTIFICATIONS_ENABLED: '' });
    expect(config.databaseUrl).toBeUndefined();
    expect(config.cronSecret).toBeUndefined();
    expect(config.webhooks).toEqual({});
    expect(config.notificationsEnabled).toBe(false);
  });

  it("NOTIFICATIONS_ENABLED='false'를 참으로 바꾸지 않는다", () => {
    expect(loadConfig({ NOTIFICATIONS_ENABLED: 'false' }).notificationsFlag).toBe(false);
    expect(loadConfig({ NOTIFICATIONS_ENABLED: 'FALSE' }).notificationsFlag).toBe(false);
    expect(loadConfig({ NOTIFICATIONS_ENABLED: 'true' }).notificationsFlag).toBe(true);
    expect(loadConfig({ NOTIFICATIONS_ENABLED: ' True ' }).notificationsEnabled).toBe(true);
  });

  it.each(['1', 'yes', 'on', '0', 'no'])('NOTIFICATIONS_ENABLED=%s는 오류로 거부한다', (value) => {
    expect(() => loadConfig({ NOTIFICATIONS_ENABLED: value })).toThrow(ConfigError);
  });

  it('preview·development 배포에서는 플래그가 true여도 알림을 끈다', () => {
    const base = { NOTIFICATIONS_ENABLED: 'true', DISCORD_WEBHOOK_URL: DISCORD };
    expect(loadConfig({ ...base, VERCEL_ENV: 'preview' }).notificationsEnabled).toBe(false);
    expect(loadConfig({ ...base, VERCEL_ENV: 'development' }).notificationsEnabled).toBe(false);
    expect(loadConfig({ ...base, VERCEL_ENV: 'unknown-env' }).notificationsEnabled).toBe(false);
    expect(loadConfig({ ...base, VERCEL_ENV: 'production' }).notificationsEnabled).toBe(true);
  });

  it('Webhook을 안정적인 별칭으로 매핑한다', () => {
    const config = loadConfig({ DISCORD_WEBHOOK_URL: DISCORD, MATTERMOST_WEBHOOK_URL: MATTERMOST });
    expect(config.webhooks).toEqual({ 'discord-main': DISCORD, 'mattermost-main': MATTERMOST });
  });

  it('잘못된 Webhook·DB 주소를 거부하고 오류 메시지에 값을 싣지 않는다', () => {
    const secretish = 'https://evil.example.com/not-a-webhook/secret-token';
    try {
      loadConfig({ DISCORD_WEBHOOK_URL: secretish });
      expect.unreachable();
    } catch (error) {
      expect(error).toBeInstanceOf(ConfigError);
      expect((error as Error).message).not.toContain('secret-token');
    }
    expect(() => loadConfig({ DATABASE_URL: 'mysql://localhost/db' })).toThrow(ConfigError);
  });

  it('숫자 한도를 검증한다', () => {
    expect(loadConfig({ MAX_NOTIFICATIONS_PER_RUN: '3' }).maxNotificationsPerRun).toBe(3);
    expect(() => loadConfig({ MAX_NOTIFICATIONS_PER_RUN: 'abc' })).toThrow(ConfigError);
    expect(() => loadConfig({ RUN_BUDGET_MS: '300000' })).toThrow(ConfigError);
    expect(() => loadConfig({ RUN_BUDGET_MS: '1.5' })).toThrow(ConfigError);
  });
});

describe('usableCronSecret', () => {
  it('없거나 짧은 비밀은 쓸 수 없는 값으로 본다', () => {
    expect(usableCronSecret({ cronSecret: undefined })).toBeUndefined();
    expect(usableCronSecret({ cronSecret: 'short' })).toBeUndefined();
    const long = 'x'.repeat(32);
    expect(usableCronSecret({ cronSecret: long })).toBe(long);
  });
});

describe('requireDatabaseUrl', () => {
  it('DB 주소가 없으면 명확한 오류를 낸다', () => {
    expect(() => requireDatabaseUrl({ databaseUrl: undefined })).toThrow(/DATABASE_URL/);
  });
});
