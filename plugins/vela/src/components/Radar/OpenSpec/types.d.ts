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
export declare class SpecGeneratorError extends Error {
    code: string;
    recoverable: boolean;
    retryable: boolean;
    constructor(message: string, code: string, recoverable: boolean, retryable: boolean);
}
export declare const ERROR_CODES: {
    readonly INVALID_URL: "INVALID_URL";
    readonly JINA_API_ERROR: "JINA_API_ERROR";
    readonly OPENROUTER_API_ERROR: "OPENROUTER_API_ERROR";
    readonly GENERATION_FAILED: "GENERATION_FAILED";
    readonly CACHE_ERROR: "CACHE_ERROR";
    readonly PDF_EXPORT_ERROR: "PDF_EXPORT_ERROR";
};
export declare const AI_MODELS: {
    readonly NOVA: {
        readonly id: "amazon/nova-2-lite-v1:free";
        readonly name: "Amazon Nova Lite";
        readonly speed: "Fast";
        readonly quality: "Good";
    };
    readonly KAT: {
        readonly id: "kat-ai/kat-coder-pro:free";
        readonly name: "Kat Coder Pro";
        readonly speed: "Medium";
        readonly quality: "Excellent";
    };
    readonly NEMOTRON: {
        readonly id: "nvidia/nemotron-mini:free";
        readonly name: "Nvidia Nemotron Nano";
        readonly speed: "Medium";
        readonly quality: "Very Good";
    };
};
