import { runGovernedExecution } from '../../../../platform/sdk/governance/runGovernedExecution.js';
import { resolveSkin } from './trendSkins.js';

function cssFromSkin(skin, slideIndex = 0) {
  const accent = skin.palette.accent;
  const bg = skin.palette.background;
  const alt = skin.palette.accentAlt;
  const angle = 120 + slideIndex * 7;
  return `linear-gradient(${angle}deg, ${bg} 0%, ${accent} 60%, ${alt} 100%)`;
}

export async function resolveBackgroundStyle({ config, slide, variantLabel, slideIndex }) {
  const skin = resolveSkin(config.trendSkin);
  const fallback = async () => ({
    cssBackground: cssFromSkin(skin, slideIndex),
    overlay: skin.overlay,
    texture: skin.texture,
  });

  const prompt = `High-end Pinterest slide background, ${skin.label}, ${skin.prompt}. Slide context: ${slide.title}. Keep it abstract, photoreal, no text.`;
  const governance = await runGovernedExecution({
    kind: 'image',
    prompt,
    inputPayload: { channel: config.channel, trendSkin: config.trendSkin, variantLabel, slideIndex },
    fallback,
    taskLabel: 'slide_background_generation',
    payloadType: 'background',
  });

  let backgroundStyle;
  const output = governance.output_json;
  if (output?.base64) {
    backgroundStyle = {
      style: `url(data:image/png;base64,${output.base64}) center/cover no-repeat`,
      overlay: skin.overlay,
      texture: skin.texture,
      source: 'image',
    };
  } else if (output?.cssBackground) {
    backgroundStyle = {
      style: `${output.cssBackground}`,
      overlay: output.overlay || skin.overlay,
      texture: output.texture || skin.texture,
      source: 'css',
    };
  } else {
    const fallbackStyle = await fallback();
    backgroundStyle = {
      style: fallbackStyle.cssBackground,
      overlay: fallbackStyle.overlay,
      texture: fallbackStyle.texture,
      source: 'fallback',
    };
  }

  return { backgroundStyle, governance };
}
