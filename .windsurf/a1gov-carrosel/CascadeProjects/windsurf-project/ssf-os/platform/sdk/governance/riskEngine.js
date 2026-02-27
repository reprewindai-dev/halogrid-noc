import { hashPayload } from '../utils/hash.js';

const KEYWORD_WEIGHTS = {
  guarantee: 30,
  unlimited: 15,
  instant: 10,
  profit: 20,
  scam: 40,
  lawsuit: 50,
};

function scoreText(text = '') {
  const normalized = text.toLowerCase();
  let score = 0;
  for (const [keyword, weight] of Object.entries(KEYWORD_WEIGHTS)) {
    if (normalized.includes(keyword)) {
      score += weight;
    }
  }
  return Math.min(score, 100);
}

export function deriveTier(scores) {
  if (!scores) return 'Tier0';
  if (
    scores.financial_risk_score >= 60 ||
    scores.constitutional_risk_score >= 60 ||
    scores.abuse_score >= 50
  ) {
    return 'Tier2';
  }
  if (
    scores.financial_risk_score >= 35 ||
    scores.fracture_score >= 35 ||
    scores.detrimental_score >= 35
  ) {
    return 'Tier1';
  }
  return 'Tier0';
}

export function scorePayload({ payload, evaluationText = '' }) {
  const textBlob = `${JSON.stringify(payload)}\n${evaluationText}`;
  const baseScore = scoreText(textBlob);
  return {
    fracture_score: Math.min(baseScore * 0.6, 100),
    detrimental_score: Math.min(baseScore * 0.5, 100),
    financial_risk_score: Math.min(baseScore * 0.8, 100),
    constitutional_risk_score: Math.min(baseScore * 0.7, 100),
    drift_delta: hashPayload(textBlob).slice(0, 8),
    abuse_score: Math.min(baseScore * 0.4, 100),
  };
}
