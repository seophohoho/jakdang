export const NO_STORE_HEADERS = {
  'cache-control': 'no-store, max-age=0',
  'content-type': 'application/json; charset=utf-8',
  'x-content-type-options': 'nosniff',
};

export function json(status: number, body: unknown, headers: Record<string, string> = {}): Response {
  return new Response(JSON.stringify(body), { status, headers: { ...NO_STORE_HEADERS, ...headers } });
}

export function unauthorized(): Response {
  return json(401, { ok: false, error: '인증이 필요합니다' }, { 'www-authenticate': 'Bearer' });
}

export function methodNotAllowed(): Response {
  return json(405, { ok: false, error: 'GET만 허용합니다' }, { allow: 'GET' });
}

export function sanitizeText(text: string | null, secrets: readonly string[] = []): string | null {
  if (text === null) return null;
  let result = text;
  for (const secret of secrets) if (secret.length >= 4) result = result.split(secret).join('[비밀]');
  return result.replace(/https?:\/\/([^/\s"'<>?#]+)[^\s"'<>]*/gi, (_match, host: string) => host.replace(/^[^@]*@/, ''));
}
