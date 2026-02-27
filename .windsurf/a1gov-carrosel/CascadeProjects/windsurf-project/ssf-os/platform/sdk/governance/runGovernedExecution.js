import { performance } from 'perf_hooks';
import { scorePayload, deriveTier } from './riskEngine.js';
import { runWatchtowers } from '../validators/index.js';
import { traceEnvelope } from '../observability/tracing.js';
import { logInfo, logWarn } from '../observability/logger.js';
import { callTextModel } from '../providers/textProvider.js';
import { callImageModel } from '../providers/imageProvider.js';

const PROVIDERS = {
  text: callTextModel,
  image: callImageModel,
};

export async function runGovernedExecution({
  kind = 'text',
  prompt = '',
  inputPayload = {},
  schema,
  fallback,
  taskLabel = 'unspecified_task',
  payloadType = 'general',
}) {
  const trace = traceEnvelope({ kind, taskLabel });
  const riskScores = scorePayload({ payload: inputPayload, evaluationText: prompt });
  const tier = deriveTier(riskScores);
  const provider = PROVIDERS[kind];
  if (!provider) {
    throw new Error(`Unsupported governed kind: ${kind}`);
  }

  async function executeAttempt({ mode = 'primary' }) {
    const attemptStart = performance.now();
    let rawOutput;
    let modelUsed = 'fallback';
    let providerMeta = {};

    if (mode === 'primary') {
      ({ output: rawOutput, modelUsed, meta: providerMeta } = await provider({ prompt, inputPayload, trace }));
    } else if (fallback) {
      rawOutput = await fallback({ prompt, inputPayload, trace, mode });
      modelUsed = 'deterministic_fallback';
      providerMeta = { fallback: true };
    } else {
      throw new Error('Fallback requested but not supplied');
    }

    let parsedOutput = rawOutput;
    if (typeof rawOutput === 'string') {
      try {
        parsedOutput = JSON.parse(rawOutput);
      } catch (err) {
        parsedOutput = { text: rawOutput };
      }
    }

    const validatorReport = await runWatchtowers({
      tier,
      schema,
      output: parsedOutput,
      context: { prompt, inputPayload, riskScores, taskLabel, payloadType },
    });

    const latencyMs = Math.round(performance.now() - attemptStart);
    const summary = {
      trace_id: trace.traceId,
      tier,
      risk_scores: riskScores,
      status: validatorReport.passed ? (mode === 'primary' ? 'ok' : 'fallback_ok') : 'rewrite',
      output_json: parsedOutput,
      model_used: modelUsed,
      latency_ms: latencyMs,
      cost_estimate: providerMeta.estimatedCost ?? 0,
      validator_results: validatorReport.results,
      required_disclaimers: validatorReport.disclaimers,
      next_allowed_actions: validatorReport.nextAllowedActions,
    };
    return summary;
  }

  try {
    const primary = await executeAttempt({ mode: 'primary' });
    if (primary.status === 'ok') {
      logInfo('Governed execution ok', { traceId: primary.trace_id, tier });
      return primary;
    }

    if (fallback) {
      logWarn('Primary execution failed validation, attempting fallback', {
        traceId: primary.trace_id,
        tier,
        failures: primary.validator_results,
      });
      const fallbackResult = await executeAttempt({ mode: 'fallback' });
      if (fallbackResult.status === 'fallback_ok') {
        return fallbackResult;
      }
      fallbackResult.status = 'blocked';
      return fallbackResult;
    }

    primary.status = 'blocked';
    return primary;
  } catch (err) {
    return {
      trace_id: trace.traceId,
      tier,
      risk_scores: riskScores,
      status: 'blocked',
      error: err.message,
      validator_results: [],
      required_disclaimers: [],
      next_allowed_actions: ['review_prompt'],
    };
  }
}
