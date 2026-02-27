import fetch from 'node-fetch';
import { logWarn } from '../observability/logger.js';

const HF_TOKEN = process.env.HF_TOKEN;
const HF_IMAGE_MODEL = process.env.HF_IMAGE_MODEL || 'stabilityai/stable-diffusion-xl-base-1.0';
const HF_API_BASE = (process.env.HF_API_BASE || 'https://router.huggingface.co/hf-inference/models').replace(/\/$/, '');

const SKIN_BACKGROUNDS = {
  CLEAN_MINIMAL_PRO: 'linear-gradient(135deg, #1a1a1a, #2d2d2d)',
  COOL_BLUE_GLACIER: 'linear-gradient(160deg, #0f0f23, #1a1a3e)',
  GUMMY_GLOSS: 'linear-gradient(120deg, #1a1a1a, #3d3d3d)',
  GLITCHY_GLAM: 'linear-gradient(120deg, #0f0f0f, #2a2a2a)',
  EDITORIAL_LUXE: 'linear-gradient(145deg, #1a1a1a, #2d2d2d)',
  CREATOR_DESK: 'linear-gradient(150deg, #0f0f0f, #262626)',
};

export async function callImageModel({ prompt, inputPayload, trace }) {
  if (!HF_TOKEN) {
    return deterministicImageFallback({ inputPayload });
  }
  const body = {
    inputs: prompt,
    parameters: { width: 1000, height: 1500 },
  };
  const res = await fetch(`${HF_API_BASE}/${HF_IMAGE_MODEL}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${HF_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    logWarn('HF image provider fallback triggered', { traceId: trace.traceId, status: res.status });
    return deterministicImageFallback({ inputPayload });
  }
  const arrayBuffer = await res.arrayBuffer();
  const base64 = Buffer.from(arrayBuffer).toString('base64');
  return {
    output: { base64 },
    modelUsed: HF_IMAGE_MODEL,
    meta: { provider: 'hf', estimatedCost: 0.01 },
  };
}

export function deterministicImageFallback({ inputPayload }) {
  const skin = inputPayload.trendSkin || 'CLEAN_MINIMAL_PRO';
  const css = SKIN_BACKGROUNDS[skin] || SKIN_BACKGROUNDS.CLEAN_MINIMAL_PRO;
  return {
    output: {
      cssBackground: css,
      skin,
    },
    modelUsed: 'deterministic_css_fallback',
    meta: { provider: 'css', estimatedCost: 0 },
  };
}
