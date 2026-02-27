import { trendSkins } from './trendSkins.js';

function buildPinCopy({ config, variantOutputs }) {
  return variantOutputs
    .map(({ variant, slides }) => {
      const primary = slides[0];
      const ctaSlide = slides[slides.length - 1];
      const title = primary?.title || `${config.channel} Carousel`;
      const description = slides
        .map((slide) => slide.body)
        .join(' ')
        .slice(0, 500);
      const cta = ctaSlide?.body?.slice(0, 200) || `Tap ${config.destinationUrl}`;
      return [`## Variant ${variant}`, `Title: ${title}`, `Description: ${description}`, `CTA: ${cta}`].join('\n');
    })
    .join('\n\n');
}

function buildBoards({ config }) {
  if (config.channel === 'SERVICES') {
    return [
      'ShortFormFactory · Operator Workflows',
      'Agency Retainer Fuel',
      'Podcast to Pinterest Transformations',
    ].join('\n');
  }
  return [
    'SSF Shop Drops',
    'Pinterest Carousel Kits',
    `${config.productName || 'Productized Offers'} Inspiration`,
  ].join('\n');
}

function uniqueKeywords(text) {
  const words = text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter((w) => w.length > 4 && w.length < 20);
  return Array.from(new Set(words)).slice(0, 25);
}

function buildKeywords({ config, variantOutputs }) {
  const joined = variantOutputs
    .map(({ slides }) => slides.map((slide) => `${slide.title} ${slide.body}`).join(' '))
    .join(' ');
  const palette = trendSkins[config.trendSkin];
  return {
    primary: uniqueKeywords(joined).slice(0, 10),
    supporting: uniqueKeywords(joined).slice(10, 20),
    brand: ['shortformfactory', 'ssf', palette.label.toLowerCase().replace(/\s+/g, '-')],
  };
}

export function buildCopyArtifacts({ config, variantOutputs }) {
  return {
    pinCopy: buildPinCopy({ config, variantOutputs }),
    boards: buildBoards({ config, variantOutputs }),
    keywords: buildKeywords({ config, variantOutputs }),
  };
}
