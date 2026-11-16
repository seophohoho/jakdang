import { chromium } from 'playwright';
import { USER_AGENT } from './user-agent.js';

const TIMEOUT_MS = 30_000;

export async function fetchRenderedHtml(url: string, readySelector: string): Promise<string> {
  const browser = await chromium.launch();
  try {
    const context = await browser.newContext({ userAgent: USER_AGENT });
    const page = await context.newPage();
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: TIMEOUT_MS });
    try {
      await page.waitForSelector(readySelector, { timeout: TIMEOUT_MS });
    } catch (error) {
      throw new Error(`렌더링 후에도 ${readySelector}가 나타나지 않았다 ${url}`, { cause: error });
    }
    return await page.content();
  } finally {
    await browser.close();
  }
}
