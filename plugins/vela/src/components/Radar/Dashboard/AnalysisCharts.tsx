import React, { useState } from 'react';
import { useApi } from '@backstage/core-plugin-api';
import { velaApiRef, AnalysisResult } from '../../../api/VelaApi';
import { Grid, Button, TextField, LinearProgress, Typography, Box } from '@material-ui/core';
import { SentimentChart } from './SentimentChart';
import { TopicList } from './TopicList';

export const AnalysisCharts = () => {
    const velaApi = useApi(velaApiRef);
    const [text, setText] = useState('');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<AnalysisResult | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleAnalyze = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await velaApi.analyzeText(text);
            setResult(data);
        } catch (e: any) {
            setError(e.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ padding: '16px' }}>
            <Box mb={3}>
                <TextField
                    fullWidth
                    multiline
                    minRows={4}
                    variant="outlined"
                    label="Text Content or Data to Analyze"
                    placeholder="Paste text or CSV content here..."
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                />
                <Box mt={2} display="flex" alignItems="center">
                    <input
                        accept=".csv"
                        style={{ display: 'none' }}
                        id="csv-upload-file"
                        type="file"
                        onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                                const reader = new FileReader();
                                reader.onload = (ev) => {
                                    const content = ev.target?.result as string;
                                    setText(content);
                                };
                                reader.readAsText(file);
                            }
                        }}
                    />
                    <label htmlFor="csv-upload-file">
                        <Button variant="outlined" component="span" style={{ marginRight: '16px' }}>
                            Upload CSV
                        </Button>
                    </label>
                    <Button
                        variant="contained"
                        color="secondary"
                        onClick={handleAnalyze}
                        disabled={loading || !text}
                    >
                        Analyze with VELA Radar
                    </Button>
                </Box>
            </Box>

            {loading && <LinearProgress />}
            {error && <Typography color="error">{error}</Typography>}

            {result && (
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <Typography variant="h6">Summary</Typography>
                        <Typography paragraph>{result.summary}</Typography>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <SentimentChart sentiment={result.sentiment.sentiment} score={result.sentiment.score} />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <TopicList topics={result.topics} />
                    </Grid>
                </Grid>
            )}
        </div>
    );
};
