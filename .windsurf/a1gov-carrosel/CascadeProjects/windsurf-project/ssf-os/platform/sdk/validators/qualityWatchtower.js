const bannedPhrases = [/lorem\s+ipsum/i, /generic\s+placeholder/i];

export async function qualityWatchtower({ output, context }) {
  const slides = Array.isArray(output?.slides) ? output.slides : null;
  if (!slides) {
    return {
      id: 'quality_watchtower',
      label: 'Quality Watchtower',
      passed: true,
      details: 'Non-slide payload; quality check skipped.',
      disclaimers: [],
    };
  }
  const issues = [];
  if (slides.length === 0) {
    issues.push('Quality: Slides missing.');
  }
  slides.forEach((slide, idx) => {
    const textBlob = `${slide.title} ${slide.body}`;
    bannedPhrases.forEach((pattern) => {
      if (pattern.test(textBlob)) {
        issues.push(`Slide ${idx + 1} contains banned placeholder text.`);
      }
    });
    if ((slide.body || '').length < 40) {
      issues.push(`Slide ${idx + 1} body too short for actionable copy.`);
    }
  });
  return {
    id: 'quality_watchtower',
    label: 'Quality Watchtower',
    passed: issues.length === 0,
    details: issues.join(' '),
    disclaimers: [],
  };
}
