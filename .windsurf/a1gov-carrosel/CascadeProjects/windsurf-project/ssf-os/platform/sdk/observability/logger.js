import fs from 'fs-extra';
import path from 'path';
import { LOG_ROOT } from '../utils/paths.js';

await fs.ensureDir(LOG_ROOT);

export function logDebug(message, meta = {}) {
  emit('debug', message, meta);
}

export function logInfo(message, meta = {}) {
  emit('info', message, meta);
}

export function logWarn(message, meta = {}) {
  emit('warn', message, meta);
}

export function logError(message, meta = {}) {
  emit('error', message, meta);
}

function emit(level, message, meta) {
  const entry = {
    level,
    message,
    meta,
    timestamp: new Date().toISOString(),
  };
  const line = JSON.stringify(entry) + '\n';
  fs.appendFile(path.join(LOG_ROOT, 'runtime.log'), line).catch(() => {});
  if (level === 'error') {
    console.error(`[${level}] ${message}`, meta);
  } else {
    console.log(`[${level}] ${message}`, meta);
  }
}
