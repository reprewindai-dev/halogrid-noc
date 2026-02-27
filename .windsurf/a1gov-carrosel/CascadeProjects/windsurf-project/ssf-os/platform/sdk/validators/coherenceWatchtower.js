export async function coherenceWatchtower({ output, context }) {
  const { inputPayload } = context;
  const slides = Array.isArray(output?.slides) ? output.slides : null;
  const issues = [];
  if (!slides) {
    return {
      id: 'coherence_watchtower',
      label: 'Coherence Watchtower',
      passed: true,
      details: 'Non-slide payload; coherence not evaluated.',
      disclaimers: [],
    };
  }
  if (slides.length === 0) {
    issues.push('Slides missing or empty.');
  }
  if (slides.some((slide) => !(slide.title && slide.body))) {
    issues.push('Each slide must include title and body.');
  }
  const channel = (inputPayload.channel || '').toLowerCase();
  const consistentChannel = !channel
    ? true
    : slides.every(
        (slide) => typeof slide.body === 'string' && slide.body.toLowerCase().includes(channel)
      );
  if (!consistentChannel) {
    issues.push('Slide content must reference the selected channel to keep intent aligned.');
  }
  return {
    id: 'coherence_watchtower',
    label: 'Coherence Watchtower',
    passed: issues.length === 0,
    details: issues.join(' '),
    disclaimers: [],
  };
}
