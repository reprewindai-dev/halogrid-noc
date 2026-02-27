import { runGovernedExecution } from '../../../../platform/sdk/governance/runGovernedExecution.js';
import { slidesPayloadSchema } from './slidesSchema.js';
import { buildSlides } from './blueprints.js';

function buildPrompt({ config, variantLabel }) {
  const { channel, carouselLength, trendSkin, destinationUrl } = config;
  const core = channel === 'SERVICES'
    ? `You write SSF services carousels turning backlog and flat-rate pods into sharp Pinterest copy. Highlight async ops, backlog burn, transparent pricing, and ${destinationUrl}.`
    : `You write SSF Shop drops. Focus on what the product is, what is included, who it serves, comparisons, FAQs, and ${destinationUrl}.`;
  const lengthDirective = `Return exactly ${carouselLength} slides for variant ${variantLabel}.`;
  return `${core} ${lengthDirective} Keep tone premium, specific, non-generic. JSON only.`;
}

export async function generateVariantSlides({ config, variantLabel }) {
  const prompt = buildPrompt({ config, variantLabel });
  const fallback = async () => ({
    variant: variantLabel,
    channel: config.channel,
    slides: buildSlides({ config, variantLabel }),
  });
  const governance = await runGovernedExecution({
    kind: 'text',
    prompt,
    inputPayload: { config, variantLabel },
    schema: slidesPayloadSchema,
    fallback,
    taskLabel: 'carousel_copy_generation',
    payloadType: 'slides',
  });
  const payload = governance.output_json?.slides ? governance.output_json : await fallback();
  return {
    variant: variantLabel,
    slides: payload.slides,
    channel: payload.channel || config.channel,
    governance,
  };
}
