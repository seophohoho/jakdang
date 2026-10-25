import { sources } from './sources/index.js';
import { cleanText } from './sources/shared.js';

let failed = false;

for (const source of sources) {
  try {
    const items = await source.read();
    console.log(`${source.id}\t${items.length}건\t${items[0]?.title ?? ''}`);
  } catch (error) {
    failed = true;
    const message = error instanceof Error ? error.message : String(error);
    console.log(`${source.id}\t실패\t${cleanText(message)}`);
  }
}

if (failed) process.exitCode = 1;
