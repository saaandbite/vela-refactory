import { HttpAuthService } from '@backstage/backend-plugin-api';
import { InputError } from '@backstage/errors';
import { Config } from '@backstage/config';
import express from 'express';
import Router from 'express-promise-router';
import { ApiSpecGenerator } from './service/ApiSpecGenerator';
import { ComponentSchemas } from './service/ComponentSchemas';
import { AIGenerator } from './service/AIGenerator';

export async function createRouter({
  httpAuth,
  config,
}: {
  httpAuth: HttpAuthService;
  config: Config;
}): Promise<express.Router> {
  const router = Router();
  router.use(express.json());

  const apiSpecGenerator = new ApiSpecGenerator(config);
  const componentSchemas = new ComponentSchemas();
  const aiGenerator = new AIGenerator(config);

  // Health check endpoint
  router.get('/health', (_, res) => {
    res.json({ status: 'ok', plugin: 'vela-api-spec' });
  });

  // Get full site configuration template
  router.get('/templates/site-config', async (_, res) => {
    const template = apiSpecGenerator.getFullTemplate();
    res.json(template);
  });

  // Get component schemas
  router.get('/schemas/components', async (_, res) => {
    const schemas = componentSchemas.getAllSchemas();
    res.json(schemas);
  });

  // Get specific component schema
  router.get('/schemas/components/:type', async (req, res) => {
    const { type } = req.params;
    const schema = componentSchemas.getSchema(type);
    if (!schema) {
      throw new InputError(`Component type '${type}' not found`);
    }
    res.json(schema);
  });

  // Generate site config from input
  router.post('/generate/site-config', async (req, res) => {
    const { input } = req.body;
    if (!input) {
      throw new InputError('Missing input field');
    }

    // Optional auth check
    await httpAuth.credentials(req, { allow: ['user'] });

    const result = await apiSpecGenerator.generateSiteConfig(input);
    res.json(result);
  });

  // Generate page configuration
  router.post('/generate/page', async (req, res) => {
    const { path, title, description, sections } = req.body;
    if (!path || !sections) {
      throw new InputError('Missing required fields: path, sections');
    }

    const result = apiSpecGenerator.generatePage({
      path,
      title,
      description,
      sections,
    });
    res.json(result);
  });

  // Generate component by type
  router.post('/generate/component/:type', async (req, res) => {
    const { type } = req.params;
    const { content } = req.body;

    if (!content) {
      throw new InputError('Missing content field');
    }

    const result = apiSpecGenerator.generateComponent(type, content);
    res.json(result);
  });

  // Validate site configuration
  router.post('/validate/site-config', async (req, res) => {
    const { config: siteConfig } = req.body;
    if (!siteConfig) {
      throw new InputError('Missing config field');
    }

    const validation = apiSpecGenerator.validateSiteConfig(siteConfig);
    res.json(validation);
  });

  // Get example payloads
  router.get('/examples/:type', async (req, res) => {
    const { type } = req.params;
    const example = apiSpecGenerator.getExample(type);
    if (!example) {
      throw new InputError(`Example type '${type}' not found`);
    }
    res.json(example);
  });

  // ============= AI-Powered Endpoints =============

  // AI: Generate site config from natural language
  router.post('/ai/generate/site-config', async (req, res) => {
    try {
      const { siteName, siteDescription, industry, targetAudience, style } =
        req.body;
      if (!siteName || !siteDescription) {
        throw new InputError(
          'Missing required fields: siteName, siteDescription',
        );
      }

      // Optional auth check
      try {
        await httpAuth.credentials(req, { allow: ['user'] });
      } catch {
        // Allow unauthenticated for now
      }

      const result = await aiGenerator.generateSiteConfig({
        siteName,
        siteDescription,
        industry,
        targetAudience,
        style,
      });
      res.json(result);
    } catch (error) {
      res.status(500).json({
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  });

  // AI: Generate page from description
  router.post('/ai/generate/page', async (req, res) => {
    try {
      const { path, title, description, purpose } = req.body;
      if (!path || !title) {
        throw new InputError('Missing required fields: path, title');
      }

      try {
        await httpAuth.credentials(req, { allow: ['user'] });
      } catch {
        // Allow unauthenticated
      }

      const result = await aiGenerator.generatePage({
        path,
        title,
        description,
        purpose,
      });
      res.json(result);
    } catch (error) {
      res.status(500).json({
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  });

  // AI: Generate component with AI
  router.post('/ai/generate/component/:type', async (req, res) => {
    try {
      const { type } = req.params;
      const { context, content } = req.body;

      try {
        await httpAuth.credentials(req, { allow: ['user'] });
      } catch {
        // Allow unauthenticated
      }

      const result = await aiGenerator.generateComponent({
        type,
        context,
        content,
      });
      res.json(result);
    } catch (error) {
      res.status(500).json({
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  });

  // AI: Enhance existing component
  router.post('/ai/enhance/component', async (req, res) => {
    try {
      const { component, instructions } = req.body;
      if (!component || !instructions) {
        throw new InputError(
          'Missing required fields: component, instructions',
        );
      }

      try {
        await httpAuth.credentials(req, { allow: ['user'] });
      } catch {
        // Allow unauthenticated
      }

      const result = await aiGenerator.enhanceComponent(
        component,
        instructions,
      );
      res.json(result);
    } catch (error) {
      res.status(500).json({
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  });

  // AI: Generate from natural language prompt
  router.post('/ai/generate/from-prompt', async (req, res) => {
    try {
      const { prompt } = req.body;
      if (!prompt) {
        throw new InputError('Missing required field: prompt');
      }

      try {
        await httpAuth.credentials(req, { allow: ['user'] });
      } catch {
        // Allow unauthenticated
      }

      const result = await aiGenerator.generateFromPrompt(prompt);
      res.json(result);
    } catch (error) {
      res.status(500).json({
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  });

  return router;
}
