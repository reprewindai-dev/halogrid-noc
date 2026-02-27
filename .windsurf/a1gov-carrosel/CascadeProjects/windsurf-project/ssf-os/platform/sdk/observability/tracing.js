import crypto from 'crypto';

export function createTraceId() {
  return crypto.randomUUID();
}

export function traceEnvelope(metadata = {}) {
  return {
    traceId: createTraceId(),
    timestamp: new Date().toISOString(),
    ...metadata,
  };
}
