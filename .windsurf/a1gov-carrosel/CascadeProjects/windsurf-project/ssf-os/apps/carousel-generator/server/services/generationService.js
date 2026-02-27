import path from 'path';
import fs from 'fs-extra';
import archiver from 'archiver';
import { PassThrough } from 'stream';
import { chromium } from 'playwright';
import { validateConfig } from '../lib/configSchema.js';
import { resolveVariantLabels, buildSlides } from '../lib/blueprints.js';
import { generateVariantSlides } from '../lib/copyWriter.js';
import { resolveBackgroundStyle } from '../lib/backgrounds.js';
import { buildCopyArtifacts } from '../lib/copyArtifacts.js';
import { buildSlideHtml } from '../lib/renderSlide.js';
import { createRunId } from '../lib/id.js';
import { OUTPUT_ROOT, DATA_ROOT } from '../../../../platform/sdk/utils/paths.js';
import { commitConstitutionalWrite } from '../../../../platform/sdk/governance/commitConstitutionalWrite.js';
import {
  appendRunCsv,
  persistRunLog,
  updateLogIndex,
  updateLedgerHeadSnapshot,
} from '../../../../platform/sdk/ledger/runLogger.js';
import { recordMemoryStub } from '../../../../platform/sdk/memory/memoryFabric.js';
import { getLedgerHead } from '../../../../platform/sdk/ledger/ledgerStore.js';
import { sendRunMetadata } from '../../../../platform/sdk/providers/byosConnector.js';
import { hashPayload } from '../../../../platform/sdk/utils/hash.js';
import { loadPolicies } from '../../../../platform/sdk/policy_registry/index.js';
import { enforceStateTransition } from '../../../../platform/sdk/state_machine/stateMachine.js';

const VARIANT_DIR_MAP = {
  A: 'A',
  B: 'B',
  C: 'C',
  D: 'D',
  E: 'E',
};

async function ensureOutputRoot() {
  await fs.ensureDir(OUTPUT_ROOT);
}

function padSlideNumber(num) {
  return num.toString().padStart(2, '0');
}

async function captureSlide({ browser, html, runId, variantLabel, slideNumber, traceId }) {
  const page = await browser.newPage({
    viewport: { width: 1000, height: 1500, deviceScaleFactor: 2 },
  });
  await page.setContent(html, { waitUntil: 'networkidle' });
  const buffer = await page.screenshot({ type: 'png' });
  await page.close();
  const targetPath = path.join(OUTPUT_ROOT, runId, VARIANT_DIR_MAP[variantLabel], `${padSlideNumber(slideNumber)}.png`);
  await commitConstitutionalWrite({ targetPath, content: buffer, traceId: `${runId}:${variantLabel}:${slideNumber}` });
  return targetPath;
}

async function writeTextArtifact({ runId, filename, content, traceId }) {
  const targetPath = path.join(OUTPUT_ROOT, runId, filename);
  await commitConstitutionalWrite({ targetPath, content, traceId });
  return targetPath;
}

async function writeJsonArtifact({ runId, filename, data, traceId }) {
  const targetPath = path.join(OUTPUT_ROOT, runId, filename);
  await commitConstitutionalWrite({ targetPath, content: JSON.stringify(data, null, 2), traceId });
  return targetPath;
}

async function buildZipBuffer(runDir) {
  const archive = archiver('zip', { zlib: { level: 9 } });
  const stream = new PassThrough();
  const chunks = [];
  const bufferPromise = new Promise((resolve, reject) => {
    stream.on('data', (chunk) => chunks.push(chunk));
    stream.on('end', () => resolve(Buffer.concat(chunks)));
    stream.on('error', reject);
  });
  archive.directory(runDir, false);
  archive.pipe(stream);
  await archive.finalize();
  const buffer = await bufferPromise;
  return buffer;
}

function collectDisclaimers(...lists) {
  const set = new Set();
  lists.flat().filter(Boolean).forEach((item) => set.add(item));
  return Array.from(set);
}

