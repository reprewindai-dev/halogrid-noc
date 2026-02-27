import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const PROJECT_ROOT = path.resolve(__dirname, '../../..');
export const DATA_ROOT = path.join(PROJECT_ROOT, 'data');
export const LOG_ROOT = path.join(PROJECT_ROOT, 'logs');
export const LEDGER_ROOT = path.join(PROJECT_ROOT, 'ledger');
export const OUTPUT_ROOT = path.join(PROJECT_ROOT, 'apps', 'carousel-generator', 'out');
