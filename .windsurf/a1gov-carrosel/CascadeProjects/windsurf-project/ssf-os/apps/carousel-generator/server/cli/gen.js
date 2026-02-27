#!/usr/bin/env node

import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import chalk from 'chalk';
import { generateRun } from '../services/generationService.js';
import { validateConfig } from '../lib/configSchema.js';
import { OUTPUT_ROOT } from '../../../../platform/sdk/utils/paths.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const argv = yargs(hideBin(process.argv))
  .option('config', {
    alias: 'c',
    type: 'string',
    demandOption: true,
    description: 'Path to JSON config file',
  })
  .help()
  .parseSync();

async function run() {
  const configPath = path.resolve(argv.config);
  if (!(await fs.pathExists(configPath))) {
    console.error(chalk.red(`Config file not found: ${configPath}`));
    process.exit(1);
  }
  const rawConfig = await fs.readJson(configPath);
  const config = validateConfig(rawConfig);
  console.log(chalk.blue('Starting generation…'));
  try {
    const result = await generateRun({ config });
    console.log(chalk.green(`✅ Run complete: ${result.runId}`));
    console.log(chalk.cyan(`📦 ZIP written to: ${result.zipPath}`));
    console.log(chalk.cyan(`📂 Run directory: ${result.runDir}`));
    console.log(chalk.gray(`📊 Governance tier: ${result.governanceSummaries[0]?.governance?.tier || 'unknown'}`));
    console.log(chalk.gray(`🧾 Ledger head: #${result.ledgerHeadAfter.index}`));
  } catch (err) {
    console.error(chalk.red('Generation failed:'), err.message);
    process.exit(1);
  }
}

await fs.ensureDir(OUTPUT_ROOT);
await run();