export async function generateRun({ config: rawConfig }) {
  await ensureOutputRoot();
  const config = validateConfig(rawConfig);
  const runId = createRunId();
  const policyData = await loadPolicies();
  const policyVersion = policyData.version;
  const ledgerHeadBefore = await getLedgerHead();
  const variantLabels = resolveVariantLabels(config.variantCount);
  const runDir = path.join(OUTPUT_ROOT, runId);
  await fs.ensureDir(runDir);
  for (const label of variantLabels) {
    const dirName = VARIANT_DIR_MAP[label];
    if (!dirName) throw new Error(`Missing directory mapping for variant ${label}`);
    await fs.ensureDir(path.join(runDir, dirName));
  }

  let state = 'INIT';
  const transition = (next) => {
    enforceStateTransition({ currentState: state, nextState: next });
    state = next;
  };

  transition('VALIDATING');
  const browser = await chromium.launch({ headless: true });
  const variantOutputs = [];
  const governanceSummaries = [];
  const backgroundSummaries = [];
  const slideAssets = [];
  try {
    transition('RENDERING');
    for (const variantLabel of variantLabels) {
      const variantResult = await generateVariantSlides({ config, variantLabel });
      variantOutputs.push(variantResult);
      governanceSummaries.push({ variant: variantLabel, governance: variantResult.governance });
      const slides = variantResult.slides || buildSlides({ config, variantLabel });
      let slideNumber = 1;
      for (const slide of slides) {
        const { backgroundStyle, governance } = await resolveBackgroundStyle({
          config,
          slide,
          variantLabel,
          slideIndex: slideNumber - 1,
        });
        backgroundSummaries.push({ variant: variantLabel, slideNumber, governance });
        const html = buildSlideHtml({ config, slide, variantLabel, slideIndex: slideNumber - 1, backgroundStyle });
        const pngPath = await captureSlide({
          browser,
          html,
          runId,
          variantLabel,
          slideNumber,
          traceId: runId,
        });
        slideAssets.push({ variant: variantLabel, slideNumber, path: pngPath });
        slideNumber += 1;
      }
    }
    transition('ASSEMBLING');
    const copyArtifacts = buildCopyArtifacts({ config, variantOutputs });
    const globalDisclaimers = collectDisclaimers(
      ...governanceSummaries.map((g) => g.governance?.required_disclaimers || []),
      ...backgroundSummaries.map((b) => b.governance?.required_disclaimers || [])
    );
    if (globalDisclaimers.length) {
      copyArtifacts.pinCopy = `${copyArtifacts.pinCopy}\n\n### Disclaimers\n${globalDisclaimers
        .map((d) => `- ${d}`)
        .join('\n')}`;
    }
    const pinCopyPath = await writeTextArtifact({ runId, filename: 'pin_copy.txt', content: copyArtifacts.pinCopy, traceId: runId });
    const boardsPath = await writeTextArtifact({ runId, filename: 'boards.txt', content: copyArtifacts.boards, traceId: runId });
    const keywordsPath = await writeJsonArtifact({ runId, filename: 'keywords.json', data: copyArtifacts.keywords, traceId: runId });

    const runLog = {
      runId,
      policyVersion,
      channel: config.channel,
      carouselLength: config.carouselLength,
      variantCount: config.variantCount,
      trendSkin: config.trendSkin,
      destinationUrl: config.destinationUrl,
      variantOutputs: variantOutputs.map(({ variant, governance, slides }) => ({
        variant,
        slides,
        governance,
      })),
      copyArtifacts,
      backgroundSummaries,
      policyRegistry: policyData,
      disclaimers: globalDisclaimers,
      createdAt: new Date().toISOString(),
      ledgerHeadBefore,
    };

    await writeJsonArtifact({ runId, filename: 'run_log.json', data: runLog, traceId: runId });
    const runsCsvPath = path.join(DATA_ROOT, 'runs.csv');
    const csvBuffer = await fs.readFile(runsCsvPath);
    await commitConstitutionalWrite({
      targetPath: path.join(runDir, 'runs.csv'),
      content: csvBuffer,
      traceId: runId,
    });

    transition('FINALIZING');
    const zipBuffer = await buildZipBuffer(runDir);
    const zipPath = path.join(OUTPUT_ROOT, `${runId}.zip`);
    await commitConstitutionalWrite({ targetPath: zipPath, content: zipBuffer, traceId: runId });
    transition('COMPLETE');

    await appendRunCsv({
      runId,
      channel: config.channel,
      carouselLength: config.carouselLength,
      trendSkin: config.trendSkin,
      status: 'complete',
    });

    await persistRunLog({ runId, payload: runLog });

    const ledgerHeadAfter = await getLedgerHead();
    await updateLedgerHeadSnapshot(ledgerHeadAfter);
    const configHash = hashPayload(config);
    const outputHash = hashPayload(runLog);

    await recordMemoryStub({
      runId,
      inputHash: configHash,
      outputHash,
      tier: governanceSummaries[0]?.governance?.tier || 'Tier0',
      channel: config.channel,
    });

    await sendRunMetadata({
      runId,
      hashes: { configHash, outputHash },
      ledgerHead: ledgerHeadAfter,
      tier: governanceSummaries[0]?.governance?.tier || 'Tier0',
      status: 'complete',
    });

    await updateLogIndex({
      runId,
      channel: config.channel,
      trendSkin: config.trendSkin,
      variantCount: config.variantCount,
      carouselLength: config.carouselLength,
      createdAt: runLog.createdAt,
      zipPath,
      status: 'complete',
    });

    return {
      runId,
      zipPath,
      runDir,
      copyArtifactsPaths: { pinCopyPath, boardsPath, keywordsPath },
      slideAssets,
      governanceSummaries,
      backgroundSummaries,
      runLog,
      ledgerHeadAfter,
    };
  } catch (err) {
    await appendRunCsv({
      runId,
      channel: rawConfig.channel || 'UNKNOWN',
      carouselLength: rawConfig.carouselLength || 5,
      trendSkin: rawConfig.trendSkin || 'CLEAN_MINIMAL_PRO',
      status: 'failed',
    });
    await updateLogIndex({
      runId,
      channel: rawConfig.channel || 'UNKNOWN',
      trendSkin: rawConfig.trendSkin || 'CLEAN_MINIMAL_PRO',
      variantCount: rawConfig.variantCount || 1,
      carouselLength: rawConfig.carouselLength || 5,
      createdAt: new Date().toISOString(),
      status: 'failed',
      error: err.message,
    });
    throw err;
  } finally {
    await browser.close();
  }
}

export async function generateBatch({ runs }) {
  const outputs = [];
  for (const config of runs) {
    const result = await generateRun({ config });
    outputs.push(result);
  }
  const archive = archiver('zip', { zlib: { level: 9 } });
  const stream = new PassThrough();
  const chunks = [];
  const bufferPromise = new Promise((resolve, reject) => {
    stream.on('data', (chunk) => chunks.push(chunk));
    stream.on('end', () => resolve(Buffer.concat(chunks)));
    stream.on('error', reject);
  });
  archive.pipe(stream);
  for (const output of outputs) {
    archive.directory(output.runDir, `run_${output.runId}`);
  }
  await archive.finalize();
  const buffer = await bufferPromise;
  return { outputs, buffer };
}
