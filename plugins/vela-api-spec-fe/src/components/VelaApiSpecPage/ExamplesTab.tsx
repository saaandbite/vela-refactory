import React from 'react';
import { CodeSnippet } from '@backstage/core-components';
import {
  Typography,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
} from '@material-ui/core';
import { useStyles } from './styles';
import { ExamplesProps } from './types';

export function ExamplesTab({
  exampleType,
  setExampleType,
  loading,
  example,
  onLoadExample,
}: ExamplesProps) {
  const classes = useStyles();

  return (
    <>
      <Typography variant="h6" gutterBottom>
        Load Example Configuration
      </Typography>
      <FormControl fullWidth className={classes.formControl}>
        <InputLabel>Example Type</InputLabel>
        <Select
          value={exampleType}
          onChange={e => setExampleType(e.target.value as string)}
        >
          <MenuItem value="minimal">Minimal Landing Page</MenuItem>
          <MenuItem value="portfolio">Portfolio Site</MenuItem>
        </Select>
      </FormControl>
      <Button
        variant="contained"
        color="primary"
        onClick={onLoadExample}
        disabled={loading}
        className={classes.button}
      >
        Load Example
      </Button>
      {example && (
        <Box className={classes.resultBox}>
          <CodeSnippet
            text={JSON.stringify(example, null, 2)}
            language="json"
            showLineNumbers
          />
        </Box>
      )}
    </>
  );
}
