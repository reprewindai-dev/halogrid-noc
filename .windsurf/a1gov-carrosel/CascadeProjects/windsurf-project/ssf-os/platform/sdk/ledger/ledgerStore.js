import fs from 'fs-extra';
import path from 'path';
import { LEDGER_ROOT } from '../utils/paths.js';
import { sha256 } from '../utils/hash.js';

const LEDGER_FILE = path.join(LEDGER_ROOT, 'events.jsonl');
await fs.ensureDir(LEDGER_ROOT);
await fs.ensureFile(LEDGER_FILE);

export async function getLedgerHead() {
  const exists = await fs.pathExists(LEDGER_FILE);
  if (!exists) {
    return { hash: 'GENESIS', index: 0 };
  }
  const data = await fs.readFile(LEDGER_FILE, 'utf-8');
  const lines = data.trim().split('\n').filter(Boolean);
  if (!lines.length) {
    return { hash: 'GENESIS', index: 0 };
  }
  const last = JSON.parse(lines[lines.length - 1]);
  return { hash: last.hash, index: last.index };
}

export async function appendLedgerEvent(eventPayload) {
  const { hash: prevHash, index } = await getLedgerHead();
  const timestamp = new Date().toISOString();
  const serializedPayload = JSON.stringify(eventPayload);
  const hash = sha256(`${prevHash}|${serializedPayload}|${timestamp}`);
  const entry = {
    index: index + 1,
    prevHash,
    hash,
    payload: eventPayload,
    timestamp,
  };
  await fs.appendFile(LEDGER_FILE, `${JSON.stringify(entry)}\n`);
  return entry;
}
