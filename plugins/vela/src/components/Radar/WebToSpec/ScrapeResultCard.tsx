import React from 'react';
import { Card, CardContent, Typography, CardHeader } from '@material-ui/core';

interface ScrapeResultCardProps {
    title: string;
    description: string;
    url: string;
    content: string;
}

export const ScrapeResultCard = ({ title, description, url, content }: ScrapeResultCardProps) => (
    <Card style={{ marginTop: '16px' }}>
        <CardHeader title={title || 'No Title'} subheader={url} />
        <CardContent>
            <Typography variant="body2" color="textSecondary" component="p" paragraph>
                {description}
            </Typography>
            <Typography variant="caption" display="block" color="textSecondary">
                Preview Content:
            </Typography>
            <pre style={{ overflowX: 'auto', background: '#f5f5f5', padding: '8px' }}>
                {content.substring(0, 500)}...
            </pre>
        </CardContent>
    </Card>
);
