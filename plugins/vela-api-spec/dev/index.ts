import { createBackend } from '@backstage/backend-defaults';
import { mockServices } from '@backstage/backend-test-utils';

const backend = createBackend();

// Mock auth services for development
backend.add(mockServices.auth.factory());
backend.add(mockServices.httpAuth.factory());

// Add the vela-api-spec plugin
backend.add(import('../src'));

backend.start();
