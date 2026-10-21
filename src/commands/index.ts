import type { CommandHandler } from '../cli.js';
import { runSourcesCheck } from './sources-check.js';
import { runSyncCommand } from './sync.js';

export const runCommand: CommandHandler = async (command, context) => {
  switch (command.name) {
    case 'sources:check':
      return runSourcesCheck(command.sourceIds, context.print);
    case 'sync':
      return runSyncCommand(command, context);
    default:
      throw new Error(`${command.name} 명령은 아직 구현되지 않았습니다`);
  }
};
