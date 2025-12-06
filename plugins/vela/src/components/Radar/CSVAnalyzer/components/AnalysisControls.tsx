import React, { useState } from 'react';
import {
  Box,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Paper,
  makeStyles,
  CircularProgress,
  Typography,
  Chip,
} from '@material-ui/core';
import { Assessment, Category } from '@material-ui/icons';

const useStyles = makeStyles(theme => ({
  controlsContainer: {
    padding: theme.spacing(4),
    backgroundColor: theme.palette.background.paper,
    borderRadius: theme.spacing(3),
    border: `2px solid ${theme.palette.divider}`,
    boxShadow: theme.palette.type === 'dark'
      ? '0 4px 12px rgba(0, 0, 0, 0.3)'
      : '0 4px 12px rgba(0, 0, 0, 0.06)',
  },
  formControl: {
    minWidth: 240,
    marginRight: theme.spacing(2),
    marginBottom: theme.spacing(2),
    '& .MuiOutlinedInput-root': {
      borderRadius: theme.spacing(1.5),
      backgroundColor: theme.palette.background.paper,
    },
  },
  buttonGroup: {
    display: 'flex',
    gap: theme.spacing(2),
    marginTop: theme.spacing(3),
    flexWrap: 'wrap',
  },
  modelChip: {
    marginLeft: theme.spacing(1),
    fontWeight: 600,
    backgroundColor: theme.palette.action.selected,
    color: theme.palette.primary.main,
  },
  section: {
    marginBottom: theme.spacing(3),
  },
  title: {
    marginBottom: theme.spacing(3),
    fontWeight: 700,
    fontSize: '1.25rem',
    color: theme.palette.text.primary,
  },
  infoText: {
    marginTop: theme.spacing(2),
    padding: theme.spacing(1.5),
    backgroundColor: theme.palette.action.hover,
    borderRadius: theme.spacing(1.5),
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1),
    border: `1px solid ${theme.palette.divider}`,
  },
  analyzeButton: {
    padding: theme.spacing(1.5, 4),
    borderRadius: theme.spacing(3),
    fontWeight: 600,
    textTransform: 'none',
    fontSize: '1rem',
    boxShadow: 'none',
    '&:hover': {
      boxShadow: theme.palette.type === 'dark'
        ? '0 4px 12px rgba(33, 150, 243, 0.3)'
        : '0 4px 12px rgba(0, 0, 0, 0.15)',
    },
  },
}));

const MODELS = {
  NOVA: { id: 'amazon/nova-2-lite-v1:free', name: 'Amazon Nova Lite', badge: 'Fast' },
  KAT_CODER: { id: 'kwaipilot/kat-coder-pro:free', name: 'Kat Coder Pro', badge: 'Accurate' },
  NEMOTRON: { id: 'nvidia/nemotron-nano-12b-v2-vl:free', name: 'Nemotron Nano', badge: 'Balanced' },
};

interface AnalysisControlsProps {
  headers: string[];
  onAnalyzeSentiment: (columnIndex: number, sampleSize: number, model: string) => Promise<void>;
  onAnalyzeTopics: (columnIndex: number, sampleSize: number, model: string) => Promise<void>;
}

