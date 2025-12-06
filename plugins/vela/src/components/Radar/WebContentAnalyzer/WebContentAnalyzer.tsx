import React, { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  CircularProgress,
  Snackbar,
  makeStyles,
  Paper,
  Grid,
  Chip,
} from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import { Language, Assessment, Description } from '@material-ui/icons';
import { useNavigate } from 'react-router-dom';
import { extractContent } from './services/jinaService';
import { analyzeContent } from './services/analyzerService';
import { DataTable } from './components/DataTable';
import { SummaryCard } from './components/SummaryCard';
import { InsightsCard } from './components/InsightsCard';
import { ExportButton } from './components/ExportButton';
import { AnalysisResult } from './types';

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(4),
    maxWidth: 1400,
    margin: '0 auto',
  },
  header: {
    marginBottom: theme.spacing(4),
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(2),
  },
  headerIcon: {
    fontSize: 48,
    color: theme.palette.primary.main,
  },
  inputSection: {
    marginBottom: theme.spacing(3),
  },
  inputRow: {
    display: 'flex',
    gap: theme.spacing(2),
    alignItems: 'flex-start',
  },
  urlInput: {
    flex: 1,
  },
  modelSelect: {
    minWidth: 200,
  },
  analyzeButton: {
    height: 56,
  },
  resultsSection: {
    marginTop: theme.spacing(4),
  },
  statusChip: {
    marginLeft: theme.spacing(2),
  },
}));

const MODELS = [
  { value: 'amazon/nova-2-lite-v1:free', label: 'Amazon Nova Lite', badge: 'Fast' },
  { value: 'kwaipilot/kat-coder-pro:free', label: 'Kat Coder Pro', badge: 'Accurate' },
  { value: 'nvidia/nemotron-nano-12b-v2-vl:free', label: 'Nemotron Nano', badge: 'Balanced' },
];

export const WebContentAnalyzer: React.FC = () => {
  const classes = useStyles();
  const navigate = useNavigate();

  const [url, setUrl] = useState('');
  const [model, setModel] = useState(MODELS[0].value);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [extractedContent, setExtractedContent] = useState<string>('');

  const handleAnalyze = async () => {
    if (!url) {
      setError('Please enter a URL');
      return;
    }

    setLoading(true);
    setError('');
    setAnalysisResult(null);

    try {
      // Step 1: Extract content
      setStatus('Extracting content from URL...');
      const content = await extractContent(url);
      setExtractedContent(content.content);

      // Step 2: Analyze content
      setStatus('Analyzing content with AI...');
      const result = await analyzeContent(content.content, url, model);
      setAnalysisResult(result);

      setSuccess('Analysis completed successfully!');
      setStatus('');
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Unknown error';
      setError(`Analysis failed: ${errorMsg}`);
      setStatus('');
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateSpec = () => {
    // Navigate to OpenSpec with the extracted content
    navigate('/vela/radar/openspec', {
      state: {
        preloadedUrl: url,
        preloadedContent: extractedContent,
        fromAnalyzer: true,
      },
    });
  };

  return (
    <Box className={classes.root}>
      <Box className={classes.header}>
        <Language className={classes.headerIcon} />
        <Box flex={1}>
          <Typography variant="h4">Web Content Analyzer</Typography>
          <Typography variant="body2" color="textSecondary">
            Extract & clean structured data from any website → Generate technical specs
          </Typography>
        </Box>
        {analysisResult && (
          <Box ml="auto">
            <ExportButton analysisResult={analysisResult} />
          </Box>
        )}
      </Box>

      <Paper className={classes.inputSection}>
        <Box p={3}>
          <Box className={classes.inputRow}>
            <TextField
              className={classes.urlInput}
              label="Website URL"
              placeholder="https://example.com"
              variant="outlined"
              value={url}
              onChange={e => setUrl(e.target.value)}
              disabled={loading}
              fullWidth
            />
            <TextField
              className={classes.modelSelect}
              select
              label="AI Model"
              variant="outlined"
              value={model}
              onChange={e => setModel(e.target.value)}
              disabled={loading}
              SelectProps={{
                native: true,
              }}
            >
              {MODELS.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </TextField>
            <Button
              className={classes.analyzeButton}
              variant="contained"
              color="primary"
              onClick={handleAnalyze}
              disabled={loading || !url}
              startIcon={loading ? <CircularProgress size={20} /> : <Assessment />}
            >
              {loading ? 'Analyzing...' : 'Analyze'}
            </Button>
          </Box>
          {status && (
            <Box mt={2}>
              <Chip
                label={status}
                color="primary"
                icon={<CircularProgress size={16} />}
                className={classes.statusChip}
              />
            </Box>
          )}
        </Box>
      </Paper>

      {analysisResult && (
        <Box className={classes.resultsSection}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Paper style={{ padding: 24, marginBottom: 16, backgroundColor: '#e3f2fd' }}>
                <Box display="flex" alignItems="center" justifyContent="space-between">
                  <Box>
                    <Typography variant="h6" gutterBottom>
                      ✅ Data Extraction Complete
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Your data has been cleaned and is ready for analysis or spec generation
                    </Typography>
                  </Box>
                  <Box display="flex" gap={2}>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={handleGenerateSpec}
                      startIcon={<Description />}
                      size="large"
                    >
                      Generate Technical Spec
                    </Button>
                  </Box>
                </Box>
              </Paper>
            </Grid>
            <Grid item xs={12}>
              <SummaryCard
                summary={analysisResult.summary}
                metadata={analysisResult.metadata}
              />
            </Grid>
            <Grid item xs={12}>
              <InsightsCard insights={analysisResult.insights} />
            </Grid>
            <Grid item xs={12}>
              <DataTable data={analysisResult.structuredData} />
            </Grid>
          </Grid>
        </Box>
      )}

      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={() => setError('')}
      >
        <Alert onClose={() => setError('')} severity="error">
          {error}
        </Alert>
      </Snackbar>

      <Snackbar
        open={!!success}
        autoHideDuration={4000}
        onClose={() => setSuccess('')}
      >
        <Alert onClose={() => setSuccess('')} severity="success">
          {success}
        </Alert>
      </Snackbar>
    </Box>
  );
};
