import React, { useState } from 'react';
import { InfoCard, CodeSnippet } from '@backstage/core-components';
import {
  Grid,
  Typography,
  Box,
  Button,
  ButtonGroup,
  makeStyles,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';
import GetAppIcon from '@material-ui/icons/GetApp';
import SaveIcon from '@material-ui/icons/Save';
import { useApi } from '@backstage/core-plugin-api';
import { velaApiSpecApiRef } from '../../api';

const useStyles = makeStyles(theme => ({
  formatToggle: {
    marginBottom: theme.spacing(2),
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  downloadButtons: {
    display: 'flex',
    gap: theme.spacing(1),
  },
}));

interface ResultDisplayProps {
  error: string | null;
  onClearError: () => void;
  generatedResult: any;
  validationResult: any;
  onClearValidation: () => void;
}

export function ResultDisplay({
  error,
  onClearError,
  generatedResult,
  validationResult,
  onClearValidation,
}: ResultDisplayProps) {
  const classes = useStyles();
  const api = useApi(velaApiSpecApiRef);
  const [format, setFormat] = useState<'json' | 'yaml'>('json');
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [filename, setFilename] = useState('configs/site-config.json');
  const [commitMessage, setCommitMessage] = useState('Add generated site configuration');
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState<string | null>(null);

  // Helper to download file
  const downloadFile = (
    content: string,
    filename: string,
    mimeType: string,
  ) => {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Check if result has new format (with json/yaml/downloads)
  const hasMultiFormat =
    generatedResult &&
    generatedResult.json &&
    generatedResult.yaml &&
    generatedResult.downloads;

  // Get display content based on format
  const getDisplayContent = () => {
    if (!generatedResult) return '';

    if (hasMultiFormat) {
      return format === 'json'
        ? generatedResult.jsonString
        : generatedResult.yaml;
    }

    // Fallback for old format
    return JSON.stringify(generatedResult, null, 2);
  };

  const getDisplayLanguage = () => {
    if (!hasMultiFormat) return 'json';
    return format;
  };

  const handleSaveToGitHub = async () => {
    setSaving(true);
    setSaveSuccess(null);
    try {
      // Extract the actual config data from the response format
      let configData;
      
      if (hasMultiFormat) {
        // New format with json/yaml/downloads wrapper
        configData = generatedResult.json || generatedResult.data;
      } else if (generatedResult.data) {
        // Has data field
        configData = generatedResult.data;
      } else if (generatedResult.config) {
        // Has config field
        configData = generatedResult.config;
      } else {
        // Fallback to entire result
        configData = generatedResult;
      }

      console.log('Saving to GitHub:', {
        hasMultiFormat,
        filename,
        message: commitMessage,
        configData: configData,
      });

      const result = await api.saveToGitHub({
        config: configData,
        filename,
        message: commitMessage,
        skipValidation: true, // Skip strict validation for AI-generated configs
      });
      
      console.log('Save result:', result);
      setSaveSuccess(result.url);
      setSaveDialogOpen(false);
    } catch (err: any) {
      console.error('Failed to save to GitHub:', err);
      alert(`Failed to save: ${err.message || 'Unknown error'}`);
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      {error && (
        <Grid item xs={12}>
          <Alert severity="error" onClose={onClearError}>
            {error}
          </Alert>
        </Grid>
      )}

      {generatedResult && (
        <Grid item xs={12}>
          <InfoCard title="Generated Result">
            {hasMultiFormat && (
              <Box className={classes.formatToggle}>
                <ButtonGroup size="small" color="primary">
                  <Button
                    variant={format === 'json' ? 'contained' : 'outlined'}
                    onClick={() => setFormat('json')}
                  >
                    JSON
                  </Button>
                  <Button
                    variant={format === 'yaml' ? 'contained' : 'outlined'}
                    onClick={() => setFormat('yaml')}
                  >
                    YAML
                  </Button>
                </ButtonGroup>

                <Box className={classes.downloadButtons}>
                  <Button
                    size="small"
                    variant="outlined"
                    startIcon={<GetAppIcon />}
                    onClick={() =>
                      downloadFile(
                        generatedResult.downloads.json.content,
                        generatedResult.downloads.json.filename,
                        generatedResult.downloads.json.mimeType,
                      )
                    }
                  >
                    Download JSON
                  </Button>
                  <Button
                    size="small"
                    variant="outlined"
                    startIcon={<GetAppIcon />}
                    onClick={() =>
                      downloadFile(
                        generatedResult.downloads.yaml.content,
                        generatedResult.downloads.yaml.filename,
                        generatedResult.downloads.yaml.mimeType,
                      )
                    }
                  >
                    Download YAML
                  </Button>
                  <Button
                    size="small"
                    variant="contained"
                    color="primary"
                    startIcon={<SaveIcon />}
                    onClick={() => setSaveDialogOpen(true)}
                  >
                    Save to GitHub
                  </Button>
                </Box>
              </Box>
            )}
            <CodeSnippet
              text={getDisplayContent()}
              language={getDisplayLanguage()}
              showLineNumbers
            />
          </InfoCard>
        </Grid>
      )}

      {validationResult && (
        <Grid item xs={12}>
          <Alert
            severity={validationResult.valid ? 'success' : 'error'}
            onClose={onClearValidation}
          >
            <Typography variant="h6">
              Validation {validationResult.valid ? 'Passed' : 'Failed'}
            </Typography>
            {validationResult.errors && validationResult.errors.length > 0 && (
              <Box mt={1}>
                {validationResult.errors.map((err: string, idx: number) => (
                  <Typography key={idx} variant="body2">
                    • {err}
                  </Typography>
                ))}
              </Box>
            )}
          </Alert>
        </Grid>
      )}

      {saveSuccess && (
        <Grid item xs={12}>
          <Alert severity="success" onClose={() => setSaveSuccess(null)}>
            <Typography variant="h6">Saved to GitHub!</Typography>
            <Typography variant="body2">
              View on GitHub:{' '}
              <a href={saveSuccess} target="_blank" rel="noopener noreferrer">
                {saveSuccess}
              </a>
            </Typography>
          </Alert>
        </Grid>
      )}

      <Dialog open={saveDialogOpen} onClose={() => setSaveDialogOpen(false)}>
        <DialogTitle>Save to GitHub Repository</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Filename"
            value={filename}
            onChange={e => setFilename(e.target.value)}
            margin="normal"
            helperText="Path in repository, e.g., configs/my-site.json"
          />
          <TextField
            fullWidth
            label="Commit Message"
            value={commitMessage}
            onChange={e => setCommitMessage(e.target.value)}
            margin="normal"
            multiline
            rows={2}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSaveDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={handleSaveToGitHub}
            color="primary"
            variant="contained"
            disabled={saving || !filename || !commitMessage}
            startIcon={<SaveIcon />}
          >
            {saving ? 'Saving...' : 'Save to GitHub'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
