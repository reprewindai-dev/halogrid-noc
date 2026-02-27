const riskyPhrases = [
  /guaranteed\s+results?/i,
  /secret\s+hack/i,
  /unlimited\s+leads/i,
  /effortless\s+profits?/i,
  /risk[- ]?free\s*money/i,
  /instant\s+roi/i,
];

export function evaluateIronmark(payloadText = '') {
  const issues = [];
  const disclaimers = [];
  for (const phrase of riskyPhrases) {
    if (phrase.test(payloadText)) {
      issues.push(`Ironmark: Detected disallowed claim pattern ${phrase}`);
    }
  }
  if (/results?/i.test(payloadText) && !/results\s+vary/i.test(payloadText)) {
    disclaimers.push('Results vary based on execution, scope, and platform shifts.');
  }
  return {
    compliant: issues.length === 0,
    issues,
    disclaimers,
  };
}
