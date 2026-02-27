import fs from 'fs-extra';
import path from 'path';
import { resolveSkin } from './trendSkins.js';

const cssPath = path.join(process.cwd(), 'apps', 'carousel-generator', 'templates', 'slide.css');
const baseCss = await fs.readFile(cssPath, 'utf-8');

const textureMap = {
  'subtle-grain': 'radial-gradient(circle at 20% 20%, rgba(255,255,255,0.12), transparent 60%), radial-gradient(circle at 80% 0%, rgba(255,255,255,0.2), transparent 45%)',
  'frosted-glass': 'linear-gradient(120deg, rgba(255,255,255,0.2), rgba(255,255,255,0)), radial-gradient(circle, rgba(255,255,255,0.15), transparent 60%)',
  'glossy-bubbles': 'radial-gradient(circle at 30% 20%, rgba(255,255,255,0.35), transparent 55%), radial-gradient(circle at 70% 30%, rgba(255,255,255,0.25), transparent 60%)',
  'neon-noise': 'linear-gradient(45deg, rgba(255,255,255,0.08), rgba(0,0,0,0.08)), repeating-linear-gradient(135deg, rgba(255,255,255,0.05) 0, rgba(255,255,255,0.05) 2px, transparent 2px, transparent 4px)',
  'paper-grain': 'linear-gradient(180deg, rgba(0,0,0,0.07), rgba(255,255,255,0)), radial-gradient(circle, rgba(0,0,0,0.05), transparent 60%)',
  'desk-grain': 'linear-gradient(120deg, rgba(0,0,0,0.08), rgba(0,0,0,0)), radial-gradient(circle at 80% 20%, rgba(255,255,255,0.2), transparent 50%)',
};

const overlayMap = {
  'corner-badge': (variantLabel) =>
    `<div class="overlay-bar"><div class="overlay-pill">${variantLabel} / SSF</div><div class="overlay-pill">PIN READY</div></div>`,
  'vertical-bar': (variantLabel) =>
    `<div class="overlay-bar" style="align-items:flex-start"><div class="overlay-pill">${variantLabel} VARIANT</div><div class="overlay-pill" style="background:rgba(255,255,255,0.25);color:var(--text-color)">GLACIER</div></div>`,
  'pill-badge': (variantLabel) =>
    `<div class="overlay-bar"><div class="overlay-pill" style="background:rgba(0,0,0,0.4)">${variantLabel} — DROP</div></div>`,
  'angled-bar': () =>
    `<div class="overlay-bar" style="transform:rotate(-2deg)"><div class="overlay-pill">NEON OPS</div></div>`,
  'full-width-bar': () =>
    `<div class="overlay-bar" style="width:100%;align-items:flex-start"><div class="overlay-pill" style="width:100%;text-align:center">EDITORIAL LUXE</div></div>`,
  'tab-badge': (variantLabel) =>
    `<div class="overlay-bar"><div class="overlay-pill" style="border-radius:18px">${variantLabel} CREATOR STACK</div></div>`,
};

export function buildSlideHtml({ config, slide, variantLabel, slideIndex, backgroundStyle }) {
  const skin = resolveSkin(config.trendSkin);
  const rootVars = `
    :root {
      --bg-base: ${skin.palette.background};
      --bg-art: ${backgroundStyle.style};
      --accent: ${skin.palette.accent};
      --accent-alt: ${skin.palette.accentAlt};
      --text-color: ${skin.palette.text};
      --muted-text: ${skin.palette.muted};
      --texture-overlay: ${textureMap[skin.texture] || textureMap['subtle-grain']};
    }
  `;
  const overlay = overlayMap[skin.overlay]?.(variantLabel, slideIndex) || '';
  const callout = config.channel === 'SERVICES'
    ? `${config.serviceName || 'ShortFormFactory'} · ${config.flatRatePrice || 'Flat retainer'} · ${config.destinationUrl.replace('https://', '')}`
    : `${config.productName || 'SSF Shop'} · ${config.price || '$297'} · ${config.destinationUrl.replace('https://', '')}`;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>SSF Carousel Slide</title>
  <style>${rootVars}${baseCss}</style>
</head>
<body>
  <div class="slide-shell">
    <div class="brand-badge">ShortFormFactory ${config.channel}</div>
    ${overlay}
    <h1 class="slide-title">${slide.title}</h1>
    <p class="slide-body">${slide.body}</p>
    <div class="callout">${callout}</div>
  </div>
</body>
</html>`;
}
