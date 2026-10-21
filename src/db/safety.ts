export class UnsafeDatabaseError extends Error {
  constructor(reason: string) {
    super(`테스트 DB 초기화를 거부했습니다: ${reason}`);
    this.name = 'UnsafeDatabaseError';
  }
}

export function assertDisposableDatabase(url: string, protectedUrls: readonly (string | undefined)[] = []): void {
  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    throw new UnsafeDatabaseError('DB 주소를 해석할 수 없습니다');
  }
  const database = decodeURIComponent(parsed.pathname.replace(/^\//, ''));
  if (!/(^|[_-])test($|[_-])/i.test(database)) {
    throw new UnsafeDatabaseError('DB 이름에 test가 단어로 포함되어야 합니다');
  }
  if (protectedUrls.some((protectedUrl) => protectedUrl !== undefined && protectedUrl.trim() === url.trim())) {
    throw new UnsafeDatabaseError('운영/개발용 DATABASE_URL과 같은 주소입니다');
  }
}
