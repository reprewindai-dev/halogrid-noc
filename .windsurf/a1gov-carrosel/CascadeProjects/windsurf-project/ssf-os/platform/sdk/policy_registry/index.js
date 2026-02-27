import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const policyFile = path.join(__dirname, 'policies.json');

let cache;

export async function loadPolicies() {
  if (cache) return cache;
  const raw = await fs.readFile(policyFile, 'utf-8');
  cache = JSON.parse(raw);
  return cache;
}

export async function getPolicyVersion() {
  const data = await loadPolicies();
  return data.version;
}