export const AnalysisControls: React.FC<AnalysisControlsProps> = ({
  headers,
  onAnalyzeSentiment,
  onAnalyzeTopics,
}) => {
  const classes = useStyles();
  // Auto-select first text column (skip numeric/id columns)
  const defaultColumn = headers.findIndex(h => 
    h.toLowerCase().includes('text') || 
    h.toLowerCase().includes('feedback') || 
    h.toLowerCase().includes('comment') ||
    h.toLowerCase().includes('review') ||
    h.toLowerCase().includes('description')
  );
  const [selectedColumn, setSelectedColumn] = useState<number>(defaultColumn >= 0 ? defaultColumn : 1);
  const [sampleSize, setSampleSize] = useState<number>(50);
  const [selectedModel, setSelectedModel] = useState<string>(MODELS.NOVA.id);
  const [loading, setLoading] = useState<{ sentiment: boolean; topics: boolean }>({
    sentiment: false,
    topics: false,
  });

  const handleSentimentAnalysis = async () => {
    console.log('🎯 Starting sentiment analysis');
    console.log('  - Selected column:', selectedColumn, `(${headers[selectedColumn]})`);
    console.log('  - Sample size:', sampleSize);
    console.log('  - Model:', selectedModel);
    
    setLoading(prev => ({ ...prev, sentiment: true }));
    try {
      await onAnalyzeSentiment(selectedColumn, sampleSize, selectedModel);
    } finally {
      setLoading(prev => ({ ...prev, sentiment: false }));
    }
  };

  const handleTopicAnalysis = async () => {
    console.log('🎯 Starting topic analysis');
    console.log('  - Selected column:', selectedColumn, `(${headers[selectedColumn]})`);
    console.log('  - Sample size:', sampleSize);
    console.log('  - Model:', selectedModel);
    
    setLoading(prev => ({ ...prev, topics: true }));
    try {
      await onAnalyzeTopics(selectedColumn, sampleSize, selectedModel);
    } finally {
      setLoading(prev => ({ ...prev, topics: false }));
    }
  };

  const currentModel = Object.values(MODELS).find(m => m.id === selectedModel);

  return (
    <Paper className={classes.controlsContainer} elevation={0}>
      <Typography variant="h6" className={classes.title}>
        Analysis Configuration
      </Typography>

      <Box className={classes.section}>
        <Box display="flex" alignItems="center" flexWrap="wrap">
          <FormControl className={classes.formControl}>
            <InputLabel>AI Model</InputLabel>
            <Select
              value={selectedModel}
              onChange={e => setSelectedModel(e.target.value as string)}
            >
              {Object.values(MODELS).map(model => (
                <MenuItem key={model.id} value={model.id}>
                  {model.name}
                  <Chip
                    label={model.badge}
                    size="small"
                    color="primary"
                    className={classes.modelChip}
                  />
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl className={classes.formControl}>
            <InputLabel>Text Column</InputLabel>
            <Select
              value={selectedColumn}
              onChange={e => setSelectedColumn(e.target.value as number)}
            >
              {headers.map((header, index) => (
                <MenuItem key={index} value={index}>
                  {header}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl className={classes.formControl}>
            <TextField
              label="Sample Size"
              type="number"
              value={sampleSize}
              onChange={e => setSampleSize(Math.max(1, Math.min(500, Number(e.target.value))))}
              inputProps={{ min: 1, max: 500 }}
              helperText="1-500 rows"
            />
          </FormControl>
        </Box>

        <Box className={classes.infoText}>
          <Typography variant="caption" color="textSecondary">
            <strong>Model:</strong> {currentModel?.name} • <strong>Provider:</strong> OpenRouter (Free) • <strong>Enrichment:</strong> Jina AI
          </Typography>
        </Box>
      </Box>

      <Box className={classes.buttonGroup}>
        <Button
          variant="contained"
          color="primary"
          startIcon={loading.sentiment ? <CircularProgress size={20} color="inherit" /> : <Assessment />}
          onClick={handleSentimentAnalysis}
          disabled={loading.sentiment || loading.topics}
          className={classes.analyzeButton}
          size="large"
        >
          {loading.sentiment ? 'Analyzing Sentiment...' : 'Analyze Sentiment'}
        </Button>

        <Button
          variant="contained"
          color="secondary"
          startIcon={loading.topics ? <CircularProgress size={20} color="inherit" /> : <Category />}
          onClick={handleTopicAnalysis}
          disabled={loading.sentiment || loading.topics}
          className={classes.analyzeButton}
          size="large"
        >
          {loading.topics ? 'Analyzing Topics...' : 'Analyze Topics'}
        </Button>
      </Box>
    </Paper>
  );
};
