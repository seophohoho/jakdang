import net from 'node:net';

const LOOPBACK_HOSTS = new Set(['localhost', '127.0.0.1', '::1', '[::1]']);

type ConnectArgs = Parameters<net.Socket['connect']>;

function targetOf(args: unknown[]): { host?: string; path?: string } {
  const [first, second] = args;
  if (typeof first === 'object' && first !== null) {
    const options = first as { host?: string; path?: string };
    return { host: options.host ?? (options.path ? undefined : 'localhost'), path: options.path };
  }
  if (typeof first === 'string' && Number.isNaN(Number(first))) return { path: first };
  return { host: typeof second === 'string' ? second : 'localhost' };
}

const originalConnect = net.Socket.prototype.connect;

net.Socket.prototype.connect = function patchedConnect(this: net.Socket, ...args: ConnectArgs) {
  const { host, path } = targetOf(args);
  if (path === undefined && (host === undefined || !LOOPBACK_HOSTS.has(host))) {
    throw new Error(`테스트에서 외부 네트워크 연결이 차단됐습니다: ${host ?? '(알 수 없음)'}`);
  }
  return originalConnect.apply(this, args);
} as net.Socket['connect'];
