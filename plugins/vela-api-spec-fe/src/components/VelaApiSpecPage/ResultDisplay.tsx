import { useState } from 'react';
import { InfoCard, CodeSnippet } from '@backstage/core-components';
import {
  Grid,
  Typography,
  Box,
  Button,
  ButtonGroup,
  makeStyles,
} from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';
import GetAppIcon from '@material-ui/icons/GetApp';

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
  const [format, setFormat] = useState<'json' | 'yaml'>('json');

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
    </>
  );
}
