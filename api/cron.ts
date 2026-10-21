import { createCronHandler } from '../src/http/cron-handler.js';
import { methodNotAllowed } from '../src/http/responses.js';

export const GET = createCronHandler();

export const POST = async () => methodNotAllowed();
export const PUT = POST;
export const PATCH = POST;
export const DELETE = POST;
