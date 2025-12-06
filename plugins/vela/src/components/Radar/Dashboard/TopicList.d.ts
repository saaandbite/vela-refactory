import React from 'react';
interface TopicResult {
    topic: string;
    relevance: number;
}
interface TopicListProps {
    topics: TopicResult[];
}
export declare const TopicList: ({ topics }: TopicListProps) => React.JSX.Element;
export {};
