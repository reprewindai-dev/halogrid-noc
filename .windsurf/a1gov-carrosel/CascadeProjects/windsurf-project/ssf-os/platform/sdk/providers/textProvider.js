import fetch from 'node-fetch';
import { logWarn } from '../observability/logger.js';

const HF_TOKEN = process.env.HF_TOKEN;
const HF_TEXT_MODEL = process.env.HF_TEXT_MODEL || 'mistralai/Mistral-7B-Instruct-v0.3';
const HF_API_BASE = (process.env.HF_API_BASE || 'https://router.huggingface.co/v1').replace(/\/$/, '');

export async function callTextModel({ prompt, trace, inputPayload }) {
  if (!HF_TOKEN) {
    return deterministicFallback({ prompt, inputPayload });
  }
  const body = {
    model: HF_TEXT_MODEL,
    messages: [{ role: 'user', content: prompt }],
    max_tokens: 512,
    temperature: 0.6,
  };
  const res = await fetch(`${HF_API_BASE}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${HF_TOKEN}`,
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    logWarn('HF text provider fallback triggered', { status: res.status, traceId: trace.traceId });
    return deterministicFallback({ prompt, inputPayload });
  }
  const data = await res.json();
  const text = data.choices?.[0]?.message?.content || '';
  return {
    output: text,
    modelUsed: HF_TEXT_MODEL,
    meta: { provider: 'hf', estimatedCost: 0.001 },
  };
}

export async function deterministicFallback({ prompt, inputPayload = {} }) {
  const heuristic = prompt.slice(0, 120).toLowerCase();
  const channel = inputPayload?.config?.channel || inputPayload?.channel || (heuristic.includes('shop') ? 'SHOP' : 'SERVICES');
  const variant = inputPayload?.variantLabel || 'A';
  const slides = Array.from({ length: heuristic.includes('9') ? 9 : 5 }).map((_, idx) => ({
    title: channel === 'SHOP' ? `SSF Shop Slide ${idx + 1}` : `SSF Services Slide ${idx + 1}`,
    body: channel === 'SHOP'
      ? `Detailed SHOP insight ${idx + 1} grounded in offer clarity, delivery inclusions, and price signaling for SSF buyers.`
      : `SERVICES narrative ${idx + 1} focused on backlog kill-switches, async production, and agency-tier QA lines.`,
  }));
  return {
    output: { variant, channel, slides },
    modelUsed: 'deterministic_fallback',
    meta: { provider: 'local_rules', estimatedCost: 0 },
  };
}
