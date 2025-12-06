import { DiscoveryApi, FetchApi } from '@backstage/core-plugin-api';
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
export declare const velaApiRef: import("@backstage/core-plugin-api").ApiRef<VelaApi>;
export interface VelaApi {
    scrapeUrl(url: string): Promise<ScrapedContent>;
    analyzeText(text: string): Promise<AnalysisResult>;
}
export declare class VelaClient implements VelaApi {
    private readonly discoveryApi;
    private readonly fetchApi;
    constructor(options: {
        discoveryApi: DiscoveryApi;
        fetchApi: FetchApi;
    });
    private getBaseUrl;
    scrapeUrl(url: string): Promise<ScrapedContent>;
    analyzeText(text: string): Promise<AnalysisResult>;
}
