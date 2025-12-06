import { HttpAuthService } from '@backstage/backend-plugin-api';
import { InputError } from '@backstage/errors';
import { Config } from '@backstage/config';
import express from 'express';
import Router from 'express-promise-router';
import { JinaReader } from './service/modules/radar/JinaReader';
import { DataAnalyzer } from './service/modules/radar/DataAnalyzer';

export async function createRouter({
  httpAuth,
  config,
}: {
  httpAuth: HttpAuthService;
  config: Config;
}): Promise<express.Router> {
  const router = Router();
  router.use(express.json());

  const jinaReader = new JinaReader(config);
  const dataAnalyzer = new DataAnalyzer(config);

  router.get('/health', (_, res) => {
    res.json({ status: 'ok' });
  });

  router.post('/radar/scrape', async (req, res) => {
    const { url } = req.body;
    if (!url) {
      throw new InputError('Missing url field');
    }
    const result = await jinaReader.scrape(url);
    res.json(result);
  });

  router.post('/radar/analyze', async (req, res) => {
    const { text } = req.body;
    if (!text) {
      throw new InputError('Missing text field');
    }

    // Check auth if needed
    await httpAuth.credentials(req, { allow: ['user'] });

    const result = await dataAnalyzer.analyzeText(text);
    res.json(result);
  });

  return router;
}
