// LOCKED ARCHITECTURE: ShortFormFactory Lead Generation Only

function getBuyerLanguage(buyerType) {
  const map = {
    'Agency': { words: ['capacity', 'margin', 'scale'], focus: 'business growth' },
    'Creator': { words: ['burnout', 'hours', 'output'], focus: 'time freedom' },
    'Brand': { words: ['consistency', 'polish'], focus: 'brand quality' },
    'Coach': { words: ['authority', 'visibility'], focus: 'audience growth' }
  };
  return map[buyerType] || map.Agency;
}

function getPainHook(painFocus) {
  const hooks = {
    'Time': 'Editing eats your week.',
    'Quality': 'Your videos look amateur.',
    'Cost': 'You\'re overpaying per edit.',
    'Consistency': 'Posting randomly kills growth.'
  };
  return hooks[painFocus] || hooks.Time;
}

function getSolutionSlide(offerFocus) {
  const solutions = {
    'Repurpose': 'Turn one video into 20 assets.',
    'Smart Cut': 'Hook-first short-form edits.',
    'Full Edit': 'Done-for-you premium production.',
    'Subtitles': 'Retention-boosting captions.',
    'SFFOS': 'All-in-one video editing infrastructure.'
  };
  return solutions[offerFocus] || solutions.Repurpose;
}

function getCTA(intentStage) {
  const ctas = {
    'Discovery': 'See how it works → shortformfactory.com',
    'Validation': 'View case studies → shortformfactory.com',
    'Action': 'Start scaling → shortformfactory.com/order'
  };
  return ctas[intentStage] || ctas.Action;
}

// MODE 1: SERVICES (Lead Engine) - Aggressive Conversion Focus
function services5(config) {
  const buyerLang = getBuyerLanguage(config.buyer_type);
  const painHook = getPainHook(config.pain_focus);
  const solution = getSolutionSlide(config.offer_focus);
  const cta = getCTA(config.intent_stage);

  return [
    {
      title: painHook,
      body: `${painHook} ${buyerLang.words.join(' ')} suffer. ShortFormFactory fixes this.`
    },
    {
      title: 'Problem: Consequence',
      body: `Every delayed video costs ${buyerLang.focus}. Your pipeline bleeds opportunities daily.`
    },
    {
      title: 'Proof: Authority',
      body: `We\'ve shipped 10,000+ clips. Agencies scale 3x faster with our system.`
    },
    {
      title: 'Solution: Specific Service',
      body: solution
    },
    {
      title: 'CTA: Act Now',
      body: cta
    }
  ];
}

// MODE 2: SHOP (Utility Focus) - Tools & Templates
function shop5(config) {
  return [
    {
      title: 'Get More Done',
      body: 'Professional templates that save hours. Ready to deploy today.'
    },
    {
      title: 'The Problem',
      body: 'DIY design steals your time. Generic templates hurt your brand.'
    },
    {
      title: 'Product Features',
      body: 'Edit-ready files. Brand textures. Pro layouts. Instant download.'
    },
    {
      title: 'Benefit Stack',
      body: 'Save 12+ hours per project. Look premium. Convert better.'
    },
    {
      title: 'Buy Now',
      body: `Download instantly → ${config.destinationUrl || 'shortformfactory.com/shop'}`
    }
  ];
}

export function buildSlides({ config, variantLabel }) {
  // Hard-locked to 5 slides only
  if (config.carouselLength !== 5) {
    throw new Error('Carousel length locked to 5 slides for production consistency.');
  }

  if (config.channel === 'SERVICES') {
    return services5(config);
  }
  
  if (config.channel === 'SHOP') {
    return shop5(config);
  }

  throw new Error(`Invalid channel: ${config.channel}. Only SERVICES or SHOP allowed.`);
}

export function resolveVariantLabels(count) {
  // Simplified to single variant for production consistency
  if (count !== 1) {
    throw new Error('Variant count locked to 1 for production consistency.');
  }
  return ['A'];
}
