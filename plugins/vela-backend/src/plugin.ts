import {
  coreServices,
  createBackendPlugin,
} from '@backstage/backend-plugin-api';
import { createRouter } from './router';

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
      },
      async init({ httpAuth, httpRouter, config }) {
        httpRouter.use(
          await createRouter({
            httpAuth,
            config,
          }),
        );
      },
    });
  },
});
