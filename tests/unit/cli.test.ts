import { describe, expect, it } from 'vitest';
import { parseCliArgs, UsageError } from '../../src/cli.js';

describe('parseCliArgs', () => {
  it('sync 옵션을 해석한다', () => {
    expect(parseCliArgs(['sync'])).toEqual({ name: 'sync', dryRun: false, bootstrap: false, sourceIds: [] });
    expect(parseCliArgs(['sync', '--dry-run'])).toMatchObject({ dryRun: true, bootstrap: false });
    expect(parseCliArgs(['sync', '--bootstrap', '--source', 'a', '--source', 'b'])).toEqual({
      name: 'sync',
      dryRun: false,
      bootstrap: true,
      sourceIds: ['a', 'b'],
    });
  });

  it('notifications:resolve는 id와 action을 요구한다', () => {
    expect(parseCliArgs(['notifications:resolve', '--id', 'abc', '--action', 'retry'])).toEqual({
      name: 'notifications:resolve',
      id: 'abc',
      action: 'retry',
    });
    expect(() => parseCliArgs(['notifications:resolve', '--id', 'abc'])).toThrow(UsageError);
    expect(() => parseCliArgs(['notifications:resolve', '--id', 'abc', '--action', 'delete'])).toThrow(UsageError);
    expect(() => parseCliArgs(['notifications:resolve', '--action', 'sent'])).toThrow(UsageError);
  });

  it('notifications:test는 알려진 채널 별칭만 받는다', () => {
    expect(parseCliArgs(['notifications:test', '--destination', 'discord-main'])).toEqual({
      name: 'notifications:test',
      destination: 'discord-main',
    });
    expect(() => parseCliArgs(['notifications:test', '--destination', 'https://discord.com/api/webhooks/1/x'])).toThrow(
      UsageError,
    );
  });

  it('모르는 명령과 옵션을 거부한다', () => {
    expect(() => parseCliArgs([])).toThrow(UsageError);
    expect(() => parseCliArgs(['deploy'])).toThrow(UsageError);
    expect(() => parseCliArgs(['sync', '--force'])).toThrow(UsageError);
    expect(() => parseCliArgs(['notifications:flush', '--all'])).toThrow(UsageError);
  });
});
