import fetch from 'node-fetch';
import { logInfo, logWarn } from '../observability/logger.js';

const BASE_URL = process.env.BYOS_BASE_URL;
const API_KEY = process.env.BYOS_API_KEY;

export async function sendRunMetadata({ runId, hashes, ledgerHead, tier, status }) {
  if (!BASE_URL || !API_KEY) {
    return { delivered: false, reason: 'BYOS disabled' };
  }
  try {
    const res = await fetch(`${BASE_URL}/runs`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({ runId, hashes, ledgerHead, tier, status }),
    });
    if (!res.ok) {
      logWarn('BYOS metadata push failed', { status: res.status });
      return { delivered: false, reason: `status_${res.status}` };
    }
    logInfo('BYOS metadata delivered', { runId });
    return { delivered: true };
  } catch (err) {
    logWarn('BYOS metadata exception', { error: err.message });
    return { delivered: false, reason: 'network_error' };
  }
}
