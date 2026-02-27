const form = document.getElementById('config-form');
const responseEl = document.getElementById('response');
const runsEl = document.getElementById('runs');
const logViewEl = document.getElementById('log-view');
const ledgerStatusEl = document.getElementById('ledger-status');

function serializeForm(formEl) {
  const formData = new FormData(formEl);
  const payload = {
    schema_id: 'ssf_carousel_v1',
    channel: formData.get('channel'),
    carouselLength: Number(formData.get('carouselLength')),
    variantCount: Number(formData.get('variantCount')),
    trendSkin: formData.get('trendSkin'),
    destinationUrl: formData.get('destinationUrl'),
  };
  const serviceFields = ['serviceName', 'coreProblem', 'flatRatePrice', 'buyerType'];
  const shopFields = ['productName', 'offerSummary', 'price'];
  serviceFields.forEach((field) => {
    const value = formData.get(field);
    if (value) payload[field] = value;
  });
  shopFields.forEach((field) => {
    const value = formData.get(field);
    if (value) payload[field] = value;
  });
  const includesBullets = formData.get('includesBullets')?.split('\n').map((s) => s.trim()).filter(Boolean);
  const whoItsForBullets = formData.get('whoItsForBullets')?.split('\n').map((s) => s.trim()).filter(Boolean);
  if (includesBullets?.length) payload.includesBullets = includesBullets;
  if (whoItsForBullets?.length) payload.whoItsForBullets = whoItsForBullets;
  return payload;
}

async function fetchLedgerHead() {
  try {
    const res = await fetch('/logs/ledger-head.json');
    if (!res.ok) return;
    const data = await res.json();
    ledgerStatusEl.textContent = `Ledger Head #${data.index} — ${data.hash.slice(0, 10)}...`;
  } catch (err) {
    console.warn('Ledger head fetch failed');
  }
}

async function loadRuns() {
  try {
    const res = await fetch('/logs/index.json');
    if (!res.ok) return;
    const data = await res.json();
    runsEl.innerHTML = '';
    data.slice(-10).reverse().forEach((run) => {
      const card = document.createElement('div');
      card.className = 'run-card';
      card.innerHTML = `<strong>${run.runId}</strong><br/><small>${run.createdAt}</small>`;
      card.addEventListener('click', () => loadRunLog(run.runId));
      runsEl.appendChild(card);
    });
  } catch (err) {
    console.warn('Unable to load runs');
  }
}

async function loadRunLog(runId) {
  try {
    const res = await fetch(`/logs/${runId}.json`);
    if (!res.ok) {
      logViewEl.textContent = 'No logs found.';
      return;
    }
    const data = await res.json();
    logViewEl.textContent = JSON.stringify(data, null, 2);
  } catch (err) {
    logViewEl.textContent = 'Failed to load log.';
  }
}

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  responseEl.textContent = 'Generating…';
  const payload = serializeForm(form);
  try {
    const res = await fetch('/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const error = await res.json();
      responseEl.textContent = `Error: ${error.error}`;
      return;
    }
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'ssf-carousel.zip';
    a.click();
    URL.revokeObjectURL(url);
    responseEl.textContent = 'ZIP ready. Check downloads.';
    await loadRuns();
  } catch (err) {
    responseEl.textContent = 'Generation failed.';
  }
});

fetchLedgerHead();
loadRuns();
setInterval(fetchLedgerHead, 15000);
setInterval(loadRuns, 20000);
