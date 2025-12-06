import {
  createPlugin,
  createRoutableExtension,
} from '@backstage/core-plugin-api';

import { rootRouteRef } from './routes';

export const velaApiSpecPlugin = createPlugin({
  id: 'vela-api-spec',
  routes: {
    root: rootRouteRef,
  },
});

export const VelaApiSpecPage = velaApiSpecPlugin.provide(
  createRoutableExtension({
    name: 'VelaApiSpecPage',
    component: () =>
      import('./components/VelaApiSpecPage').then(m => m.VelaApiSpecPage),
    mountPoint: rootRouteRef,
  }),
);
