import { createApiRef, DiscoveryApi } from '@backstage/core-plugin-api';

export interface VelaApiSpecApi {
  getHealth(): Promise<{ status: string; plugin: string }>;
  getSiteConfigTemplate(): Promise<any>;
  getComponentSchemas(): Promise<any>;
  getComponentSchema(type: string): Promise<any>;
  generateSiteConfig(params: any): Promise<any>;
  generatePage(params: any): Promise<any>;
  generateComponent(type: string, params: any): Promise<any>;
  validateSiteConfig(config: any): Promise<any>;
  getExample(type: string): Promise<any>;
  // AI Methods
  aiGenerateSiteConfig(params: {
    siteName: string;
    siteDescription: string;
    industry?: string;
    targetAudience?: string;
    style?: string;
  }): Promise<any>;
  aiGeneratePage(params: {
    path: string;
    title: string;
    description?: string;
    purpose?: string;
  }): Promise<any>;
  aiGenerateComponent(
    type: string,
    params: { context?: string; content?: string },
  ): Promise<any>;
  aiEnhanceComponent(component: any, instructions: string): Promise<any>;
  aiGenerateFromPrompt(prompt: string): Promise<any>;
}

export const velaApiSpecApiRef = createApiRef<VelaApiSpecApi>({
  id: 'plugin.vela-api-spec.service',
});

export class VelaApiSpecClient implements VelaApiSpecApi {
  private readonly discoveryApi: DiscoveryApi;

  constructor(options: { discoveryApi: DiscoveryApi }) {
    this.discoveryApi = options.discoveryApi;
  }

  private async fetch<T>(path: string, options?: RequestInit): Promise<T> {
    const baseUrl = await this.discoveryApi.getBaseUrl('vela-api-spec');
    const response = await fetch(`${baseUrl}${path}`, options);

    if (!response.ok) {
      throw new Error(`API request failed: ${response.statusText}`);
    }

    return response.json();
  }

  async getHealth(): Promise<{ status: string; plugin: string }> {
    return this.fetch('/health');
  }

  async getSiteConfigTemplate(): Promise<any> {
    return this.fetch('/templates/site-config');
  }

  async getComponentSchemas(): Promise<any> {
    return this.fetch('/schemas/components');
  }

  async getComponentSchema(type: string): Promise<any> {
    return this.fetch(`/schemas/components/${type}`);
  }

  async generateSiteConfig(params: any): Promise<any> {
    return this.fetch('/generate/site-config', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });
  }

  async generatePage(params: any): Promise<any> {
    return this.fetch('/generate/page', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });
  }

  async generateComponent(type: string, params: any): Promise<any> {
    return this.fetch(`/generate/component/${type}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });
  }

  async validateSiteConfig(config: any): Promise<any> {
    return this.fetch('/validate/site-config', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(config),
    });
  }

  async getExample(type: string): Promise<any> {
    return this.fetch(`/examples/${type}`);
  }

  // AI Methods
  async aiGenerateSiteConfig(params: {
    siteName: string;
    siteDescription: string;
    industry?: string;
    targetAudience?: string;
    style?: string;
  }): Promise<any> {
    return this.fetch('/ai/generate/site-config', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });
  }

  async aiGeneratePage(params: {
    path: string;
    title: string;
    description?: string;
    purpose?: string;
  }): Promise<any> {
    return this.fetch('/ai/generate/page', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });
  }

  async aiGenerateComponent(
    type: string,
    params: { context?: string; content?: string },
  ): Promise<any> {
    return this.fetch(`/ai/generate/component/${type}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });
  }

  async aiEnhanceComponent(component: any, instructions: string): Promise<any> {
    return this.fetch('/ai/enhance/component', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ component, instructions }),
    });
  }

  async aiGenerateFromPrompt(prompt: string): Promise<any> {
    return this.fetch('/ai/generate/from-prompt', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt }),
    });
  }
}
