import crypto from 'crypto';

export function sha256(data) {
  return crypto.createHash('sha256').update(data).digest('hex');
}

export function hashPayload(payload) {
  const serialized = typeof payload === 'string' ? payload : JSON.stringify(payload);
  return sha256(serialized);
}
