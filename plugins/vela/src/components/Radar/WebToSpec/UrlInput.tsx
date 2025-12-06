import React, { useState } from 'react';
import { useApi } from '@backstage/core-plugin-api';
import { velaApiRef } from '../../../api/VelaApi';
import { TextField, Button, Grid, LinearProgress, Typography, Box, Paper, makeStyles } from '@material-ui/core';
import { Search, Language } from '@material-ui/icons';
import { ScrapeResultCard } from './ScrapeResultCard';

const useStyles = makeStyles(theme => ({
    root: {
        padding: theme.spacing(4),
        maxWidth: 1200,
        margin: '0 auto',
        backgroundColor: theme.palette.background.default,
        minHeight: '100vh',
    },
    inputContainer: {
        padding: theme.spacing(4),
        backgroundColor: theme.palette.background.paper,
        borderRadius: theme.spacing(3),
        border: `2px solid ${theme.palette.divider}`,
        boxShadow: theme.palette.type === 'dark'
            ? '0 4px 12px rgba(0, 0, 0, 0.3)'
            : '0 4px 12px rgba(0, 0, 0, 0.06)',
    },
    textField: {
        '& .MuiOutlinedInput-root': {
            borderRadius: theme.spacing(1.5),
            backgroundColor: theme.palette.background.paper,
        },
    },
    scanButton: {
        height: 56,
        borderRadius: theme.spacing(3),
        fontWeight: 600,
        textTransform: 'none',
        fontSize: '1rem',
    },
    errorBox: {
        marginTop: theme.spacing(2),
        padding: theme.spacing(2),
        backgroundColor: theme.palette.type === 'dark'
            ? 'rgba(244, 67, 54, 0.15)'
            : 'rgba(244, 67, 54, 0.1)',
        borderRadius: theme.spacing(1.5),
        border: `2px solid ${theme.palette.error.main}`,
    },
    loadingBox: {
        marginTop: theme.spacing(2),
    },
}));

export const UrlInput = () => {
    const classes = useStyles();
    const velaApi = useApi(velaApiRef);
    const [url, setUrl] = useState('');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);

    const handleScrape = async () => {
        setLoading(true);
        setError(null);
        setResult(null);
        try {
            const data = await velaApi.scrapeUrl(url);
            setResult(data);
        } catch (e: any) {
            setError(e.message);
        } finally {
            setLoading(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && url && !loading) {
            handleScrape();
        }
    };

    return (
        <Box className={classes.root}>
            <Paper className={classes.inputContainer} elevation={0}>
                <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12} sm={10}>
                        <TextField
                            fullWidth
                            variant="outlined"
                            label="Website URL"
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="https://example.com"
                            className={classes.textField}
                            InputProps={{
                                startAdornment: <Language color="action" style={{ marginRight: 8 }} />,
                            }}
                        />
                    </Grid>
                    <Grid item xs={12} sm={2}>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleScrape}
                            disabled={loading || !url}
                            fullWidth
                            className={classes.scanButton}
                            startIcon={<Search />}
                        >
                            Scan
                        </Button>
                    </Grid>
                </Grid>

                {loading && (
                    <Box className={classes.loadingBox}>
                        <LinearProgress />
                        <Typography variant="caption" color="textSecondary" style={{ marginTop: 8 }}>
                            Scraping website content...
                        </Typography>
                    </Box>
                )}

                {error && (
                    <Box className={classes.errorBox}>
                        <Typography color="error">
                            <strong>Error:</strong> {error}
                        </Typography>
                    </Box>
                )}
            </Paper>

            {result && (
                <Box mt={3}>
                    <ScrapeResultCard
                        title={result.title}
                        description={result.description}
                        url={result.url}
                        content={result.content}
                    />
                </Box>
            )}
        </Box>
    );
};
