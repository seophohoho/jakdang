import { X509Certificate } from 'node:crypto';
import { readFileSync } from 'node:fs';
import tls from 'node:tls';
import { describe, expect, it } from 'vitest';
import { aiaIssuerUrl, isTrustedIntermediate } from '../src/chain.js';

function fixture(name: string): X509Certificate {
  return new X509Certificate(readFileSync(new URL(`./fixtures/${name}`, import.meta.url), 'utf8'));
}

const leaf = fixture('allcon-leaf.pem');
const intermediate = fixture('sectigo-dv-r36.pem');
const roots = tls.rootCertificates.map((pem) => new X509Certificate(pem));

function withFlippedSignatureBit(cert: X509Certificate): X509Certificate {
  const der = Buffer.from(cert.raw);
  const last = der.length - 1;
  der.writeUInt8(der.readUInt8(last) ^ 1, last);
  return new X509Certificate(der);
}

describe('aiaIssuerUrl', () => {
  it('extracts the CA Issuers url from a real leaf', () => {
    expect(aiaIssuerUrl(leaf.infoAccess)).toBe('http://crt.sectigo.com/SectigoPublicServerAuthenticationCADVR36.crt');
  });

  it('returns undefined when there is no info access', () => {
    expect(aiaIssuerUrl(undefined)).toBeUndefined();
  });

  it('returns undefined when no CA Issuers entry exists', () => {
    expect(aiaIssuerUrl('OCSP - URI:http://ocsp.sectigo.com\n')).toBeUndefined();
  });
});

describe('isTrustedIntermediate', () => {
  it('accepts the issuing intermediate chained to a root', () => {
    expect(isTrustedIntermediate(leaf, intermediate, roots)).toBe(true);
  });

  it('rejects a candidate that did not sign the leaf', () => {
    expect(isTrustedIntermediate(leaf, leaf, roots)).toBe(false);
  });

  it('rejects an intermediate with no trusted root', () => {
    expect(isTrustedIntermediate(leaf, intermediate, [])).toBe(false);
  });

  it('rejects a leaf whose signature was altered', () => {
    expect(isTrustedIntermediate(withFlippedSignatureBit(leaf), intermediate, roots)).toBe(false);
  });

  it('rejects an intermediate whose signature was altered', () => {
    expect(isTrustedIntermediate(leaf, withFlippedSignatureBit(intermediate), roots)).toBe(false);
  });
});
