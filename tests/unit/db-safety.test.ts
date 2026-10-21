import { describe, expect, it } from 'vitest';
import { assertDisposableDatabase, UnsafeDatabaseError } from '../../src/db/safety.js';

describe('assertDisposableDatabase', () => {
  it('test가 들어간 DB 이름만 초기화를 허용한다', () => {
    expect(() => assertDisposableDatabase('postgres://u:p@localhost:54329/jakdang_test')).not.toThrow();
    expect(() => assertDisposableDatabase('postgres://u:p@localhost/test')).not.toThrow();
    expect(() => assertDisposableDatabase('postgres://u:p@ep-x.neon.tech/neondb?sslmode=require')).toThrow(
      UnsafeDatabaseError,
    );
    expect(() => assertDisposableDatabase('postgres://u:p@localhost/jakdang_dev')).toThrow(UnsafeDatabaseError);
    expect(() => assertDisposableDatabase('postgres://u:p@localhost/contest')).toThrow(UnsafeDatabaseError);
  });

  it('DATABASE_URL과 같은 주소는 거부한다', () => {
    const url = 'postgres://u:p@localhost/jakdang_test';
    expect(() => assertDisposableDatabase(url, [url])).toThrow(UnsafeDatabaseError);
  });
});
