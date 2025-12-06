import React, { useState } from 'react';
import { Box, Typography, Snackbar } from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import { CSVUploader } from './components/CSVUploader';
import { DataTable } from './components/DataTable';
import { AnalysisControls } from './components/AnalysisControls';
import { SentimentChart } from './components/SentimentChart';
import { TopicsDisplay } from './components/TopicsDisplay';
import { CSVData, AnalysisResult } from './types';
import { analyzeSentiment, analyzeTopics } from './services/aiService';

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
      setAnalysisResult(prev => ({ ...prev, sentiment }));
      setSuccess('Sentiment analysis completed successfully!');
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Unknown error';
      setError(`Failed to analyze sentiment: ${errorMsg}`);
    }
  };

  const handleAnalyzeTopics = async (columnIndex: number, sampleSize: number, model: string) => {
    if (!csvData) return;

    try {
      const topics = await analyzeTopics(csvData.rows, columnIndex, sampleSize, model);
      setAnalysisResult(prev => ({ ...prev, topics }));
      setSuccess('Topic analysis completed successfully!');
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Unknown error';
      setError(`Failed to analyze topics: ${errorMsg}`);
    }
  };

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        CSV Data Analyzer
      </Typography>
      <Typography variant="body1" color="textSecondary" paragraph>
        Upload a CSV file to analyze sentiment and discover topics using AI
      </Typography>

      <CSVUploader onDataLoaded={handleDataLoaded} onError={handleError} />

      {csvData && (
        <>
          <AnalysisControls
            headers={csvData.headers}
            onAnalyzeSentiment={handleAnalyzeSentiment}
            onAnalyzeTopics={handleAnalyzeTopics}
          />

          {analysisResult.sentiment && (
            <SentimentChart sentiment={analysisResult.sentiment} />
          )}

          {analysisResult.topics && (
            <TopicsDisplay topics={analysisResult.topics} />
          )}

          <Box mt={3}>
            <Typography variant="h6" gutterBottom>
              Data Preview ({csvData.rowCount} rows)
            </Typography>
            <DataTable headers={csvData.headers} rows={csvData.rows} />
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
