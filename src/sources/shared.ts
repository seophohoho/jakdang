import type { Item } from '../types.js';

export function cleanText(text: string): string {
  return text.replace(/\s+/g, ' ').trim();
}

export function requireItems(sourceId: string, items: Item[]): Item[] {
  if (items.length === 0) throw new Error(`${sourceId}: 목록에서 항목을 찾지 못했다`);
  return items;
}
