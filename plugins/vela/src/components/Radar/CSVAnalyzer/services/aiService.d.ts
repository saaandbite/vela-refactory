import { SentimentAnalysis, TopicAnalysis } from '../types';
declare const MODELS: {
    NOVA: string;
    KAT_CODER: string;
    NEMOTRON: string;
};
export declare function analyzeSentiment(data: any[][], textColumnIndex: number, sampleSize?: number, model?: string): Promise<SentimentAnalysis>;
export declare function analyzeTopics(data: any[][], textColumnIndex: number, sampleSize?: number, model?: string): Promise<TopicAnalysis>;
export { MODELS };
