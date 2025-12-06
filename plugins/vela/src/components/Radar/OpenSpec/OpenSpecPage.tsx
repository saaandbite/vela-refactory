import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Box, Typography, Snackbar, makeStyles } from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import { Description } from '@material-ui/icons';
import { UrlInput } from './components/UrlInput';
import { ContentDisplay } from './components/ContentDisplay';
import { SpecGeneratorControls } from './components/SpecGeneratorControls';
import { DocumentViewer } from './components/DocumentViewer';
import { ExportButton } from './components/ExportButton';
import { extractContent } from './services/jinaService';
import {
  generateRequirements,
  generateDesign,
  generateTasks,
} from './services/specGeneratorService';
import { JinaResponse, SpecDocuments } from './types';

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(4),
    maxWidth: 1400,
    margin: '0 auto',
    backgroundColor: theme.palette.background.default,
    minHeight: '100vh',
  },
  header: {
    marginBottom: theme.spacing(4),
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: theme.spacing(3),
    padding: theme.spacing(4),
    backgroundColor: theme.palette.background.paper,
    borderRadius: theme.spacing(3),
    border: `2px solid ${theme.palette.divider}`,
    boxShadow:
      theme.palette.type === 'dark'
        ? '0 4px 12px rgba(0, 0, 0, 0.5)'
        : '0 4px 12px rgba(0, 0, 0, 0.08)',
  },
  headerContent: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(3),
  },
  headerIcon: {
    fontSize: 56,
    color: theme.palette.primary.main,
    padding: theme.spacing(2),
    backgroundColor: theme.palette.action.selected,
    borderRadius: theme.spacing(2),
  },
  subtitle: {
    color: theme.palette.text.secondary,
    marginTop: theme.spacing(0.5),
    fontSize: '1rem',
  },
}));

export const OpenSpecPage: React.FC = () => {
  const classes = useStyles();
  const location = useLocation();

  const [jinaContent, setJinaContent] = useState<JinaResponse | null>(null);
  const [documents, setDocuments] = useState<Partial<SpecDocuments>>({});
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState<
    'requirements' | 'design' | 'tasks' | undefined
  >();
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const [sourceUrl, setSourceUrl] = useState<string>('');

  // Check if we have preloaded content from Web Content Analyzer
  useEffect(() => {
    const state = location.state as any;
    if (state?.fromAnalyzer && state?.preloadedContent) {
      setJinaContent({
        content: state.preloadedContent,
        title: 'Analyzed Content',
        url: state.preloadedUrl || '',
        extractedAt: new Date(),
      });
      setSourceUrl(state.preloadedUrl || '');
      setSuccess('Content loaded from Web Content Analyzer!');
    }
  }, [location]);

  const handleUrlSubmit = async (url: string) => {
    setLoading(true);
    setError('');
    try {
      const content = await extractContent(url);
      setJinaContent(content);
      setSourceUrl(url);
      setSuccess('Content extracted successfully!');
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Unknown error';
      setError(`Failed to extract content: ${errorMsg}`);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateRequirements = async (model: string) => {
    if (!jinaContent) return;

    setLoading(true);
    setCurrentStep('requirements');
    setError('');
    try {
      const result = await generateRequirements(jinaContent.content, model);
      setDocuments(prev => ({
        ...prev,
        requirements: result.document,
        metadata: {
          sourceUrl,
          generatedAt: new Date(),
          model,
          version: '1.0',
        },
      }));
      setSuccess('Requirements generated successfully!');
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Unknown error';
      setError(`Failed to generate requirements: ${errorMsg}`);
    } finally {
      setLoading(false);
      setCurrentStep(undefined);
    }
  };

  const handleGenerateDesign = async (model: string) => {
    if (!jinaContent || !documents.requirements) return;

    setLoading(true);
    setCurrentStep('design');
    setError('');
    try {
      const result = await generateDesign(
        jinaContent.content,
        model,
        documents.requirements,
      );
      setDocuments(prev => ({
        ...prev,
        design: result.document,
      }));
      setSuccess('Design generated successfully!');
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Unknown error';
      setError(`Failed to generate design: ${errorMsg}`);
    } finally {
      setLoading(false);
      setCurrentStep(undefined);
    }
  };

  const handleGenerateTasks = async (model: string) => {
    if (!jinaContent || !documents.requirements || !documents.design) return;

    setLoading(true);
    setCurrentStep('tasks');
    setError('');
    try {
      const result = await generateTasks(
        jinaContent.content,
        model,
        documents.requirements,
        documents.design,
      );
      setDocuments(prev => ({
        ...prev,
        tasks: result.document,
      }));
      setSuccess('Tasks generated successfully!');
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Unknown error';
      setError(`Failed to generate tasks: ${errorMsg}`);
    } finally {
      setLoading(false);
      setCurrentStep(undefined);
    }
  };

  const handleEdit = (docType: string, content: string) => {
    // TODO: Implement edit functionality
    console.log('Edit:', docType, content);
  };

  const handleRegenerate = async (docType: string) => {
    // TODO: Implement regenerate functionality
    console.log('Regenerate:', docType);
  };

  return (
    <Box className={classes.root}>
      <Box className={classes.header}>
        <Box className={classes.headerContent}>
          <Description className={classes.headerIcon} />
          <Box>
            <Typography variant="h4">OpenSpec Generator</Typography>
            <Typography variant="body2" className={classes.subtitle}>
              Generate technical specifications from any URL
            </Typography>
          </Box>
        </Box>
        <ExportButton documents={documents} sourceUrl={sourceUrl} />
      </Box>

      <UrlInput onSubmit={handleUrlSubmit} loading={loading} error={error} />

      {jinaContent && (
        <ContentDisplay
          content={jinaContent.content}
          loading={loading}
        />
      )}

      {jinaContent && (
        <SpecGeneratorControls
          hasContent={!!jinaContent}
          hasRequirements={!!documents.requirements}
          hasDesign={!!documents.design}
          onGenerateRequirements={handleGenerateRequirements}
          onGenerateDesign={handleGenerateDesign}
          onGenerateTasks={handleGenerateTasks}
          loading={loading}
          currentStep={currentStep}
        />
      )}

      <DocumentViewer
        documents={documents}
        onEdit={handleEdit}
        onRegenerate={handleRegenerate}
      />

      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={() => setError('')}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={() => setError('')} severity="error">
          {error}
        </Alert>
      </Snackbar>

      <Snackbar
        open={!!success}
        autoHideDuration={4000}
        onClose={() => setSuccess('')}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={() => setSuccess('')} severity="success">
          {success}
        </Alert>
      </Snackbar>
    </Box>
  );
};
