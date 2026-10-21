import { describe, expect, it } from 'vitest';
import { createLogger, REDACTED, redact } from '../../src/log.js';

describe('redact', () => {
  it('Webhook URL은 경로 전체를 마스킹한다', () => {
    const text = 'POST https://discord.com/api/webhooks/123/abcdef?wait=true 실패';
    expect(redact(text)).toBe(`POST ${REDACTED} 실패`);
    expect(redact('https://chat.example.com/hooks/zzz9')).toBe(REDACTED);
  });

  it('DB 주소와 Bearer 토큰, 등록된 비밀을 마스킹한다', () => {
    expect(redact('postgres://u:p@host/db 연결')).toBe(`${REDACTED} 연결`);
    expect(redact('Authorization: Bearer abc.def')).toBe(`Authorization: ${REDACTED}`);
    expect(redact('token=s3cr3t-value', ['s3cr3t-value'])).toBe(`token=${REDACTED}`);
  });
});

describe('createLogger', () => {
  it('레벨 미만 로그를 버리고 비밀을 지운다', () => {
    const lines: string[] = [];
    const logger = createLogger({ level: 'info', secrets: ['topsecret'], write: (line) => lines.push(line) });
    logger.debug('보이지 않음');
    logger.info('보임', { detail: 'topsecret', error: new Error('boom') });
    expect(lines).toHaveLength(1);
    const record = JSON.parse(lines[0] ?? '{}');
    expect(record).toMatchObject({ level: 'info', msg: '보임', detail: REDACTED, error: { message: 'boom' } });
  });
});
