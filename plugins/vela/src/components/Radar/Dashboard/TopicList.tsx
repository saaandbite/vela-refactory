import React from 'react';
import { Card, CardContent, CardHeader, LinearProgress, Typography, Box } from '@material-ui/core';

interface TopicResult {
    topic: string;
    relevance: number;
}

interface TopicListProps {
    topics: TopicResult[];
}

export const TopicList = ({ topics }: TopicListProps) => {
    return (
        <Card style={{ height: '100%' }}>
            <CardHeader title="Topic Modeling" />
            <CardContent>
                {topics.map((t, index) => (
                    <Box key={index} mb={2}>
                        <Box display="flex" justifyContent="space-between">
                            <Typography variant="body2">{t.topic}</Typography>
                            <Typography variant="caption">{(t.relevance * 100).toFixed(0)}%</Typography>
                        </Box>
                        <LinearProgress variant="determinate" value={t.relevance * 100} />
                    </Box>
                ))}
            </CardContent>
        </Card>
    );
};
