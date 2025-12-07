import { HttpAuthService, LoggerService } from '@backstage/backend-plugin-api';
import { InputError } from '@backstage/errors';
import { Config } from '@backstage/config';
import express from 'express';
import Router from 'express-promise-router';
import { JinaReader } from './service/modules/radar/JinaReader';
import { DataAnalyzer } from './service/modules/radar/DataAnalyzer';
import { SpecGenerator } from './service/modules/radar/SpecGenerator';
import { ContentAnalyzer } from './service/modules/radar/ContentAnalyzer';
import { ChatService } from './services/ChatService'; // Import the new ChatService

export interface RouterOptions {
  httpAuth: HttpAuthService;
  config: Config;
  logger: LoggerService;
  chatService: ChatService; // Add chatService to options
}

export async function createRouter(
  options: RouterOptions,
): Promise<express.Router> {
  const { httpAuth, config, logger, chatService } = options; // Destructure chatService

  const router = Router();
  router.use(express.json());

  const jinaReader = new JinaReader(config);
  const dataAnalyzer = new DataAnalyzer(config);
  const specGenerator = new SpecGenerator(config);
  const contentAnalyzer = new ContentAnalyzer(config);

  router.get('/health', (_, res) => {
    res.json({ status: 'ok' });
  });

  // Middleware to extract credentials and user info
  const getAuthenticatedUser = async (req: express.Request) => {
    const credentials = await httpAuth.credentials(req, { allow: ['user'] });
    if (!credentials || credentials.principal.type !== 'user') {
      throw new InputError('Authentication required');
    }
    const backstageUserRef = credentials.principal.userEntityRef;
    const githubUsername = backstageUserRef.split('/').pop(); // Assuming user:default/github_username

    if (!githubUsername) {
      throw new InputError('Could not determine GitHub username from user entity ref');
    }

    // Find or create user in our database
    const user = await chatService.findOrCreateUser({
      github_username: githubUsername,
      backstage_user_ref: backstageUserRef,
      // display_name and avatar_url can be fetched from Backstage's catalog if needed
    });
    return user;
  };

  // --- Chat Endpoints ---
  router.post('/chat/sessions', async (req, res) => {
    logger.info('POST /chat/sessions called');
    try {
      const user = await getAuthenticatedUser(req);
      const { title } = req.body;
      if (!title) {
        throw new InputError('Missing title field for chat session');
      }
      const session = await chatService.createChatSession(user.id!, title);
      res.status(201).json(session);
    } catch (error) {
      logger.error(`Error creating chat session: ${error}`);
      res.status(500).json({ error: error instanceof Error ? error.message : 'Unknown error' });
    }
  });

  router.get('/chat/sessions', async (req, res) => {
    logger.info('GET /chat/sessions called');
    try {
      const user = await getAuthenticatedUser(req);
      const sessions = await chatService.listChatSessions(user.id!);
      res.json(sessions);
    } catch (error) {
      logger.error(`Error listing chat sessions: ${error}`);
      res.status(500).json({ error: error instanceof Error ? error.message : 'Unknown error' });
    }
  });

  router.post('/chat/sessions/:sessionId/messages', async (req, res) => {
    logger.info(`POST /chat/sessions/${req.params.sessionId}/messages called`);
    try {
      await getAuthenticatedUser(req); // Ensure user is authenticated
      const { sessionId } = req.params;
      const { input_prompt, output_content, output_type, status, error_message } = req.body;

      if (!sessionId) {
        throw new InputError('Missing sessionId parameter');
      }
      if (!status || (status !== 'completed' && status !== 'failed' && status !== 'pending')) {
        throw new InputError('Invalid or missing status field. Must be: completed, failed, or pending');
      }

      const message = await chatService.addChatMessage({
        session_id: sessionId,
        input_prompt,
        output_content,
        output_type,
        status,
        error_message,
      });
      res.status(201).json(message);
    } catch (error) {
      logger.error(`Error adding chat message: ${error}`);
      res.status(500).json({ error: error instanceof Error ? error.message : 'Unknown error' });
    }
  });

  router.get('/chat/sessions/:sessionId/messages', async (req, res) => {
    logger.info(`GET /chat/sessions/${req.params.sessionId}/messages called`);
    try {
      await getAuthenticatedUser(req); // Ensure user is authenticated
      const { sessionId } = req.params;
      if (!sessionId) {
        throw new InputError('Missing sessionId parameter');
      }
      const messages = await chatService.listChatMessages(sessionId);
      res.json(messages);
    } catch (error) {
      logger.error(`Error listing chat messages: ${error}`);
      res.status(500).json({ error: error instanceof Error ? error.message : 'Unknown error' });
    }
  });
  // --- End Chat Endpoints ---

  // Middleware to optionally extract credentials without failing (for existing radar endpoints)
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
    logger.info('🔵 /radar/analyze-sentiment endpoint called');
    try {
      await optionalAuth(req);
      const { texts, model } = req.body;
      logger.info(`  - Texts count: ${texts?.length}`);
      logger.info(`  - Model: ${model}`);
      
      if (!texts || !Array.isArray(texts)) {
        logger.error('  ❌ Invalid texts field');
        throw new InputError('Missing or invalid texts field');
      }

      logger.info('  - Calling dataAnalyzer.analyzeSentiment...');
      const result = await dataAnalyzer.analyzeSentiment(texts, model);
      
      res.json(result);
    } catch (error) {
      logger.error(`  ❌ Error in analyze-sentiment: ${error}`);
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
