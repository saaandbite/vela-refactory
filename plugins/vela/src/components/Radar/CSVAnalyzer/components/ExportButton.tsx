import React, { useState } from 'react';
import { Button, CircularProgress, makeStyles } from '@material-ui/core';
import { GetApp } from '@material-ui/icons';
import { CSVData, AnalysisResult } from '../types';
import { exportToPDF } from '../utils/pdfExporter';

const useStyles = makeStyles(theme => ({
  button: {
    marginTop: theme.spacing(2),
    padding: theme.spacing(1.5, 3),
    fontWeight: 600,
    textTransform: 'none',
    fontSize: '1rem',
    borderRadius: theme.spacing(1),
    boxShadow: theme.palette.type === 'dark'
      ? '0 2px 8px rgba(0, 0, 0, 0.4)'
      : '0 2px 8px rgba(0, 0, 0, 0.15)',
    '&:hover': {
      boxShadow: theme.palette.type === 'dark'
        ? '0 4px 12px rgba(0, 0, 0, 0.6)'
        : '0 4px 12px rgba(0, 0, 0, 0.25)',
    },
  },
  icon: {
    marginRight: theme.spacing(1),
  },
}));

interface ExportButtonProps {
  csvData: CSVData | null;
  analysisResult: AnalysisResult;
  disabled?: boolean;
}

export const ExportButton: React.FC<ExportButtonProps> = ({
  csvData,
  analysisResult,
  disabled = false,
}) => {
  const classes = useStyles();
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    if (!csvData) return;

    setIsExporting(true);
    try {
      await exportToPDF({
        csvData,
        analysisResult,
        fileName: `csv-analysis-${new Date().getTime()}.pdf`,
      });
    } catch (error) {
      console.error('Failed to export PDF:', error);
    } finally {
      setIsExporting(false);
    }
  };

  const isDisabled = disabled || !csvData || isExporting;

  return (
    <Button
      variant="contained"
      color="primary"
      className={classes.button}
      onClick={handleExport}
      disabled={isDisabled}
      startIcon={
        isExporting ? (
          <CircularProgress size={20} color="inherit" />
        ) : (
          <GetApp className={classes.icon} />
        )
      }
    >
      {isExporting ? 'Generating PDF...' : 'Export to PDF'}
    </Button>
  );
};
