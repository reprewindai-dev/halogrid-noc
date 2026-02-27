import { evaluateCitizenship } from '../citizenship/citizenshipGuard.js';

export async function citizenshipWatchtower({ output }) {
  const textBlob = JSON.stringify(output);
  const evaluation = evaluateCitizenship(textBlob);
  return {
    id: 'citizenship_watchtower',
    label: 'Citizenship Watchtower',
    passed: evaluation.compliant,
    details: evaluation.warnings.join(' '),
    disclaimers: evaluation.disclaimers,
  };
}
