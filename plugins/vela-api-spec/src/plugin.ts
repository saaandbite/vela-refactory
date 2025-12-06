import {
  coreServices,
  createBackendPlugin,
} from '@backstage/backend-plugin-api';
import { createRouter } from './router';

/**
 * velaApiSpecPlugin backend plugin
 *
 * @public
 */
export const velaApiSpecPlugin = createBackendPlugin({
  pluginId: 'vela-api-spec',
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
