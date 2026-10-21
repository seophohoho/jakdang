import type { CommandHandler } from '../cli.js';
import { runFlush, runResolve, runTestMessage } from './notifications.js';
import { runSourcesCheck } from './sources-check.js';
import { runSyncCommand } from './sync.js';

export const runCommand: CommandHandler = async (command, context) => {
  switch (command.name) {
    case 'sources:check':
      return runSourcesCheck(command.sourceIds, context.print);
    case 'sync':
      return runSyncCommand(command, context);
    case 'notifications:flush':
      return runFlush(context);
    case 'notifications:resolve':
      return runResolve(command, context);
    case 'notifications:test':
      return runTestMessage(command, context);
  }
};
