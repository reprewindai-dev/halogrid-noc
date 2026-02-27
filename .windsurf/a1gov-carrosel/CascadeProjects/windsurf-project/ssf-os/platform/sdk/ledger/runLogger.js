import path from 'path';
import fs from 'fs-extra';
import { commitConstitutionalWrite } from '../governance/commitConstitutionalWrite.js';
import { LOG_ROOT, DATA_ROOT } from '../utils/paths.js';

const RUN_CSV = path.join(DATA_ROOT, 'runs.csv');
const LOG_INDEX = path.join(LOG_ROOT, 'index.json');
const LEDGER_HEAD_SNAPSHOT = path.join(LOG_ROOT, 'ledger-head.json');
const MAX_INDEX_ENTRIES = 100;

await fs.ensureDir(LOG_ROOT);
await fs.ensureDir(DATA_ROOT);
await fs.ensureFile(RUN_CSV);
const stats = await fs.stat(RUN_CSV);
if (stats.size === 0) {
  await commitConstitutionalWrite({
    targetPath: RUN_CSV,
    content: 'timestamp,run_id,channel,carousel_length,trend_skin,status\n',
    traceId: 'init:runs_csv',
  });
}

await fs.ensureFile(LOG_INDEX);
const indexStats = await fs.stat(LOG_INDEX);
if (indexStats.size === 0) {
  await commitConstitutionalWrite({
    targetPath: LOG_INDEX,
    content: '[]',
    traceId: 'init:log_index',
  });
}

await fs.ensureFile(LEDGER_HEAD_SNAPSHOT);
const ledgerStats = await fs.stat(LEDGER_HEAD_SNAPSHOT);
if (ledgerStats.size === 0) {
  await commitConstitutionalWrite({
    targetPath: LEDGER_HEAD_SNAPSHOT,
    content: JSON.stringify({ hash: 'GENESIS', index: 0, updatedAt: new Date().toISOString() }),
    traceId: 'init:ledger_head',
  });
}

export async function persistRunLog({ runId, payload, traceId }) {
  const logfile = path.join(LOG_ROOT, `${runId}.json`);
  await commitConstitutionalWrite({ targetPath: logfile, content: payload, traceId: traceId || runId });
}

export async function appendRunCsv({ runId, channel, carouselLength, trendSkin, status }) {
  const row = `${new Date().toISOString()},${runId},${channel},${carouselLength},${trendSkin},${status}\n`;
  await commitConstitutionalWrite({ targetPath: RUN_CSV, content: row, mode: 'append', traceId: runId });
}

export async function updateLogIndex(summary) {
  let existing = [];
  try {
    const raw = await fs.readFile(LOG_INDEX, 'utf-8');
    existing = raw ? JSON.parse(raw) : [];
  } catch {
    existing = [];
  }
  const updated = [summary, ...existing].slice(0, MAX_INDEX_ENTRIES);
  await commitConstitutionalWrite({
    targetPath: LOG_INDEX,
    content: JSON.stringify(updated, null, 2),
    traceId: summary.runId,
  });
}

export async function updateLedgerHeadSnapshot(head) {
  const payload = { ...head, updatedAt: new Date().toISOString() };
  await commitConstitutionalWrite({
    targetPath: LEDGER_HEAD_SNAPSHOT,
    content: JSON.stringify(payload, null, 2),
    traceId: `${head.hash}`,
  });
}
