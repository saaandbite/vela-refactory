import React from 'react';
import {
  Paper,
  Typography,
  Box,
  Chip,
  makeStyles,
} from '@material-ui/core';
import { Description, Schedule, Memory } from '@material-ui/icons';

const useStyles = makeStyles(theme => ({
  paper: {
    padding: theme.spacing(3),
  },
  title: {
    marginBottom: theme.spacing(2),
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1),
  },
  summary: {
    marginBottom: theme.spacing(2),
    lineHeight: 1.6,
  },
  metadata: {
    display: 'flex',
    gap: theme.spacing(2),
    flexWrap: 'wrap',
  },
  metadataItem: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(0.5),
  },
}));

interface SummaryCardProps {
  summary: string;
  metadata: {
    url: string;
    analyzedAt: string;
    model: string;
    tokensUsed: number;
  };
}

export const SummaryCard: React.FC<SummaryCardProps> = ({ summary, metadata }) => {
  const classes = useStyles();

  return (
    <Paper className={classes.paper}>
      <Box className={classes.title}>
        <Description color="primary" />
        <Typography variant="h6">Summary</Typography>
      </Box>
      <Typography variant="body1" className={classes.summary}>
        {summary}
      </Typography>
      <Box className={classes.metadata}>
        <Chip
          icon={<Schedule />}
          label={`Analyzed: ${new Date(metadata.analyzedAt).toLocaleString()}`}
          size="small"
        />
        <Chip
          icon={<Memory />}
          label={`Model: ${metadata.model.split('/')[1]}`}
          size="small"
        />
        <Chip
          label={`Tokens: ${metadata.tokensUsed.toLocaleString()}`}
          size="small"
        />
      </Box>
    </Paper>
  );
};
