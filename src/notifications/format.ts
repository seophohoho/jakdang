import type { DestinationId } from '../config.js';

export const DISCORD_CONTENT_LIMIT = 2000;
export const MATTERMOST_TEXT_LIMIT = 16_000;

const ZERO_WIDTH_SPACE = '​';

export interface NewItemMessage {
  title: string;
  url: string;
  sourceName: string;
  seenAt: Date;
  itemId: string;
}

export interface DiscordPayload {
  content: string;
  allowed_mentions: { parse: never[] };
}

export interface MattermostPayload {
  text: string;
}

export type WebhookPayload = DiscordPayload | MattermostPayload;

export function formatKst(date: Date): string {
  const parts = Object.fromEntries(
    new Intl.DateTimeFormat('en-CA', {
      timeZone: 'Asia/Seoul',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hourCycle: 'h23',
    })
      .formatToParts(date)
      .map((part) => [part.type, part.value]),
  );
  return `${parts.year}-${parts.month}-${parts.day} ${parts.hour}:${parts.minute} KST`;
}

export function shortRef(itemId: string): string {
  return itemId.replace(/-/g, '').slice(0, 8);
}

function neutralizeMentions(text: string): string {
  return text.replace(/@/g, `@${ZERO_WIDTH_SPACE}`);
}

export function escapeDiscordText(text: string): string {
  return neutralizeMentions(text.replace(/[\\*_~`|>[\]()<]/g, (char) => `\\${char}`));
}

export function escapeMattermostText(text: string): string {
  return neutralizeMentions(text.replace(/[\\*_~`|>[\]()<#!-]/g, (char) => `\\${char}`)).replace(
    /~/g,
    `~${ZERO_WIDTH_SPACE}`,
  );
}

function renderLines(message: NewItemMessage, title: string, escape: (text: string) => string): string {
  return [
    `[신규] ${title}`,
    `출처: ${escape(message.sourceName)}`,
    `링크: ${message.url}`,
    `확인 시각: ${formatKst(message.seenAt)}`,
    `참조: ${shortRef(message.itemId)}`,
  ].join('\n');
}

function fitTitle(
  message: NewItemMessage,
  escape: (text: string) => string,
  limit: number,
): string {
  const codePoints = Array.from(message.title);
  for (let length = codePoints.length; length >= 0; length -= 1) {
    const clipped = length === codePoints.length ? message.title : `${codePoints.slice(0, length).join('')}…`;
    const rendered = renderLines(message, escape(clipped), escape);
    if (rendered.length <= limit) return rendered;
  }
  throw new Error('메시지가 길이 한도를 넘습니다');
}

export function buildDiscordPayload(message: NewItemMessage): DiscordPayload {
  return {
    content: fitTitle(message, escapeDiscordText, DISCORD_CONTENT_LIMIT),
    allowed_mentions: { parse: [] },
  };
}

export function buildMattermostPayload(message: NewItemMessage): MattermostPayload {
  return { text: fitTitle(message, escapeMattermostText, MATTERMOST_TEXT_LIMIT) };
}

export function buildPayload(destinationId: DestinationId, message: NewItemMessage): WebhookPayload {
  return destinationId === 'discord-main' ? buildDiscordPayload(message) : buildMattermostPayload(message);
}
