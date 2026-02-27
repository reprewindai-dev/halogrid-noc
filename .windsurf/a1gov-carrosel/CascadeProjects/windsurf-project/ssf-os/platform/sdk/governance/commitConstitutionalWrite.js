import fs from 'fs-extra';
import path from 'path';
import { appendLedgerEvent } from '../ledger/ledgerStore.js';
import { hashPayload } from '../utils/hash.js';

export async function commitConstitutionalWrite({
  targetPath,
  content,
  mode = 'write',
  encoding = 'utf-8',
  traceId = 'unknown',
  actor = 'ssf-os',
}) {
  if (!targetPath) {
    throw new Error('targetPath required for constitutional write');
  }
  await fs.ensureDir(path.dirname(targetPath));
  let payloadBuffer;
  if (Buffer.isBuffer(content)) {
    payloadBuffer = content;
  } else if (typeof content === 'object') {
    payloadBuffer = Buffer.from(JSON.stringify(content, null, 2), 'utf-8');
  } else {
    payloadBuffer = Buffer.from(String(content), 'utf-8');
  }

  if (mode === 'append') {
    await fs.appendFile(targetPath, payloadBuffer);
  } else if (mode === 'write') {
    await fs.writeFile(targetPath, payloadBuffer, { encoding: null });
  } else {
    throw new Error(`Unsupported constitutional write mode: ${mode}`);
  }

  const hash = hashPayload(payloadBuffer.toString(encoding));
  const ledgerEntry = await appendLedgerEvent({
    actor,
    traceId,
    targetPath,
    mode,
    hash,
    size: payloadBuffer.length,
  });
  return { hash, ledgerEntry };
}
