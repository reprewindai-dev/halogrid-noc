import { schemaValidator } from './schemaValidator.js';
import { coherenceWatchtower } from './coherenceWatchtower.js';
import { qualityWatchtower } from './qualityWatchtower.js';
import { constitutionWatchtower } from './constitutionWatchtower.js';
import { citizenshipWatchtower } from './citizenshipWatchtower.js';

const WATCHTOWERS = [
  schemaValidator,
  coherenceWatchtower,
  qualityWatchtower,
  constitutionWatchtower,
  citizenshipWatchtower,
];

const TIER_RULES = {
  Tier0: 2,
  Tier1: 3,
  Tier2: 5,
};

export async function runWatchtowers({ tier, schema, output, context }) {
  const results = [];
  let passes = 0;
  const disclaimers = new Set();
  for (const tower of WATCHTOWERS) {
    const res = await tower({ schema, output, context });
    if (res.passed) passes += 1;
    res.disclaimers?.forEach((d) => disclaimers.add(d));
    results.push(res);
  }
  const requiredPasses = TIER_RULES[tier] ?? 3;
  const passed = passes >= requiredPasses;
  return {
    passed,
    passes,
    requiredPasses,
    results,
    disclaimers: Array.from(disclaimers),
    nextAllowedActions: passed ? ['ship_output'] : ['revise_prompt', 'escalate'],
  };
}
