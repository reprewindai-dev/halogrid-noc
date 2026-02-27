const forbiddenPatterns = [
  /(only\s+today|last\s+chance)/i,
  /(act\s+now)/i,
  /(secret\s+discount)/i,
  /(sneaky\s+fee)/i,
];

export function evaluateCitizenship(text = '') {
  const warnings = [];
  for (const pattern of forbiddenPatterns) {
    if (pattern.test(text)) {
      warnings.push(`Citizenship: Detected manipulative phrase ${pattern}`);
    }
  }
  const requiresDisclaimer = /(guarantee|results|roi)/i.test(text);
  const disclaimers = requiresDisclaimer
    ? ['No guarantees. Delivery quality depends on provided assets and platform shifts.']
    : [];
  return {
    compliant: warnings.length === 0,
    warnings,
    disclaimers,
  };
}
