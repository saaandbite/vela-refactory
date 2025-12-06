export interface SpecDocuments {
  requirements?: string;
  design?: string;
  tasks?: string;
  metadata: {
    sourceUrl: string;
    generatedAt: Date;
    model: string;
    version: string;
  };
}

export interface JinaResponse {
  content: string;
  title: string;
  url: string;
  extractedAt: Date;
}

export interface GenerationRequest {
  content: string;
  type: 'requirements' | 'design' | 'tasks';
  model: string;
  context?: {
    requirements?: string;
    design?: string;
  };
}

export interface GenerationResponse {
  document: string;
  model: string;
  tokensUsed: number;
}

export interface CacheEntry {
  url: string;
  documents: SpecDocuments;
  jinaContent: JinaResponse;
  timestamp: number;
  ttl: number;
}

export class SpecGeneratorError extends Error {
  constructor(
    message: string,
    public code: string,
    public recoverable: boolean,
    public retryable: boolean,
  ) {
    super(message);
    this.name = 'SpecGeneratorError';
  }
}

export const ERROR_CODES = {
  INVALID_URL: 'INVALID_URL',
  JINA_API_ERROR: 'JINA_API_ERROR',
  OPENROUTER_API_ERROR: 'OPENROUTER_API_ERROR',
  GENERATION_FAILED: 'GENERATION_FAILED',
  CACHE_ERROR: 'CACHE_ERROR',
  PDF_EXPORT_ERROR: 'PDF_EXPORT_ERROR',
} as const;

export const AI_MODELS = {
  NOVA: {
    id: 'amazon/nova-2-lite-v1:free',
    name: 'Amazon Nova Lite',
    speed: 'Fast',
    quality: 'Good',
  },
  KAT: {
    id: 'kat-ai/kat-coder-pro:free',
    name: 'Kat Coder Pro',
    speed: 'Medium',
    quality: 'Excellent',
  },
  NEMOTRON: {
    id: 'nvidia/nemotron-mini:free',
    name: 'Nvidia Nemotron Nano',
    speed: 'Medium',
    quality: 'Very Good',
  },
} as const;
