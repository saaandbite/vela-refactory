import { createDevApp } from '@backstage/dev-utils';
import { velaPlugin, VelaPage } from '../src/plugin';

createDevApp()
  .registerPlugin(velaPlugin)
  .addPage({
    element: <VelaPage />,
    title: 'Root Page',
    path: '/vela',
  })
  .render();
