import React, { useState } from 'react';
import { Button, CircularProgress, makeStyles } from '@material-ui/core';
import { GetApp } from '@material-ui/icons';
import { SpecDocuments } from '../types';
import { exportToPDF } from '../utils/pdfExporter';

const useStyles = makeStyles(theme => ({
  button: {
    padding: theme.spacing(1.5, 3),
    fontWeight: 600,
    textTransform: 'none',
    fontSize: '1rem',
  },
}));

interface ExportButtonProps {
  documents: Partial<SpecDocuments>;
  sourceUrl: string;
  disabled?: boolean;
}

export const ExportButton: React.FC<ExportButtonProps> = ({
  documents,
  sourceUrl,
  disabled = false,
}) => {
  const classes = useStyles();
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    setIsExporting(true);
    try {
      await exportToPDF({
        documents,
        sourceUrl,
        fileName: `openspec-${new Date().getTime()}.pdf`,
      });
    } catch (error) {
      console.error('Failed to export PDF:', error);
    } finally {
      setIsExporting(false);
    }
  };

  const hasAnyDocument =
    documents.requirements || documents.design || documents.tasks;
  const isDisabled = disabled || !hasAnyDocument || isExporting;

  return (
    <Button
      variant="contained"
      color="secondary"
      className={classes.button}
      onClick={handleExport}
      disabled={isDisabled}
      startIcon={
        isExporting ? <CircularProgress size={20} color="inherit" /> : <GetApp />
      }
    >
      {isExporting ? 'Generating PDF...' : 'Export to PDF'}
    </Button>
  );
};
