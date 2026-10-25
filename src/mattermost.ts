import type { Item } from './types.js';

function escapeTitle(title: string): string {
  return title.replace(/[\\`*_~[\]()!<>|]/g, '\\$&').replaceAll('@', '@\u200b');
}

export function formatMessage(sourceName: string, item: Item): string {
  return `## ${escapeTitle(item.title)}\n- 사이트: ${sourceName}\n- 링크: ${item.url}`;
}

export async function postMessage(webhookUrl: string, text: string): Promise<void> {
  const res = await fetch(webhookUrl, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ text }),
    signal: AbortSignal.timeout(10_000),
  });
  if (!res.ok) throw new Error(`Mattermost webhook responded ${res.status}`);
}
