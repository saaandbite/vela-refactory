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
    padding: theme.spacing(3),
    marginTop: theme.spacing(2),
  },
  formControl: {
    minWidth: 200,
    marginRight: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
  buttonGroup: {
    display: 'flex',
    gap: theme.spacing(2),
    marginTop: theme.spacing(2),
    flexWrap: 'wrap',
  },
  modelChip: {
    marginLeft: theme.spacing(1),
  },
  section: {
    marginBottom: theme.spacing(2),
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
  const [selectedColumn, setSelectedColumn] = useState<number>(0);
  const [sampleSize, setSampleSize] = useState<number>(50);
  const [selectedModel, setSelectedModel] = useState<string>(MODELS.NOVA.id);
  const [loading, setLoading] = useState<{ sentiment: boolean; topics: boolean }>({
    sentiment: false,
    topics: false,
  });

  const handleSentimentAnalysis = async () => {
    setLoading(prev => ({ ...prev, sentiment: true }));
    try {
      await onAnalyzeSentiment(selectedColumn, sampleSize, selectedModel);
    } finally {
      setLoading(prev => ({ ...prev, sentiment: false }));
    }
  };

  const handleTopicAnalysis = async () => {
    setLoading(prev => ({ ...prev, topics: true }));
    try {
      await onAnalyzeTopics(selectedColumn, sampleSize, selectedModel);
    } finally {
      setLoading(prev => ({ ...prev, topics: false }));
    }
  };

  const currentModel = Object.values(MODELS).find(m => m.id === selectedModel);

  return (
    <Paper className={classes.controlsContainer}>
      <Typography variant="h6" gutterBottom>
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

        <Typography variant="caption" color="textSecondary">
          Using: {currentModel?.name} • Free tier • Powered by OpenRouter + Jina AI
        </Typography>
      </Box>

      <Box className={classes.buttonGroup}>
        <Button
          variant="contained"
          color="primary"
          startIcon={loading.sentiment ? <CircularProgress size={20} /> : <Assessment />}
          onClick={handleSentimentAnalysis}
          disabled={loading.sentiment || loading.topics}
        >
          {loading.sentiment ? 'Analyzing...' : 'Analyze Sentiment'}
        </Button>

        <Button
          variant="contained"
          color="secondary"
          startIcon={loading.topics ? <CircularProgress size={20} /> : <Category />}
          onClick={handleTopicAnalysis}
          disabled={loading.sentiment || loading.topics}
        >
          {loading.topics ? 'Analyzing...' : 'Analyze Topics'}
        </Button>
      </Box>
    </Paper>
  );
};
