import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Typography, Card, CardContent, CardHeader } from '@material-ui/core';

interface SentimentChartProps {
    sentiment: 'POSITIVE' | 'NEGATIVE' | 'NEUTRAL';
    score: number;
}

export const SentimentChart = ({ sentiment, score }: SentimentChartProps) => {
    const data = [
        { name: sentiment, value: score },
        { name: 'Other', value: 1 - score },
    ];

    const COLORS = {
        POSITIVE: '#00C49F', // Green
        NEGATIVE: '#FF8042', // Orange/Red
        NEUTRAL: '#FFBB28',  // Yellow
    };
    const color = COLORS[sentiment] || '#8884d8';

    return (
        <Card style={{ height: '100%' }}>
            <CardHeader title="Sentiment Analysis" />
            <CardContent style={{ height: 300 }}>
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={data}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={80}
                            fill="#8884d8"
                            paddingAngle={5}
                            dataKey="value"
                        >
                            <Cell key="sentiment" fill={color} />
                            <Cell key="other" fill="#e0e0e0" />
                        </Pie>
                        <Tooltip />
                        <Legend />
                    </PieChart>
                </ResponsiveContainer>
                <Typography align="center" variant="h6">{sentiment} ({(score * 100).toFixed(1)}%)</Typography>
            </CardContent>
        </Card>
    );
};
