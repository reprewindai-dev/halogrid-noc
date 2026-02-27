const STATE_MAP = {
  INIT: ['VALIDATING'],
  VALIDATING: ['RENDERING', 'BLOCKED'],
  RENDERING: ['ASSEMBLING', 'BLOCKED'],
  ASSEMBLING: ['FINALIZING', 'BLOCKED'],
  FINALIZING: ['COMPLETE'],
  BLOCKED: [],
  COMPLETE: [],
};

export function validateTransition({ currentState, nextState }) {
  const allowed = STATE_MAP[currentState] || [];
  const ok = allowed.includes(nextState);
  return {
    ok,
    allowed,
    nextState,
    currentState,
  };
}

export function enforceStateTransition({ currentState, nextState }) {
  const validation = validateTransition({ currentState, nextState });
  if (!validation.ok) {
    throw new Error(`Invalid state transition ${currentState} -> ${nextState}. Allowed: ${validation.allowed.join(', ')}`);
  }
  return validation;
}
