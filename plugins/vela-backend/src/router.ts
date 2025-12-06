import { HttpAuthService } from '@backstage/backend-plugin-api';
import { InputError } from '@backstage/errors';
import { Config } from '@backstage/config';
import express from 'express';
import Router from 'express-promise-router';
import { JinaReader } from './service/modules/radar/JinaReader';
import { DataAnalyzer } from './service/modules/radar/DataAnalyzer';
import { SpecGenerator } from './service/modules/radar/SpecGenerator';
import { ContentAnalyzer } from './service/modules/radar/ContentAnalyzer';

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
  const specGenerator = new SpecGenerator(config);
  const contentAnalyzer = new ContentAnalyzer(config);

  router.get('/health', (_, res) => {
    res.json({ status: 'ok' });
  });

  // Middleware to optionally extract credentials without failing
  const optionalAuth = async (req: express.Request) => {
    try {
      return await httpAuth.credentials(req, { allow: ['user', 'service'] });
    } catch {
      return undefined;
    }
  };

  router.post('/radar/scrape', async (req, res) => {
    try {
      await optionalAuth(req);
      const { url } = req.body;
      if (!url) {
        throw new InputError('Missing url field');
      }
      const result = await jinaReader.scrape(url);
      res.json(result);
    } catch (error) {
      res.status(500).json({ 
        error: error instanceof Error ? error.message : 'Unknown error' 
      });
    }
  });

  router.post('/radar/analyze', async (req, res) => {
    try {
      await optionalAuth(req);
      const { text } = req.body;
      if (!text) {
        throw new InputError('Missing text field');
      }
      const result = await dataAnalyzer.analyzeText(text);
      res.json(result);
    } catch (error) {
      res.status(500).json({ 
        error: error instanceof Error ? error.message : 'Unknown error' 
      });
    }
  });

  router.post('/radar/analyze-sentiment', async (req, res) => {
    console.log('🔵 /radar/analyze-sentiment endpoint called');
    try {
      await optionalAuth(req);
      const { texts, model } = req.body;
      console.log('  - Texts count:', texts?.length);
      console.log('  - Model:', model);
      console.log('  - First 2 texts:', texts?.slice(0, 2));
      
      if (!texts || !Array.isArray(texts)) {
        console.error('  ❌ Invalid texts field');
        throw new InputError('Missing or invalid texts field');
      }

      console.log('  - Calling dataAnalyzer.analyzeSentiment...');
      const result = await dataAnalyzer.analyzeSentiment(texts, model);
      console.log('  - Result length:', Array.isArray(result) ? result.length : 'not array');
      console.log('  - First 2 results:', Array.isArray(result) ? result.slice(0, 2) : result);
      
      res.json(result);
    } catch (error) {
      console.error('  ❌ Error in analyze-sentiment:', error);
      res.status(500).json({ 
        error: error instanceof Error ? error.message : 'Unknown error' 
      });
    }
  });

  router.post('/radar/analyze-topics', async (req, res) => {
    try {
      await optionalAuth(req);
      const { texts, model } = req.body;
      if (!texts || !Array.isArray(texts)) {
        throw new InputError('Missing or invalid texts field');
      }

      const result = await dataAnalyzer.analyzeTopics(texts, model);
      res.json(result);
    } catch (error) {
      res.status(500).json({ 
        error: error instanceof Error ? error.message : 'Unknown error' 
      });
    }
  });

  router.post('/radar/generate-spec', async (req, res) => {
    try {
      await optionalAuth(req);
      const { content, type, model, context } = req.body;
      
      if (!content) {
        throw new InputError('Missing content field');
      }
      if (!type || !['requirements', 'design', 'tasks'].includes(type)) {
        throw new InputError('Invalid or missing type field. Must be: requirements, design, or tasks');
      }
      if (!model) {
        throw new InputError('Missing model field');
      }

      const result = await specGenerator.generateSpec({
        content,
        type,
        model,
        context,
      });
      
      res.json(result);
    } catch (error) {
      res.status(500).json({ 
        error: error instanceof Error ? error.message : 'Unknown error' 
      });
    }
  });

  router.post('/radar/analyze-content', async (req, res) => {
    try {
      await optionalAuth(req);
      const { content, url, model } = req.body;
      
      if (!content) {
        throw new InputError('Missing content field');
      }
      if (!url) {
        throw new InputError('Missing url field');
      }
      if (!model) {
        throw new InputError('Missing model field');
      }

      const result = await contentAnalyzer.analyzeContent({
        content,
        url,
        model,
      });
      
      res.json(result);
    } catch (error) {
      res.status(500).json({ 
        error: error instanceof Error ? error.message : 'Unknown error' 
      });
    }
  });

  return router;
}
