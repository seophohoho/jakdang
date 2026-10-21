import { z } from 'zod';

export const LOG_LEVELS = ['debug', 'info', 'warn', 'error'] as const;
export type LogLevel = (typeof LOG_LEVELS)[number];

export const DESTINATION_IDS = ['discord-main', 'mattermost-main'] as const;
export type DestinationId = (typeof DESTINATION_IDS)[number];

export const MIN_CRON_SECRET_LENGTH = 32;

export type DeployEnv = 'production' | 'preview' | 'development' | 'local';

export interface AppConfig {
  databaseUrl: string | undefined;
  cronSecret: string | undefined;
  notificationsFlag: boolean;
  notificationsEnabled: boolean;
  webhooks: Partial<Record<DestinationId, string>>;
  maxNotificationsPerRun: number;
  runBudgetMs: number;
  logLevel: LogLevel;
  deployEnv: DeployEnv;
}

export class ConfigError extends Error {
  constructor(public readonly issues: string[]) {
    super(`환경 변수 설정 오류: ${issues.join('; ')}`);
    this.name = 'ConfigError';
  }
}

const blankToUndefined = (value: unknown) =>
  typeof value === 'string' && value.trim() === '' ? undefined : value;

const optionalString = <T extends z.ZodType>(schema: T) => z.preprocess(blankToUndefined, schema.optional());

const booleanString = z.preprocess(
  (value) => {
    const blank = blankToUndefined(value);
    return typeof blank === 'string' ? blank.trim().toLowerCase() : blank;
  },
  z.enum(['true', 'false'], { error: 'true 또는 false 문자열만 허용합니다' }).default('false'),
);

const intString = (min: number, max: number, fallback: number) =>
  z.preprocess(
    blankToUndefined,
    z.coerce
      .number({ error: '정수여야 합니다' })
      .int({ error: '정수여야 합니다' })
      .min(min, { error: `${min} 이상이어야 합니다` })
      .max(max, { error: `${max} 이하여야 합니다` })
      .default(fallback),
  );

const postgresUrl = z
  .string()
  .trim()
  .refine((value) => /^postgres(ql)?:\/\//.test(value), { error: 'postgres:// 또는 postgresql:// 주소여야 합니다' });

const discordWebhookUrl = z
  .string()
  .trim()
  .refine(
    (value) => {
      try {
        const url = new URL(value);
        return (
          url.protocol === 'https:' &&
          ['discord.com', 'discordapp.com', 'canary.discord.com', 'ptb.discord.com'].includes(url.hostname) &&
          url.pathname.startsWith('/api/webhooks/')
        );
      } catch {
        return false;
      }
    },
    { error: 'https://discord.com/api/webhooks/... 형식이어야 합니다' },
  );

const mattermostWebhookUrl = z
  .string()
  .trim()
  .refine(
    (value) => {
      try {
        const url = new URL(value);
        return (url.protocol === 'https:' || url.protocol === 'http:') && url.pathname.includes('/hooks/');
      } catch {
        return false;
      }
    },
    { error: 'http(s)://<서버>/hooks/... 형식이어야 합니다' },
  );

const EnvSchema = z.object({
  DATABASE_URL: optionalString(postgresUrl),
  CRON_SECRET: optionalString(z.string()),
  NOTIFICATIONS_ENABLED: booleanString,
  DISCORD_WEBHOOK_URL: optionalString(discordWebhookUrl),
  MATTERMOST_WEBHOOK_URL: optionalString(mattermostWebhookUrl),
  MAX_NOTIFICATIONS_PER_RUN: intString(0, 100, 10),
  RUN_BUDGET_MS: intString(10_000, 230_000, 210_000),
  LOG_LEVEL: z.preprocess(blankToUndefined, z.enum(LOG_LEVELS).default('info')),
  VERCEL_ENV: optionalString(z.string()),
});

function deployEnvOf(vercelEnv: string | undefined): DeployEnv {
  if (vercelEnv === 'production' || vercelEnv === 'preview' || vercelEnv === 'development') return vercelEnv;
  if (vercelEnv !== undefined) return 'preview';
  return 'local';
}

export function loadConfig(env: NodeJS.ProcessEnv = process.env): AppConfig {
  const parsed = EnvSchema.safeParse(env);
  if (!parsed.success) {
    throw new ConfigError(parsed.error.issues.map((issue) => `${issue.path.join('.')}: ${issue.message}`));
  }
  const data = parsed.data;
  const deployEnv = deployEnvOf(data.VERCEL_ENV);
  const webhooks: Partial<Record<DestinationId, string>> = {};
  if (data.DISCORD_WEBHOOK_URL) webhooks['discord-main'] = data.DISCORD_WEBHOOK_URL;
  if (data.MATTERMOST_WEBHOOK_URL) webhooks['mattermost-main'] = data.MATTERMOST_WEBHOOK_URL;
  const notificationsFlag = data.NOTIFICATIONS_ENABLED === 'true';
  return {
    databaseUrl: data.DATABASE_URL,
    cronSecret: data.CRON_SECRET,
    notificationsFlag,
    notificationsEnabled: notificationsFlag && deployEnv !== 'preview' && deployEnv !== 'development',
    webhooks,
    maxNotificationsPerRun: data.MAX_NOTIFICATIONS_PER_RUN,
    runBudgetMs: data.RUN_BUDGET_MS,
    logLevel: data.LOG_LEVEL,
    deployEnv,
  };
}

export function usableCronSecret(config: Pick<AppConfig, 'cronSecret'>): string | undefined {
  const secret = config.cronSecret;
  if (secret === undefined || secret.length < MIN_CRON_SECRET_LENGTH) return undefined;
  return secret;
}

export function requireDatabaseUrl(config: Pick<AppConfig, 'databaseUrl'>): string {
  if (!config.databaseUrl) throw new ConfigError(['DATABASE_URL: 이 명령에는 DB 연결 주소가 필요합니다']);
  return config.databaseUrl;
}

export function secretValues(config: AppConfig): string[] {
  return [config.databaseUrl, config.cronSecret, ...Object.values(config.webhooks)].filter(
    (value): value is string => typeof value === 'string' && value.length > 0,
  );
}
