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

export const USAGE = `사용법:
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

function loadDotEnv(path = '.env') {
  if (existsSync(path)) process.loadEnvFile(path);
}

export async function main(argv: string[], handler?: CommandHandler): Promise<number> {
  let command: CliCommand;
  try {
    command = parseCliArgs(argv);
  } catch (error) {
    if (error instanceof UsageError) {
      process.stderr.write(`${error.message}\n\n${USAGE}\n`);
      return 2;
    }
    throw error;
  }
  loadDotEnv();
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
