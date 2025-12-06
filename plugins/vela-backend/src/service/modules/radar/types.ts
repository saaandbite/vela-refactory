export interface ScrapedContent {
    url: string;
    title: string;
    description: string;
    content: string; // Markdown or raw text
    usage?: {
        tokens: number;
    };
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
