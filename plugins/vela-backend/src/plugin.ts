import {
  coreServices,
  createBackendPlugin,
} from '@backstage/backend-plugin-api';
import { createRouter } from './router';
import { DatabaseChatService } from './services/ChatService'; // Import the new ChatService

/**
 * velaBackendPlugin backend plugin
 *
 * @public
 */
export const velaBackendPlugin = createBackendPlugin({
  pluginId: 'vela-backend',
  register(env) {
    env.registerInit({
      deps: {
        httpAuth: coreServices.httpAuth,
        httpRouter: coreServices.httpRouter,
        config: coreServices.rootConfig,
        logger: coreServices.logger, // Add logger dependency
        database: coreServices.database, // Add database dependency
      },
      async init({ httpAuth, httpRouter, config, logger, database }) {
        const chatService = await DatabaseChatService.create( // Instantiate ChatService
          database,
          logger,
        );

        httpRouter.use(
          await createRouter({
            httpAuth,
            config,
            logger, // Pass logger to router
            chatService, // Pass chatService to router
          }),
        );
      },
    });
  },
});
