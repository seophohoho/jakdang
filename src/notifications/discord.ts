import {
  defaultTransport,
  genericOutcome,
  parseRetryAfterMs,
  postJson,
  WEBHOOK_TIMEOUT_MS,
  type Notifier,
  type SendOutcome,
  type WebhookTransport,
} from './webhook.js';

export function discordSendUrl(webhookUrl: string): string {
  const url = new URL(webhookUrl);
  url.searchParams.set('wait', 'true');
  return url.toString();
}

function retryAfterFromBody(body: string): number | null {
  try {
    const parsed = JSON.parse(body) as { retry_after?: unknown };
    return typeof parsed.retry_after === 'number' && parsed.retry_after >= 0 ? Math.ceil(parsed.retry_after * 1000) : null;
  } catch {
    return null;
  }
}

function messageIdFromBody(body: string): string | null {
  try {
    const parsed = JSON.parse(body) as { id?: unknown };
    return typeof parsed.id === 'string' && parsed.id !== '' ? parsed.id : null;
  } catch {
    return null;
  }
}

export function createDiscordNotifier(
  webhookUrl: string,
  options: { transport?: WebhookTransport; secrets?: readonly string[] } = {},
): Notifier {
  const transport = options.transport ?? defaultTransport;
  const secrets = [webhookUrl, ...(options.secrets ?? [])];
  return {
    destinationId: 'discord-main',
    async send(payload, sendOptions): Promise<SendOutcome> {
      const result = await postJson({
        url: discordSendUrl(webhookUrl),
        payload,
        timeoutMs: sendOptions?.timeoutMs ?? WEBHOOK_TIMEOUT_MS,
        transport,
        secrets,
      });
      if ('kind' in result) return result;
      const { response, body } = result;
      if (response.status >= 200 && response.status < 300) {
        return { kind: 'sent', remoteMessageId: messageIdFromBody(body) };
      }
      const retryAfter = Math.max(
        parseRetryAfterMs(response.headers.get('retry-after')) ?? 0,
        retryAfterFromBody(body) ?? 0,
      );
      return genericOutcome(response.status, body, retryAfter > 0 ? retryAfter : null, secrets);
    },
  };
}
