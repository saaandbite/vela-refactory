import {
  mockErrorHandler,
  mockServices,
} from '@backstage/backend-test-utils';
import express from 'express';
import request from 'supertest';
import { createRouter } from './router';
import { ChatService } from './services/ChatService';
import { ConfigReader } from '@backstage/config';

describe('createRouter', () => {
  let app: express.Express;
  let chatService: jest.Mocked<ChatService>;

  beforeEach(async () => {
    chatService = {
      findOrCreateUser: jest.fn(),
      createChatSession: jest.fn(),
      addChatMessage: jest.fn(),
      listChatSessions: jest.fn(),
      listChatMessages: jest.fn(),
    };

    const router = await createRouter({
      httpAuth: mockServices.httpAuth(),
      config: new ConfigReader({}),
      logger: mockServices.logger.mock(),
      chatService,
    });
    app = express();
    app.use(router);
    app.use(mockErrorHandler());
  });

  describe('POST /chat/sessions', () => {
    it('should create a chat session', async () => {
      const user = { id: 1, github_username: 'test', backstage_user_ref: 'user:default/test' };
      const session = { id: 'uuid', user_id: 1, title: 'Test Session' };
      chatService.findOrCreateUser.mockResolvedValue(user);
      chatService.createChatSession.mockResolvedValue(session);

      const response = await request(app)
        .post('/chat/sessions')
        .send({ title: 'Test Session' });

      expect(response.status).toBe(201);
      expect(response.body).toEqual(session);
    });
  });
});