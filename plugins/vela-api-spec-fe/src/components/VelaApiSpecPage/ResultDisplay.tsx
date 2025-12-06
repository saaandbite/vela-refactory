import React from 'react';
import { InfoCard, CodeSnippet } from '@backstage/core-components';
import { Grid, Typography, Box } from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';

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
            <CodeSnippet
              text={JSON.stringify(generatedResult, null, 2)}
              language="json"
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
