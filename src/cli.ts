import { existsSync } from 'node:fs';
import { pathToFileURL } from 'node:url';
import { parseArgs, type ParseArgsOptionsConfig } from 'node:util';
import { ConfigError, DESTINATION_IDS, loadConfig, secretValues, type AppConfig, type DestinationId } from './config.js';
import { createLogger, errorMessage, redact, type Logger } from './log.js';

export type CliCommand =
  | { name: 'sync'; dryRun: boolean; bootstrap: boolean; sourceIds: string[] }
  | { name: 'sources:check'; sourceIds: string[] }
  | { name: 'notifications:flush' }
  | { name: 'notifications:resolve'; id: string; action: 'retry' | 'sent' }
  | { name: 'notifications:test'; destination: DestinationId };

export class UsageError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'UsageError';
  }
}

export const USAGE = `사용법 (모든 명령에 --env-path <파일>을 붙이면 .env 대신 그 파일만 읽습니다):
  npm run sync -- [--dry-run] [--bootstrap] [--source <id>]
  npm run sources:check -- [--source <id>]
  npm run notifications:flush
  npm run notifications:resolve -- --id <알림 ID> --action retry|sent
  npm run notifications:test -- --destination ${DESTINATION_IDS.join('|')}`;

function parseOptions(args: string[], options: ParseArgsOptionsConfig) {
  try {
    return parseArgs({ args, options, strict: true, allowPositionals: false }).values;
  } catch (error) {
    throw new UsageError(errorMessage(error));
  }
}

export function parseCliArgs(argv: string[]): CliCommand {
  const [name, ...rest] = argv;
  switch (name) {
    case 'sync': {
      const values = parseOptions(rest, {
        'dry-run': { type: 'boolean', default: false },
        bootstrap: { type: 'boolean', default: false },
        source: { type: 'string', multiple: true },
      });
      return {
        name,
        dryRun: values['dry-run'] === true,
        bootstrap: values.bootstrap === true,
        sourceIds: (values.source as string[] | undefined) ?? [],
      };
    }
    case 'sources:check': {
      const values = parseOptions(rest, { source: { type: 'string', multiple: true } });
      return { name, sourceIds: (values.source as string[] | undefined) ?? [] };
    }
    case 'notifications:flush':
      parseOptions(rest, {});
      return { name };
    case 'notifications:resolve': {
      const values = parseOptions(rest, { id: { type: 'string' }, action: { type: 'string' } });
      const id = values.id;
      const action = values.action;
      if (typeof id !== 'string' || id.trim() === '') throw new UsageError('--id <알림 ID>가 필요합니다');
      if (action !== 'retry' && action !== 'sent') throw new UsageError('--action은 retry 또는 sent여야 합니다');
      return { name, id: id.trim(), action };
    }
    case 'notifications:test': {
      const values = parseOptions(rest, { destination: { type: 'string' } });
      const destination = values.destination;
      if (!DESTINATION_IDS.includes(destination as DestinationId)) {
        throw new UsageError(`--destination은 ${DESTINATION_IDS.join(', ')} 중 하나여야 합니다`);
      }
      return { name, destination: destination as DestinationId };
    }
    default:
      throw new UsageError(name ? `알 수 없는 명령입니다: ${name}` : '명령이 필요합니다');
  }
}

export interface CliContext {
  config: AppConfig;
  logger: Logger;
  print: (line: string) => void;
}

export type CommandHandler = (command: CliCommand, context: CliContext) => Promise<number>;

export function extractEnvFile(argv: string[]): { envFile: string | null; rest: string[] } {
  const rest: string[] = [];
  let envFile: string | null = null;
  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index] as string;
    if (arg === '--env-path') {
      const value = argv[index + 1];
      if (value === undefined || value.startsWith('--')) throw new UsageError('--env-path 다음에 파일 경로가 필요합니다');
      envFile = value;
      index += 1;
    } else if (arg.startsWith('--env-path=')) {
      envFile = arg.slice('--env-path='.length);
    } else {
      rest.push(arg);
    }
  }
  return { envFile, rest };
}

export function loadEnvironment(envFile: string | null): void {
  if (envFile !== null) {
    if (!existsSync(envFile)) throw new UsageError(`환경 변수 파일이 없습니다: ${envFile}`);
    process.loadEnvFile(envFile);
    return;
  }
  if (existsSync('.env')) process.loadEnvFile('.env');
}

export async function main(argv: string[], handler?: CommandHandler): Promise<number> {
  let command: CliCommand;
  let envFile: string | null;
  try {
    const extracted = extractEnvFile(argv);
    envFile = extracted.envFile;
    command = parseCliArgs(extracted.rest);
    loadEnvironment(envFile);
  } catch (error) {
    if (error instanceof UsageError) {
      process.stderr.write(`${error.message}\n\n${USAGE}\n`);
      return 2;
    }
    throw error;
  }
  let config: AppConfig;
  try {
    config = loadConfig(process.env);
  } catch (error) {
    if (error instanceof ConfigError) {
      process.stderr.write(`${error.message}\n`);
      return 1;
    }
    throw error;
  }
  const secrets = secretValues(config);
  const logger = createLogger({ level: config.logLevel, secrets });
  const print = (line: string) => process.stdout.write(`${redact(line, secrets)}\n`);
  try {
    const run = handler ?? (await import('./commands/index.js')).runCommand;
    return await run(command, { config, logger, print });
  } catch (error) {
    logger.error('명령 실행 실패', { command: command.name, error: errorMessage(error) });
    return 1;
  }
}

const invokedDirectly = process.argv[1] !== undefined && import.meta.url === pathToFileURL(process.argv[1]).href;

if (invokedDirectly) {
  main(process.argv.slice(2)).then((code) => {
    process.exitCode = code;
  });
}
