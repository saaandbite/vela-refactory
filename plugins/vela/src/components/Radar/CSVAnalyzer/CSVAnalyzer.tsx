import React, { useState } from 'react';
import { Box, Typography, Snackbar, makeStyles, Divider } from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import { Assessment } from '@material-ui/icons';
import { CSVUploader } from './components/CSVUploader';
import { DataTable } from './components/DataTable';
import { AnalysisControls } from './components/AnalysisControls';
import { SentimentChart } from './components/SentimentChart';
import { TopicsDisplay } from './components/TopicsDisplay';
import { ExportButton } from './components/ExportButton';
import { CSVData, AnalysisResult } from './types';
import { analyzeSentiment, analyzeTopics } from './services/aiService';

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(4),
    maxWidth: 1400,
    margin: '0 auto',
    backgroundColor: theme.palette.background.default,
    minHeight: '100vh',
  },
  header: {
    marginBottom: theme.spacing(5),
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(3),
    padding: theme.spacing(4),
    backgroundColor: theme.palette.background.paper,
    borderRadius: theme.spacing(3),
    border: `2px solid ${theme.palette.divider}`,
    boxShadow: theme.palette.type === 'dark' 
      ? '0 4px 12px rgba(0, 0, 0, 0.5)'
      : '0 4px 12px rgba(0, 0, 0, 0.08)',
  },
  headerIcon: {
    fontSize: 56,
    color: theme.palette.primary.main,
    padding: theme.spacing(2),
    backgroundColor: theme.palette.action.selected,
    borderRadius: theme.spacing(2),
  },
  subtitle: {
    color: theme.palette.text.secondary,
    marginTop: theme.spacing(0.5),
    fontSize: '1rem',
  },
  section: {
    marginTop: theme.spacing(4),
  },
  divider: {
    margin: theme.spacing(4, 0),
    height: 1,
    backgroundColor: theme.palette.divider,
  },
  resultsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(450px, 1fr))',
    gap: theme.spacing(4),
    marginTop: theme.spacing(4),
  },
  sectionTitle: {
    fontWeight: 700,
    fontSize: '1.5rem',
    marginBottom: theme.spacing(1),
    color: theme.palette.text.primary,
  },
  exportSection: {
    display: 'flex',
    justifyContent: 'flex-end',
    marginTop: theme.spacing(3),
    padding: theme.spacing(3),
    backgroundColor: theme.palette.background.paper,
    borderRadius: theme.spacing(2),
    border: `1px solid ${theme.palette.divider}`,
  },
}));

export const CSVAnalyzer: React.FC = () => {
  const [csvData, setCsvData] = useState<CSVData | null>(null);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult>({});
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');

  const handleDataLoaded = (data: CSVData) => {
    setCsvData(data);
    setAnalysisResult({});
    setSuccess(`Successfully loaded ${data.rowCount} rows`);
  };

  const handleError = (errorMsg: string) => {
    setError(errorMsg);
  };

  const handleAnalyzeSentiment = async (columnIndex: number, sampleSize: number, model: string) => {
    if (!csvData) return;

    try {
      const sentiment = await analyzeSentiment(csvData.rows, columnIndex, sampleSize, model);
      console.log('✅ Sentiment analysis result:', sentiment);
      console.log('  - Positive:', sentiment.positive);
      console.log('  - Negative:', sentiment.negative);
      console.log('  - Neutral:', sentiment.neutral);
      console.log('  - Data length:', sentiment.data?.length);
      setAnalysisResult(prev => ({ ...prev, sentiment }));
      setSuccess('Sentiment analysis completed successfully!');
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Unknown error';
      console.error('❌ Sentiment analysis error:', err);
      setError(`Failed to analyze sentiment: ${errorMsg}`);
    }
  };

  const handleAnalyzeTopics = async (columnIndex: number, sampleSize: number, model: string) => {
    if (!csvData) return;

    try {
      const topics = await analyzeTopics(csvData.rows, columnIndex, sampleSize, model);
      console.log('✅ Topic analysis result:', topics);
      console.log('  - Topics count:', topics.topics?.length);
      console.log('  - Topics:', topics.topics);
      setAnalysisResult(prev => ({ ...prev, topics }));
      setSuccess('Topic analysis completed successfully!');
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Unknown error';
      console.error('❌ Topic analysis error:', err);
      setError(`Failed to analyze topics: ${errorMsg}`);
    }
  };

  const classes = useStyles();

  return (
    <Box className={classes.root}>
      <Box className={classes.header}>
        <Assessment className={classes.headerIcon} />
        <Box>
          <Typography variant="h4">
            CSV Data Analyzer
          </Typography>
          <Typography variant="body2" className={classes.subtitle}>
            AI-powered sentiment analysis and topic discovery
          </Typography>
        </Box>
      </Box>

      <CSVUploader onDataLoaded={handleDataLoaded} onError={handleError} />

      {csvData && (
        <>
          <Divider className={classes.divider} />

          <Box className={classes.section}>
            <AnalysisControls
              headers={csvData.headers}
              onAnalyzeSentiment={handleAnalyzeSentiment}
              onAnalyzeTopics={handleAnalyzeTopics}
            />
          </Box>

          <Box className={classes.exportSection}>
            <ExportButton csvData={csvData} analysisResult={analysisResult} />
          </Box>

          {(analysisResult.sentiment || analysisResult.topics) && (() => {
            console.log('🎨 Rendering analysis results');
            if (analysisResult.sentiment) {
              console.log('🎨 Sentiment data:', analysisResult.sentiment);
            }
            if (analysisResult.topics) {
              console.log('🎨 Topics data:', analysisResult.topics);
            }
            return (
              <>
                <Divider className={classes.divider} />
                <Box className={classes.resultsGrid}>
                  {analysisResult.sentiment && (
                    <SentimentChart sentiment={analysisResult.sentiment} />
                  )}
                  {analysisResult.topics && (
                    <TopicsDisplay topics={analysisResult.topics} />
                  )}
                </Box>
              </>
            );
          })()}

          <Divider className={classes.divider} />

          <Box className={classes.section}>
            <Typography variant="h5" className={classes.sectionTitle}>
              Data Preview
            </Typography>
            <Typography variant="body2" color="textSecondary" gutterBottom>
              {csvData.rowCount} rows loaded • Ready for analysis
            </Typography>
            <Box mt={3}>
              <DataTable headers={csvData.headers} rows={csvData.rows} />
            </Box>
          </Box>
        </>
      )}

      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={() => setError('')}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={() => setError('')} severity="error">
          {error}
        </Alert>
      </Snackbar>

      <Snackbar
        open={!!success}
        autoHideDuration={4000}
        onClose={() => setSuccess('')}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={() => setSuccess('')} severity="success">
          {success}
        </Alert>
      </Snackbar>
    </Box>
  );
};
