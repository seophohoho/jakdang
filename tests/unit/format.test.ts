import { describe, expect, it } from 'vitest';
import {
  buildDiscordPayload,
  buildMattermostPayload,
  DISCORD_CONTENT_LIMIT,
  formatKst,
  shortRef,
} from '../../src/notifications/format.js';

const base = {
  title: '2026 오픈소스 개발자대회',
  url: 'https://www.oss.kr/pages/10/4540',
  sourceName: '오픈소스 포털(NIPA) 공지사항',
  seenAt: new Date('2026-10-22T00:03:00Z'),
  itemId: '3f2a9c1e-1111-4222-8333-444455556666',
};

describe('알림 템플릿', () => {
  it('계획서의 5줄 형식과 한국 시간을 쓴다', () => {
    const { text } = buildMattermostPayload(base);
    expect(text.split('\n')).toEqual([
      '[신규] 2026 오픈소스 개발자대회',
      '출처: 오픈소스 포털\\(NIPA\\) 공지사항',
      '링크: https://www.oss.kr/pages/10/4540',
      '확인 시각: 2026-10-22 09:03 KST',
      '참조: 3f2a9c1e',
    ]);
    expect(formatKst(new Date('2026-12-31T15:30:00Z'))).toBe('2027-01-01 00:30 KST');
    expect(shortRef(base.itemId)).toBe('3f2a9c1e');
  });

  it('Discord는 멘션 파싱을 끄고 제목 속 멘션·Markdown 링크를 무력화한다', () => {
    const payload = buildDiscordPayload({ ...base, title: '@everyone [무료 경품](https://evil.example) <@123> **긴급**' });
    expect(payload.allowed_mentions).toEqual({ parse: [] });
    const firstLine = payload.content.split('\n')[0] ?? '';
    expect(firstLine).not.toMatch(/\[[^\]]*\]\(/);
    expect(firstLine).not.toContain('@everyone');
    expect(firstLine).not.toContain('<@123>');
    expect(firstLine).toContain('\\[무료 경품\\]\\(https://evil.example\\)');
    expect(firstLine).toContain('\\*\\*긴급\\*\\*');
  });

  it('Mattermost는 @channel·@here·@사용자·~채널 멘션과 Markdown 링크를 무력화한다', () => {
    const { text } = buildMattermostPayload({ ...base, title: '@channel @here @all @kim ~town-square [링크](https://evil.example)' });
    const firstLine = text.split('\n')[0] ?? '';
    for (const mention of ['@channel', '@here', '@all', '@kim', '~town-square']) expect(firstLine).not.toContain(mention);
    expect(firstLine).not.toMatch(/\[[^\]]*\]\(/);
  });

  it('Discord content는 UTF-16 길이 2,000 이하로 제목을 줄인다', () => {
    const payload = buildDiscordPayload({
      ...base,
      title: '😀'.repeat(200),
      url: `https://www.oss.kr/${'a'.repeat(1700)}`,
    });
    expect(payload.content.length).toBeLessThanOrEqual(DISCORD_CONTENT_LIMIT);
    expect(payload.content).toContain('…');
    expect(payload.content).toContain(`링크: https://www.oss.kr/${'a'.repeat(1700)}`);
    expect(payload.content.split('\n')[0]).not.toMatch(/[\ud800-\udbff]…$/);
  });
});
