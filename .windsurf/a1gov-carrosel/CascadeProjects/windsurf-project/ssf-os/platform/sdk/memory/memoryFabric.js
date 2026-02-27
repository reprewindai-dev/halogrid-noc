import fs from 'fs-extra';
import path from 'path';
import { DATA_ROOT } from '../utils/paths.js';
import { sha256 } from '../utils/hash.js';

const FABRIC_FILE = path.join(DATA_ROOT, 'memory_fabric.jsonl');
await fs.ensureFile(FABRIC_FILE);

export async function recordMemoryStub({ runId, inputHash, outputHash, tier, channel }) {
  const payload = {
    runId,
    tier,
    channel,
    inputHash,
    outputHash,
    recordedAt: new Date().toISOString(),
  };
  await fs.appendFile(FABRIC_FILE, `${JSON.stringify(payload)}\n`);
  return payload;
}
