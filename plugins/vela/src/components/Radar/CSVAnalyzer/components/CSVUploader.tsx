import React, { useCallback, useState } from 'react';
import {
  Button,
  Box,
  Typography,
  Paper,
  LinearProgress,
  makeStyles,
} from '@material-ui/core';
import { CloudUpload, Description } from '@material-ui/icons';
import Papa from 'papaparse';
import { CSVData } from '../types';

const useStyles = makeStyles(theme => ({
  uploadArea: {
    padding: theme.spacing(4),
    textAlign: 'center',
    border: `2px dashed ${theme.palette.divider}`,
    borderRadius: theme.spacing(1),
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    '&:hover': {
      borderColor: theme.palette.primary.main,
      backgroundColor: theme.palette.action.hover,
    },
    '&.dragover': {
      borderColor: theme.palette.primary.main,
      backgroundColor: theme.palette.action.selected,
    },
  },
  uploadIcon: {
    fontSize: 64,
    color: theme.palette.primary.main,
    marginBottom: theme.spacing(2),
  },
  fileInfo: {
    marginTop: theme.spacing(2),
    padding: theme.spacing(2),
    backgroundColor: theme.palette.background.default,
    borderRadius: theme.spacing(1),
  },
}));

interface CSVUploaderProps {
  onDataLoaded: (data: CSVData) => void;
  onError: (error: string) => void;
}

export const CSVUploader: React.FC<CSVUploaderProps> = ({ onDataLoaded, onError }) => {
  const classes = useStyles();
  const [loading, setLoading] = useState(false);
  const [fileName, setFileName] = useState<string>('');
  const [dragOver, setDragOver] = useState(false);

  const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
  const LARGE_FILE_THRESHOLD = 1 * 1024 * 1024; // 1MB

  const parseCSV = useCallback(
    (file: File) => {
      if (file.size > MAX_FILE_SIZE) {
        onError('File size exceeds 10MB limit');
        return;
      }

      setLoading(true);
      setFileName(file.name);

      const useLargeFileParser = file.size > LARGE_FILE_THRESHOLD;

      if (useLargeFileParser && typeof Worker !== 'undefined') {
        // Use Web Worker for large files
        const worker = new Worker(
          new URL('../workers/csvParser.worker.ts', import.meta.url),
        );

        worker.postMessage({ file, action: 'parse' });

        worker.onmessage = (e: MessageEvent) => {
          if (e.data.success) {
            onDataLoaded(e.data.data);
          } else {
            onError(e.data.error);
          }
          setLoading(false);
          worker.terminate();
        };

        worker.onerror = () => {
          onError('Worker error occurred');
          setLoading(false);
          worker.terminate();
        };
      } else {
        // Standard parsing for smaller files
        Papa.parse(file, {
          complete: results => {
            try {
              const headers = results.data[0] as string[];
              const rows = (results.data.slice(1) as any[][]).filter(row =>
                row.some(cell => cell !== ''),
              );

              onDataLoaded({
                headers,
                rows,
                rowCount: rows.length,
              });
            } catch (err) {
              onError('Failed to parse CSV file');
            }
            setLoading(false);
          },
          error: error => {
            onError(error.message);
            setLoading(false);
          },
          skipEmptyLines: true,
        });
      }
    },
    [onDataLoaded, onError],
  );

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (!file.name.endsWith('.csv')) {
        onError('Please select a CSV file');
        return;
      }
      parseCSV(file);
    }
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragOver(false);
    const file = event.dataTransfer.files[0];
    if (file) {
      if (!file.name.endsWith('.csv')) {
        onError('Please select a CSV file');
        return;
      }
      parseCSV(file);
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  return (
    <Box>
      <Paper
        className={`${classes.uploadArea} ${dragOver ? 'dragover' : ''}`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        <input
          accept=".csv"
          style={{ display: 'none' }}
          id="csv-upload"
          type="file"
          onChange={handleFileSelect}
          disabled={loading}
        />
        <label htmlFor="csv-upload" style={{ cursor: 'pointer' }}>
          <CloudUpload className={classes.uploadIcon} />
          <Typography variant="h6" gutterBottom>
            Upload CSV File
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Drag and drop or click to select (max 10MB)
          </Typography>
          <Box mt={2}>
            <Button
              variant="contained"
              color="primary"
              component="span"
              disabled={loading}
              startIcon={<Description />}
            >
              Select File
            </Button>
          </Box>
        </label>
      </Paper>

      {loading && (
        <Box mt={2}>
          <LinearProgress />
          <Typography variant="body2" align="center" style={{ marginTop: 8 }}>
            Parsing {fileName}...
          </Typography>
        </Box>
      )}

      {fileName && !loading && (
        <Paper className={classes.fileInfo}>
          <Typography variant="body2">
            <strong>File:</strong> {fileName}
          </Typography>
        </Paper>
      )}
    </Box>
  );
};
