import React, { useState } from 'react';
import { useApi } from '@backstage/core-plugin-api';
import { velaApiRef } from '../../../api/VelaApi';
import { TextField, Button, Grid, LinearProgress, Typography } from '@material-ui/core';
import { ScrapeResultCard } from './ScrapeResultCard';

export const UrlInput = () => {
    const velaApi = useApi(velaApiRef);
    const [url, setUrl] = useState('');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);

    const handleScrape = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await velaApi.scrapeUrl(url);
            setResult(data);
        } catch (e: any) {
            setError(e.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ padding: '16px' }}>
            <Grid container spacing={2} alignItems="center">
                <Grid item xs={10}>
                    <TextField
                        fullWidth
                        variant="outlined"
                        label="Website URL"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        placeholder="https://example.com"
                    />
                </Grid>
                <Grid item xs={2}>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleScrape}
                        disabled={loading || !url}
                        fullWidth
                        style={{ height: '56px' }}
                    >
                        Scan
                    </Button>
                </Grid>
            </Grid>

            {loading && <LinearProgress style={{ marginTop: '16px' }} />}

            {error && (
                <Typography color="error" style={{ marginTop: '16px' }}>
                    Error: {error}
                </Typography>
            )}

            {result && (
                <ScrapeResultCard
                    title={result.title}
                    description={result.description}
                    url={result.url}
                    content={result.content}
                />
            )}
        </div>
    );
};
