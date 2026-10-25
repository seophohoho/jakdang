import { X509Certificate } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const pem = readFileSync(
  new URL('../certs/sectigo-public-server-authentication-ca-dv-r36.pem', import.meta.url),
  'utf8',
);

describe('sectigo intermediate certificate', () => {
  it('parses as the R36 issuing CA', () => {
    const cert = new X509Certificate(pem);
    expect(cert.subject).toContain('CN=Sectigo Public Server Authentication CA DV R36');
    expect(cert.issuer).toContain('CN=Sectigo Public Server Authentication Root R46');
  });

  it('is a CA certificate', () => {
    expect(new X509Certificate(pem).ca).toBe(true);
  });

  it('has not expired', () => {
    expect(new Date(new X509Certificate(pem).validTo).getTime()).toBeGreaterThan(Date.now());
  });
});
