import { createDevApp } from '@backstage/dev-utils';
import { velaApiSpecPlugin, VelaApiSpecPage } from '../src/plugin';

createDevApp()
  .registerPlugin(velaApiSpecPlugin)
  .addPage({
    element: <VelaApiSpecPage />,
    title: 'Vela API Spec',
    path: '/vela-api-spec',
  })
  .render();
