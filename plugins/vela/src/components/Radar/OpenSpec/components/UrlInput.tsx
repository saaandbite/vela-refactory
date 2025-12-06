import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  CircularProgress,
  makeStyles,
  Typography,
} from '@material-ui/core';
import { Link as LinkIcon } from '@material-ui/icons';
import { validateUrl } from '../utils/validators';

const useStyles = makeStyles(theme => ({
  container: {
    padding: theme.spacing(4),
    backgroundColor: theme.palette.background.paper,
    borderRadius: theme.spacing(2),
    border: `1px solid ${theme.palette.divider}`,
  },
  title: {
    fontWeight: 600,
    marginBottom: theme.spacing(2),
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1),
  },
  form: {
    display: 'flex',
    gap: theme.spacing(2),
    alignItems: 'flex-start',
  },
  textField: {
    flex: 1,
  },
  button: {
    height: 56,
    minWidth: 120,
    fontWeight: 600,
  },
  error: {
    marginTop: theme.spacing(1),
    color: theme.palette.error.main,
  },
}));

interface UrlInputProps {
  onSubmit: (url: string) => Promise<void>;
  loading: boolean;
  error?: string;
}

export const UrlInput: React.FC<UrlInputProps> = ({
  onSubmit,
  loading,
  error: externalError,
}) => {
  const classes = useStyles();
  const [url, setUrl] = useState('');
  const [validationError, setValidationError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const error = validateUrl(url);
    if (error) {
      setValidationError(error);
      return;
    }

    setValidationError(null);
    await onSubmit(url);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUrl(e.target.value);
    if (validationError) {
      setValidationError(null);
    }
  };

  const displayError = validationError || externalError;

  return (
    <Box className={classes.container}>
      <Typography variant="h6" className={classes.title}>
        <LinkIcon />
        Extract Content from URL
      </Typography>
      <form onSubmit={handleSubmit} className={classes.form}>
        <TextField
          className={classes.textField}
          variant="outlined"
          placeholder="https://example.com/documentation"
          value={url}
          onChange={handleChange}
          disabled={loading}
          error={!!displayError}
          helperText={displayError}
        />
        <Button
          type="submit"
          variant="contained"
          color="primary"
          className={classes.button}
          disabled={loading || !url}
          startIcon={loading ? <CircularProgress size={20} /> : null}
        >
          {loading ? 'Extracting...' : 'Extract'}
        </Button>
      </form>
    </Box>
  );
};
