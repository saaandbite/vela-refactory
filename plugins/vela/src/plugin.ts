import {
  createPlugin,
  createRoutableExtension,
  createApiFactory,
  discoveryApiRef,
  fetchApiRef,
} from '@backstage/core-plugin-api';

import { rootRouteRef } from './routes';
import { velaApiRef, VelaClient } from './api/VelaApi';

export const velaPlugin = createPlugin({
  id: 'vela',
  routes: {
    root: rootRouteRef,
  },
  apis: [
    createApiFactory({
      api: velaApiRef,
      deps: { discoveryApi: discoveryApiRef, fetchApi: fetchApiRef },
      factory: ({ discoveryApi, fetchApi }) =>
        new VelaClient({ discoveryApi, fetchApi }),
    }),
  ],
});

export const VelaPage = velaPlugin.provide(
  createRoutableExtension({
    name: 'VelaPage',
    component: () =>
      import('./components/Radar/RadarPage').then(m => m.RadarPage),
    mountPoint: rootRouteRef,
  }),
);
