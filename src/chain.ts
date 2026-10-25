import { X509Certificate } from 'node:crypto';
import tls from 'node:tls';
import { USER_AGENT } from './user-agent.js';

const TIMEOUT_MS = 10_000;
const TLS_PORT = 443;
const CA_ISSUERS_URI = /CA Issuers - URI:(\S+)/;

export function aiaIssuerUrl(infoAccess: string | undefined): string | undefined {
  return CA_ISSUERS_URI.exec(infoAccess ?? '')?.[1];
}

function isSignedBy(cert: X509Certificate, issuer: X509Certificate): boolean {
  return cert.checkIssued(issuer) && cert.verify(issuer.publicKey);
}

export function isTrustedIntermediate(
  leaf: X509Certificate,
  candidate: X509Certificate,
  roots: X509Certificate[],
): boolean {
  return isSignedBy(leaf, candidate) && roots.some((root) => isSignedBy(candidate, root));
}

function readLeaf(host: string): Promise<X509Certificate> {
  return new Promise((resolve, reject) => {
    const socket = tls.connect(
      { host, port: TLS_PORT, servername: host, rejectUnauthorized: false, timeout: TIMEOUT_MS },
      () => {
        const leaf = socket.getPeerX509Certificate();
        socket.destroy();
        if (leaf === undefined) reject(new Error(`${host}가 인증서를 보내지 않았다`));
        else resolve(leaf);
      },
    );
    socket.on('timeout', () => socket.destroy(new Error(`${host} 인증서 조회 시간 초과`)));
    socket.on('error', reject);
  });
}

async function downloadCertificate(url: string): Promise<X509Certificate> {
  const res = await fetch(url, { headers: { 'user-agent': USER_AGENT }, signal: AbortSignal.timeout(TIMEOUT_MS) });
  if (!res.ok) throw new Error(`HTTP ${res.status} ${url}`);
  return new X509Certificate(Buffer.from(await res.arrayBuffer()));
}

export async function completeChain(host: string): Promise<void> {
  const leaf = await readLeaf(host);
  const url = aiaIssuerUrl(leaf.infoAccess);
  if (url === undefined) throw new Error('인증서에 CA Issuers 주소(AIA)가 없다');
  const intermediate = await downloadCertificate(url);
  const roots = tls.rootCertificates.map((pem) => new X509Certificate(pem));
  if (!isTrustedIntermediate(leaf, intermediate, roots)) throw new Error(`내려받은 인증서를 믿을 수 없다: ${url}`);
  tls.setDefaultCACertificates([...tls.getCACertificates('default'), intermediate.toString()]);
}
