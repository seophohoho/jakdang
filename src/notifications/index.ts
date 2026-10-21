import type { AppConfig, DestinationId } from '../config.js';
import { secretValues } from '../config.js';
import { createDiscordNotifier } from './discord.js';
import { createMattermostNotifier } from './mattermost.js';
import type { Notifier, WebhookTransport } from './webhook.js';

export function createNotifiers(config: AppConfig, transport?: WebhookTransport): Map<DestinationId, Notifier> {
  const secrets = secretValues(config);
  const notifiers = new Map<DestinationId, Notifier>();
  const discord = config.webhooks['discord-main'];
  const mattermost = config.webhooks['mattermost-main'];
  if (discord) notifiers.set('discord-main', createDiscordNotifier(discord, { transport, secrets }));
  if (mattermost) notifiers.set('mattermost-main', createMattermostNotifier(mattermost, { transport, secrets }));
  return notifiers;
}
