import type { CliCommand, CliContext } from '../cli.js';
import { requireDatabaseUrl, secretValues } from '../config.js';
import { deliverDue, backlogStatus, recoverExpiredClaims } from '../core/deliver.js';
import { createPool } from '../db/client.js';
import { listAttentionNotifications, resolveNotification } from '../db/repository.js';
import { buildTestPayload } from '../notifications/format.js';
import { createNotifiers } from '../notifications/index.js';
import type { Notifier, WebhookTransport } from '../notifications/webhook.js';
import type { DestinationId } from '../config.js';

export interface NotificationCommandDeps {
  transport?: WebhookTransport;
  now?: () => Date;
}

const FLUSH_BUDGET_MS = 10 * 60_000;

export async function runFlush(context: CliContext, deps: NotificationCommandDeps = {}): Promise<number> {
  const { config, print, logger } = context;
  if (!config.notificationsEnabled) {
    print('NOTIFICATIONS_ENABLED가 false라 보내지 않습니다. (preview·development 배포에서는 항상 꺼집니다)');
    return 1;
  }
  const notifiers = createNotifiers(config, deps.transport);
  if (notifiers.size === 0) {
    print('설정된 Webhook이 없습니다. DISCORD_WEBHOOK_URL 또는 MATTERMOST_WEBHOOK_URL을 확인하세요.');
    return 1;
  }
  const pool = createPool(requireDatabaseUrl(config), { applicationName: 'jakdang-flush' });
  try {
    const recovered = await recoverExpiredClaims(pool);
    const deadline = Date.now() + FLUSH_BUDGET_MS;
    const summary = await deliverDue({
      pool,
      notifiers,
      enabled: true,
      limit: config.maxNotificationsPerRun,
      remainingMs: () => deadline - Date.now(),
      logger,
      secrets: secretValues(config),
      includeScheduled: true,
    });
    const backlog = await backlogStatus(pool, config.maxNotificationsPerRun);
    print(
      `발송 시도 ${summary.attempted}건: 성공 ${summary.sent}, 재시도 예약 ${summary.retryScheduled}, 실패 ${summary.failed}, 불확실 ${summary.uncertain}` +
        (recovered > 0 ? ` (끊긴 전송 ${recovered}건을 uncertain으로 복구)` : ''),
    );
    print(`남은 pending ${backlog.pending}건, uncertain ${backlog.uncertain}건, failed ${backlog.failed}건`);
    const attention = await listAttentionNotifications(pool);
    if (attention.length > 0) {
      print('확인이 필요한 알림 (notifications:resolve -- --id <알림 ID> --action retry|sent):');
      for (const entry of attention) {
        print(`  ${entry.id} [${entry.status}] ${entry.destinationId} 참조 ${entry.itemRef} "${entry.title}" — ${entry.lastError ?? ''}`);
      }
    }
    return summary.failed + summary.uncertain === 0 ? 0 : 1;
  } finally {
    await pool.end();
  }
}

export async function runResolve(
  command: Extract<CliCommand, { name: 'notifications:resolve' }>,
  context: CliContext,
): Promise<number> {
  const pool = createPool(requireDatabaseUrl(context.config), { applicationName: 'jakdang-resolve' });
  try {
    const result = await resolveNotification(pool, command.id, command.action);
    switch (result.kind) {
      case 'resolved':
        context.print(
          `${result.notification.id} → ${result.notification.status}` +
            (command.action === 'retry' ? ' (다음 sync 또는 notifications:flush에서 보냅니다)' : ' (전송 완료로 기록)'),
        );
        context.logger.info('알림 수동 처리', { notificationId: result.notification.id, action: command.action });
        return 0;
      case 'ambiguous':
        context.print(`ID 앞부분이 여러 알림과 겹칩니다. 더 길게 입력하세요:\n  ${result.candidates.join('\n  ')}`);
        return 1;
      case 'invalid_status':
        context.print(`현재 상태가 ${result.status}라 처리할 수 없습니다. uncertain 또는 failed만 처리합니다.`);
        return 1;
      case 'not_found':
        context.print('해당 ID의 알림이 없습니다.');
        return 1;
    }
  } finally {
    await pool.end();
  }
}

export async function runTestMessage(
  command: Extract<CliCommand, { name: 'notifications:test' }>,
  context: CliContext,
  deps: NotificationCommandDeps = {},
): Promise<number> {
  const notifiers = createNotifiers(context.config, deps.transport);
  const notifier: Notifier | undefined = notifiers.get(command.destination as DestinationId);
  if (!notifier) {
    context.print(`${command.destination}에 해당하는 Webhook 환경 변수가 없습니다.`);
    return 1;
  }
  if (!context.config.notificationsFlag) {
    context.print('참고: NOTIFICATIONS_ENABLED=false지만 명시적 연결 테스트이므로 1건 보냅니다.');
  }
  const sentAt = (deps.now ?? (() => new Date()))();
  const outcome = await notifier.send(buildTestPayload(command.destination, sentAt));
  context.logger.info('연결 테스트 메시지 결과', { destination: command.destination, outcome });
  if (outcome.kind === 'sent') {
    context.print(`${command.destination}: 전송 성공${outcome.remoteMessageId ? ` (메시지 ID ${outcome.remoteMessageId})` : ''}. DB에는 기록하지 않았습니다.`);
    return 0;
  }
  context.print(`${command.destination}: 전송 실패 — ${outcome.kind}: ${'detail' in outcome ? outcome.detail : ''}`);
  return 1;
}
