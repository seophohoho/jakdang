import { describe, expect, it } from 'vitest';

describe('단위 테스트 네트워크 차단', () => {
  it('외부 호스트 fetch는 차단 오류로 실패한다', async () => {
    const error = await fetch('https://example.com/').then(
      () => undefined,
      (reason: unknown) => reason as Error & { cause?: Error },
    );
    expect(error).toBeDefined();
    expect(String(error?.cause?.message ?? error?.message)).toContain('차단');
  });
});
