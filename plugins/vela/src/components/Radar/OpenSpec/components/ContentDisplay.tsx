import React, { useState } from 'react';
import {
  Box,
  Typography,
  IconButton,
  Collapse,
  makeStyles,
  Tooltip,
} from '@material-ui/core';
import {
  ExpandMore,
  ExpandLess,
  FileCopy,
  CheckCircle,
} from '@material-ui/icons';

const useStyles = makeStyles(theme => ({
  container: {
    marginTop: theme.spacing(3),
    padding: theme.spacing(3),
    backgroundColor: theme.palette.background.paper,
    borderRadius: theme.spacing(2),
    border: `1px solid ${theme.palette.divider}`,
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing(2),
  },
  title: {
    fontWeight: 600,
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1),
  },
  actions: {
    display: 'flex',
    gap: theme.spacing(1),
  },
  content: {
    padding: theme.spacing(2),
    backgroundColor: theme.palette.background.default,
    borderRadius: theme.spacing(1),
    fontFamily: 'monospace',
    fontSize: '0.875rem',
    lineHeight: 1.6,
    whiteSpace: 'pre-wrap',
    wordBreak: 'break-word',
    maxHeight: 400,
    overflowY: 'auto',
  },
  stats: {
    marginTop: theme.spacing(1),
    color: theme.palette.text.secondary,
    fontSize: '0.875rem',
  },
}));

interface ContentDisplayProps {
  content: string;
  loading: boolean;
  onCopy?: () => void;
}

export const ContentDisplay: React.FC<ContentDisplayProps> = ({
  content,
  loading,
  onCopy,
}) => {
  const classes = useStyles();
  const [expanded, setExpanded] = useState(true);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    if (onCopy) onCopy();
  };

  const charCount = content.length;
  const wordCount = content.split(/\s+/).filter(Boolean).length;

  return (
    <Box className={classes.container}>
      <Box className={classes.header}>
        <Typography variant="h6" className={classes.title}>
          Extracted Content
        </Typography>
        <Box className={classes.actions}>
          <Tooltip title={copied ? 'Copied!' : 'Copy to clipboard'}>
            <IconButton size="small" onClick={handleCopy} disabled={loading}>
              {copied ? <CheckCircle color="primary" /> : <FileCopy />}
            </IconButton>
          </Tooltip>
          <IconButton
            size="small"
            onClick={() => setExpanded(!expanded)}
            disabled={loading}
          >
            {expanded ? <ExpandLess /> : <ExpandMore />}
          </IconButton>
        </Box>
      </Box>

      <Collapse in={expanded}>
        <Box className={classes.content}>{content}</Box>
        <Typography className={classes.stats}>
          {charCount.toLocaleString()} characters • {wordCount.toLocaleString()}{' '}
          words
        </Typography>
      </Collapse>
    </Box>
  );
};
