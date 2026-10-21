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

export function createMattermostNotifier(
  webhookUrl: string,
  options: { transport?: WebhookTransport; secrets?: readonly string[] } = {},
): Notifier {
  const transport = options.transport ?? defaultTransport;
  const secrets = [webhookUrl, ...(options.secrets ?? [])];
  return {
    destinationId: 'mattermost-main',
    async send(payload, sendOptions): Promise<SendOutcome> {
      const result = await postJson({
        url: webhookUrl,
        payload,
        timeoutMs: sendOptions?.timeoutMs ?? WEBHOOK_TIMEOUT_MS,
        transport,
        secrets,
      });
      if ('kind' in result) return result;
      const { response, body } = result;
      if (response.status >= 200 && response.status < 300) return { kind: 'sent', remoteMessageId: null };
      const retryAfter =
        parseRetryAfterMs(response.headers.get('retry-after')) ?? parseRetryAfterMs(response.headers.get('x-ratelimit-reset'));
      return genericOutcome(response.status, body, retryAfter, secrets);
    },
  };
}
