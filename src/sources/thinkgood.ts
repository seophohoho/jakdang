import { fetchText } from '../http.js';
import type { Item, Source } from '../types.js';
import { cleanText, requireItems } from './shared.js';

const LIST_URL = 'https://www.thinkcontest.com/thinkgood/user/contest/subList.do';
const LIST_BODY = JSON.stringify({
  recordsPerPage: 20,
  currentPageNo: 1,
  contest_field: 'CCFD002',
  host_organ: '',
  enter_qualified: '',
  award_size: '',
  searchStatus: 'Y',
  sidx: 'putup_sdt',
  sord: 'DESC',
});

type Row = { contest_pk?: string | number | null; program_nm?: string | null };

export function parseThinkgood(json: string): Item[] {
  const rows = (JSON.parse(json) as { listJsonData?: Row[] }).listJsonData ?? [];
  const items: Item[] = [];
  for (const row of rows) {
    if (row.contest_pk === undefined || row.contest_pk === null) continue;
    const id = String(row.contest_pk);
    const title = cleanText(row.program_nm ?? '');
    if (title === '') continue;
    items.push({
      id,
      title,
      url: `https://www.thinkcontest.com/thinkgood/user/contest/view.do?contest_pk=${id}`,
    });
  }
  return requireItems('thinkgood', items);
}

export const thinkgood: Source = {
  id: 'thinkgood',
  name: '씽굿',
  read: async () =>
    parseThinkgood(
      await fetchText(LIST_URL, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: LIST_BODY,
      }),
    ),
};
