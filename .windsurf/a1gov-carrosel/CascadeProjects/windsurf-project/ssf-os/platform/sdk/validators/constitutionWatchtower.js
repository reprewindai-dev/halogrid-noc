import { evaluateIronmark } from '../constitution/ironmarkRuntime.js';

export async function constitutionWatchtower({ output }) {
  const textBlob = JSON.stringify(output);
  const evaluation = evaluateIronmark(textBlob);
  return {
    id: 'constitution_watchtower',
    label: 'Constitution Watchtower',
    passed: evaluation.compliant,
    details: evaluation.issues.join(' '),
    disclaimers: evaluation.disclaimers,
  };
}
