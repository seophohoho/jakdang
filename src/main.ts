import { postMessage } from './mattermost.js';
import { run } from './run.js';
import { sources } from './sources/index.js';
import { loadState, saveState } from './state.js';

const STATE_PATH = 'data/sent.json';

const webhookUrl = process.env.MATTERMOST_WEBHOOK_URL;
if (!webhookUrl) throw new Error('MATTERMOST_WEBHOOK_URL is not set');

const state = await loadState(STATE_PATH);
const result = await run({ sources, state, post: (text) => postMessage(webhookUrl, text) });
await saveState(STATE_PATH, result.state);

console.log(`보냄 ${result.sent}건, 실패 ${result.failures.length}곳`);
for (const failure of result.failures) {
  console.error(`${failure.sourceId}: ${failure.error}`);
}
if (result.failures.length > 0) process.exitCode = 1;
