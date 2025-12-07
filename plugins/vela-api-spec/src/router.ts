import { HttpAuthService } from '@backstage/backend-plugin-api';
import { InputError } from '@backstage/errors';
import { Config } from '@backstage/config';
import express from 'express';
import Router from 'express-promise-router';
import { ApiSpecGenerator } from './service/ApiSpecGenerator';
import { ComponentSchemas } from './service/ComponentSchemas';
import { AIGenerator } from './service/AIGenerator';
import { GitHubService } from './service/GitHubService';
import { FormatConverter } from './utils/formatConverter';

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
  
  // Initialize GitHub service (optional - only if configured)
  let githubService: GitHubService | null = null;
  try {
    console.log('Attempting to initialize GitHubService...');
    githubService = new GitHubService(config);
    console.log('GitHubService initialized successfully!');
  } catch (error) {
    // GitHub not configured, endpoints will return appropriate errors
    console.warn('GitHub integration not configured:', error);
  }

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
    const formatted = FormatConverter.createDownloadableResponse(
      result,
      'site-config',
    );
    res.json(formatted);
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
    const formatted = FormatConverter.createDownloadableResponse(
      result,
      'page-config',
    );
    res.json(formatted);
  });

  // Generate component by type
  router.post('/generate/component/:type', async (req, res) => {
    const { type } = req.params;
    const { content } = req.body;

    if (!content) {
      throw new InputError('Missing content field');
    }

    const result = apiSpecGenerator.generateComponent(type, content);
    const formatted = FormatConverter.createDownloadableResponse(
      result,
      `${type}-component`,
    );
    res.json(formatted);
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
      const formatted = FormatConverter.createDownloadableResponse(
        result,
        'ai-site-config',
      );
      res.json(formatted);
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
      const formatted = FormatConverter.createDownloadableResponse(
        result,
        'ai-page-config',
      );
      res.json(formatted);
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
      const formatted = FormatConverter.createDownloadableResponse(
        result,
        `ai-${type}-component`,
      );
      res.json(formatted);
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
      const formatted = FormatConverter.createDownloadableResponse(
        result,
        'ai-enhanced-component',
      );
      res.json(formatted);
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
      const formatted = FormatConverter.createDownloadableResponse(
        result,
        'ai-generated',
      );
      res.json(formatted);
    } catch (error) {
      res.status(500).json({
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  });

  // ============= GitHub Integration Endpoints =============

  // Get GitHub repository info
  router.get('/github/info', async (req, res) => {
    if (!githubService) {
      throw new InputError('GitHub integration not configured');
    }

    try {
      await httpAuth.credentials(req, { allow: ['user'] });
    } catch {
      // Allow unauthenticated
    }

    const info = await githubService.getRepoInfo();
    res.json(info);
  });

  // List files in GitHub repository
  router.get('/github/files', async (req, res) => {
    if (!githubService) {
      throw new InputError('GitHub integration not configured');
    }

    try {
      await httpAuth.credentials(req, { allow: ['user'] });
    } catch {
      // Allow unauthenticated
    }

    const { path = '', branch } = req.query;
    const files = await githubService.listFiles(
      path as string,
      branch as string,
    );
    res.json({ files });
  });

  // Get file from GitHub
  router.get('/github/file', async (req, res) => {
    if (!githubService) {
      throw new InputError('GitHub integration not configured');
    }

    const { path, branch } = req.query;
    if (!path) {
      throw new InputError('Missing required query parameter: path');
    }

    try {
      await httpAuth.credentials(req, { allow: ['user'] });
    } catch {
      // Allow unauthenticated
    }

    const file = await githubService.getFile(path as string, branch as string);
    res.json(file);
  });

  // Save configuration to GitHub
  router.post('/github/save', async (req, res) => {
    if (!githubService) {
      throw new InputError('GitHub integration not configured');
    }

    const { path, content, message, branch, sha } = req.body;
    if (!path || !content || !message) {
      throw new InputError(
        'Missing required fields: path, content, message',
      );
    }

    try {
      await httpAuth.credentials(req, { allow: ['user'] });
    } catch {
      // Allow unauthenticated
    }

    const result = await githubService.saveFile({
      path,
      content: typeof content === 'string' ? content : JSON.stringify(content, null, 2),
      message,
      branch,
      sha,
    });
    res.json(result);
  });

  // Save generated config to GitHub (without strict validation)
  router.post('/github/save-config', async (req, res) => {
    if (!githubService) {
      throw new InputError('GitHub integration not configured');
    }

    const { config: siteConfig, filename, message, branch, skipValidation } = req.body;
    if (!siteConfig || !filename) {
      throw new InputError('Missing required fields: config, filename');
    }

    try {
      await httpAuth.credentials(req, { allow: ['user'] });
    } catch {
      // Allow unauthenticated
    }

    // Optional validation (skip by default for AI-generated configs)
    let validation = { valid: true, errors: [], warnings: [] };
    if (!skipValidation && skipValidation !== undefined) {
      validation = apiSpecGenerator.validateSiteConfig(siteConfig);
      if (!validation.valid) {
        const errorMessages = validation.errors?.map((err: any) => 
          typeof err === 'string' ? err : JSON.stringify(err)
        ).join(', ') || 'Unknown validation error';
        throw new InputError(`Invalid configuration: ${errorMessages}`);
      }
    }

    const commitMessage = message || `Add/Update ${filename}`;
    const content = JSON.stringify(siteConfig, null, 2);

    // Try to get existing file SHA for update
    let sha: string | undefined;
    try {
      const existingFile = await githubService.getFile(filename, branch);
      sha = existingFile.sha;
    } catch {
      // File doesn't exist, will create new
    }

    const result = await githubService.saveFile({
      path: filename,
      content,
      message: commitMessage,
      branch,
      sha,
    });

    res.json({
      ...result,
      validation,
    });
  });

  // Delete file from GitHub
  router.delete('/github/file', async (req, res) => {
    if (!githubService) {
      throw new InputError('GitHub integration not configured');
    }

    const { path, message, sha, branch } = req.body;
    if (!path || !message || !sha) {
      throw new InputError('Missing required fields: path, message, sha');
    }

    try {
      await httpAuth.credentials(req, { allow: ['user'] });
    } catch {
      // Allow unauthenticated
    }

    await githubService.deleteFile(path, message, sha, branch);
    res.json({ success: true, message: 'File deleted successfully' });
  });

  return router;
}
