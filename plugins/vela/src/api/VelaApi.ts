import { createApiRef, DiscoveryApi, FetchApi } from '@backstage/core-plugin-api';

export interface ScrapedContent {
    url: string;
    title: string;
    description: string;
    content: string;
}

export interface SentimentResult {
    sentiment: 'POSITIVE' | 'NEGATIVE' | 'NEUTRAL';
    score: number;
    explanation: string;
}

export interface TopicResult {
    topic: string;
    relevance: number;
}

export interface AnalysisResult {
    summary: string;
    sentiment: SentimentResult;
    topics: TopicResult[];
}

export const velaApiRef = createApiRef<VelaApi>({
    id: 'plugin.vela.service',
});

export interface VelaApi {
    scrapeUrl(url: string): Promise<ScrapedContent>;
    analyzeText(text: string): Promise<AnalysisResult>;
}

export class VelaClient implements VelaApi {
    private readonly discoveryApi: DiscoveryApi;
    private readonly fetchApi: FetchApi;

    constructor(options: { discoveryApi: DiscoveryApi; fetchApi: FetchApi }) {
        this.discoveryApi = options.discoveryApi;
        this.fetchApi = options.fetchApi;
    }

    private async getBaseUrl(): Promise<string> {
        return await this.discoveryApi.getBaseUrl('vela-backend');
    }

    async scrapeUrl(url: string): Promise<ScrapedContent> {
        const baseUrl = await this.getBaseUrl();
        const response = await this.fetchApi.fetch(`${baseUrl}/radar/scrape`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ url }),
        });

        if (!response.ok) {
            throw new Error(`Failed to scrape URL: ${response.statusText}`);
        }
        return await response.json();
    }

    async analyzeText(text: string): Promise<AnalysisResult> {
        const baseUrl = await this.getBaseUrl();
        const response = await this.fetchApi.fetch(`${baseUrl}/radar/analyze`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text }),
        });

        if (!response.ok) {
            throw new Error(`Failed to analyze text: ${response.statusText}`);
        }
        return await response.json();
    }
}
