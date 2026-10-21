import type { CommandHandler } from '../cli.js';
import { runSourcesCheck } from './sources-check.js';

export const runCommand: CommandHandler = async (command, context) => {
  switch (command.name) {
    case 'sources:check':
      return runSourcesCheck(command.sourceIds, context.print);
    default:
      throw new Error(`${command.name} 명령은 아직 구현되지 않았습니다`);
  }
};
