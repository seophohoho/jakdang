import type { LogLevel } from './config.js';

const LEVEL_RANK: Record<LogLevel, number> = { debug: 10, info: 20, warn: 30, error: 40 };

export const REDACTED = '[비밀 마스킹]';

const SECRET_PATTERNS: RegExp[] = [
  /https?:\/\/[^\s"'<>]*\/api\/webhooks\/[^\s"'<>]+/gi,
  /https?:\/\/[^\s"'<>]*\/hooks\/[^\s"'<>]+/gi,
  /postgres(?:ql)?:\/\/[^\s"'<>]+/gi,
  /Bearer\s+[A-Za-z0-9._~+/=-]+/g,
];

export function redact(text: string, secrets: readonly string[] = []): string {
  let result = text;
  for (const secret of secrets) {
    if (secret.length >= 4) result = result.split(secret).join(REDACTED);
  }
  for (const pattern of SECRET_PATTERNS) result = result.replace(pattern, REDACTED);
  return result;
}

export type LogFields = Record<string, unknown>;

export interface Logger {
  debug(message: string, fields?: LogFields): void;
  info(message: string, fields?: LogFields): void;
  warn(message: string, fields?: LogFields): void;
  error(message: string, fields?: LogFields): void;
}

export interface LoggerOptions {
  level?: LogLevel;
  secrets?: readonly string[];
  write?: (line: string) => void;
  now?: () => Date;
}

export function createLogger(options: LoggerOptions = {}): Logger {
  const threshold = LEVEL_RANK[options.level ?? 'info'];
  const secrets = options.secrets ?? [];
  const write = options.write ?? ((line: string) => process.stderr.write(`${line}\n`));
  const now = options.now ?? (() => new Date());
  const emit = (level: LogLevel, message: string, fields?: LogFields) => {
    if (LEVEL_RANK[level] < threshold) return;
    const record = { time: now().toISOString(), level, msg: message, ...fields };
    write(redact(JSON.stringify(record, errorReplacer), secrets));
  };
  return {
    debug: (message, fields) => emit('debug', message, fields),
    info: (message, fields) => emit('info', message, fields),
    warn: (message, fields) => emit('warn', message, fields),
    error: (message, fields) => emit('error', message, fields),
  };
}

function errorReplacer(_key: string, value: unknown): unknown {
  if (value instanceof Error) return { name: value.name, message: value.message };
  return value;
}

export function errorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  return String(error);
}

export const silentLogger: Logger = {
  debug: () => {},
  info: () => {},
  warn: () => {},
  error: () => {},
};
