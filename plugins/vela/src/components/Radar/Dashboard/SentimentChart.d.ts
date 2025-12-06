import React from 'react';
interface SentimentChartProps {
    sentiment: 'POSITIVE' | 'NEGATIVE' | 'NEUTRAL';
    score: number;
}
export declare const SentimentChart: ({ sentiment, score }: SentimentChartProps) => React.JSX.Element;
export {};
