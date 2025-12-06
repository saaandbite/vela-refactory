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

    await httpAuth.credentials(req, { allow: ['user'] });

    const result = await dataAnalyzer.analyzeText(text);
    res.json(result);
  });

  router.post('/radar/analyze-sentiment', async (req, res) => {
    try {
      const { texts, model } = req.body;
      if (!texts || !Array.isArray(texts)) {
        throw new InputError('Missing or invalid texts field');
      }

      // Optional auth check
      try {
        await httpAuth.credentials(req, { allow: ['user'] });
      } catch {
        // Allow unauthenticated for now
      }

      const result = await dataAnalyzer.analyzeSentiment(texts, model);
      res.json(result);
    } catch (error) {
      res.status(500).json({ 
        error: error instanceof Error ? error.message : 'Unknown error' 
      });
    }
  });

  router.post('/radar/analyze-topics', async (req, res) => {
    try {
      const { texts, model } = req.body;
      if (!texts || !Array.isArray(texts)) {
        throw new InputError('Missing or invalid texts field');
      }

      // Optional auth check
      try {
        await httpAuth.credentials(req, { allow: ['user'] });
      } catch {
        // Allow unauthenticated for now
      }

      const result = await dataAnalyzer.analyzeTopics(texts, model);
      res.json(result);
    } catch (error) {
      res.status(500).json({ 
        error: error instanceof Error ? error.message : 'Unknown error' 
      });
    }
  });

  return router;
}
