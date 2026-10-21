import { createHealthHandler } from '../src/http/health-handler.js';
import { methodNotAllowed } from '../src/http/responses.js';

export const GET = createHealthHandler();

export const POST = async () => methodNotAllowed();
export const PUT = POST;
export const PATCH = POST;
export const DELETE = POST;
