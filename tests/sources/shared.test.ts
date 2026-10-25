import { describe, expect, it } from 'vitest';
import { cleanText, requireItems } from '../../src/sources/shared.js';

describe('cleanText', () => {
  it('collapses whitespace and trims', () => {
    expect(cleanText('  A & B\n\t 해커톤 ')).toBe('A & B 해커톤');
  });
});

describe('requireItems', () => {
  it('throws with the source id when the list is empty', () => {
    expect(() => requireItems('okky', [])).toThrow(/okky/);
  });

  it('returns the same array when it has items', () => {
    const items = [{ id: '1', title: 't', url: 'https://example.test/1' }];
    expect(requireItems('okky', items)).toBe(items);
  });
});
