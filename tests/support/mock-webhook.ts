import http from 'node:http';
import type { AddressInfo } from 'node:net';

export type MockBehavior =
  | { status: number; body?: string; headers?: Record<string, string>; delayMs?: number }
  | { drop: true }
  | { hang: true };

export interface ReceivedRequest {
  method: string;
  path: string;
  query: URLSearchParams;
  headers: http.IncomingHttpHeaders;
  body: unknown;
}

export class MockWebhookServer {
  readonly received: ReceivedRequest[] = [];
  private readonly queue: MockBehavior[] = [];
  private fallback: MockBehavior = { status: 200, body: '{"id":"default-id"}' };
  private server: http.Server | undefined;
  private readonly sockets = new Set<import('node:net').Socket>();
  port = 0;

  async start(): Promise<this> {
    this.server = http.createServer((req, res) => {
      let raw = '';
      req.on('data', (chunk) => {
        raw += chunk;
      });
      req.on('end', () => {
        const url = new URL(req.url ?? '/', 'http://127.0.0.1');
        let body: unknown = raw;
        try {
          body = JSON.parse(raw);
        } catch {
          body = raw;
        }
        this.received.push({ method: req.method ?? '', path: url.pathname, query: url.searchParams, headers: req.headers, body });
        const behavior = this.queue.shift() ?? this.fallback;
        if ('drop' in behavior) {
          req.socket.destroy();
          return;
        }
        if ('hang' in behavior) return;
        const respond = () => {
          res.writeHead(behavior.status, { 'content-type': 'application/json', ...behavior.headers });
          res.end(behavior.body ?? '');
        };
        if (behavior.delayMs) setTimeout(respond, behavior.delayMs);
        else respond();
      });
    });
    this.server.on('connection', (socket) => {
      this.sockets.add(socket);
      socket.on('close', () => this.sockets.delete(socket));
    });
    await new Promise<void>((resolve) => this.server!.listen(0, '127.0.0.1', resolve));
    this.port = (this.server.address() as AddressInfo).port;
    return this;
  }

  enqueue(...behaviors: MockBehavior[]): this {
    this.queue.push(...behaviors);
    return this;
  }

  setFallback(behavior: MockBehavior): this {
    this.fallback = behavior;
    return this;
  }

  reset(): void {
    this.queue.length = 0;
    this.received.length = 0;
    this.fallback = { status: 200, body: '{"id":"default-id"}' };
  }

  url(path: string): string {
    return `http://127.0.0.1:${this.port}${path}`;
  }

  async stop(): Promise<void> {
    for (const socket of this.sockets) socket.destroy();
    await new Promise<void>((resolve) => this.server?.close(() => resolve()) ?? resolve());
  }
}

export async function closedPortUrl(path: string): Promise<string> {
  const server = http.createServer();
  await new Promise<void>((resolve) => server.listen(0, '127.0.0.1', resolve));
  const port = (server.address() as AddressInfo).port;
  await new Promise<void>((resolve) => server.close(() => resolve()));
  return `http://127.0.0.1:${port}${path}`;
}
