export interface CSVData {
    headers: string[];
    rows: any[][];
    rowCount: number;
}
export interface AnalysisResult {
    sentiment?: SentimentAnalysis;
    topics?: TopicAnalysis;
}
export interface SentimentAnalysis {
    positive: number;
    negative: number;
    neutral: number;
    data: Array<{
        text: string;
        sentiment: string;
        score: number;
    }>;
}
export interface TopicAnalysis {
    topics: Array<{
        name: string;
        keywords: string[];
        count: number;
    }>;
}
export interface CacheEntry<T> {
    data: T;
    timestamp: number;
    ttl: number;
}
