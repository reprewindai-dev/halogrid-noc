import express from 'express';
import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateRun, generateBatch } from './services/generationService.js';
import { validateConfig, configSchema } from './lib/configSchema.js';
import { LOG_ROOT } from '../../../platform/sdk/utils/paths.js';

const app = express();
app.use(express.json({ limit: '2mb' }));

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const clientPath = path.join(__dirname, '..', 'client');

app.use(express.static(clientPath));
app.use('/logs', express.static(LOG_ROOT));

app.post('/api/generate', async (req, res) => {
  try {
    const config = validateConfig(req.body);
    const run = await generateRun({ config });
    res.setHeader('Content-Type', 'application/zip');
    res.setHeader('Content-Disposition', `attachment; filename="${run.runId}.zip"`);
    res.send(await fs.readFile(run.zipPath));
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.post('/api/generate-batch', async (req, res) => {
  try {
    const runs = req.body?.runs;
    if (!Array.isArray(runs) || runs.length === 0) {
      return res.status(400).json({ error: 'runs must be a non-empty array' });
    }
    runs.forEach((payload) => configSchema.parse(payload));
    const batch = await generateBatch({ runs });
    res.setHeader('Content-Type', 'application/zip');
    res.setHeader('Content-Disposition', 'attachment; filename="batch.zip"');
    res.send(batch.buffer);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`SSF Carousel Generator running on port ${PORT}`);
});
