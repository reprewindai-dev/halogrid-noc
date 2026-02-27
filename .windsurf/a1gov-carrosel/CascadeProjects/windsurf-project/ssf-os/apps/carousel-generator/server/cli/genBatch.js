#!/usr/bin/env node

import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import chalk from 'chalk';
import { generateBatch } from '../services/generationService.js';
import { validateConfig, configSchema } from '../lib/configSchema.js';
import { OUTPUT_ROOT } from '../../../../platform/sdk/utils/paths.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const argv = yargs(hideBin(process.argv))
  .option('input', {
    alias: 'i',
    type: 'string',
    demandOption: true,
    description: 'Path to JSON batch file with array of configs',
  })
  .help()
  .parseSync();

async function run() {
  const inputPath = path.resolve(argv.input);
  if (!(await fs.pathExists(inputPath))) {
    console.error(chalk.red(`Batch file not found: ${inputPath}`));
    process.exit(1);
  }
  const rawBatch = await fs.readJson(inputPath);
  if (!Array.isArray(rawBatch) || rawBatch.length === 0) {
    console.error(chalk.red('Batch file must contain a non-empty array of configs'));
    process.exit(1);
  }
  rawBatch.forEach((payload) => configSchema.parse(payload));
  console.log(chalk.blue(`Starting batch of ${rawBatch.length} runs…`));
  try {
    const batch = await generateBatch({ runs: rawBatch });
    const batchZipPath = path.join(OUTPUT_ROOT, 'batch.zip');
    await fs.writeFile(batchZipPath, batch.buffer);
    console.log(chalk.green(`✅ Batch complete`));
    console.log(chalk.cyan(`📦 Batch ZIP written to: ${batchZipPath}`));
    console.log(chalk.gray(`📊 Runs: ${batch.outputs.length}`));
    batch.outputs.forEach((out) => {
      console.log(chalk.gray(`   - ${out.runId}`));
    });
  } catch (err) {
    console.error(chalk.red('Batch generation failed:'), err.message);
    process.exit(1);
  }
}

await fs.ensureDir(OUTPUT_ROOT);
await run();
