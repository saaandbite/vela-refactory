import React from 'react';
import {
  Paper,
  Typography,
  Box,
  Chip,
  makeStyles,
  Grid,
  Card,
  CardContent,
} from '@material-ui/core';
import { Category, Label } from '@material-ui/icons';
import { TopicAnalysis } from '../types';

const useStyles = makeStyles(theme => ({
  container: {
    padding: theme.spacing(4),
    backgroundColor: theme.palette.background.paper,
    borderRadius: theme.spacing(3),
    border: `2px solid ${theme.palette.divider}`,
    boxShadow: theme.palette.type === 'dark'
      ? '0 4px 12px rgba(0, 0, 0, 0.3)'
      : '0 4px 12px rgba(0, 0, 0, 0.06)',
  },
  title: {
    marginBottom: theme.spacing(3),
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1.5),
    fontWeight: 700,
    fontSize: '1.25rem',
    color: theme.palette.text.primary,
  },
  topicCard: {
    height: '100%',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    border: `2px solid ${theme.palette.divider}`,
    borderRadius: theme.spacing(2),
    backgroundColor: theme.palette.background.paper,
    '&:hover': {
      transform: 'translateY(-8px)',
      boxShadow: theme.palette.type === 'dark'
        ? '0 12px 24px rgba(0, 0, 0, 0.6)'
        : '0 12px 24px rgba(0, 0, 0, 0.15)',
      borderColor: theme.palette.primary.main,
    },
  },
  topicName: {
    fontWeight: 700,
    marginBottom: theme.spacing(1.5),
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1),
    color: theme.palette.primary.main,
    fontSize: '1.1rem',
  },
  keywordChip: {
    margin: theme.spacing(0.5),
    fontWeight: 600,
    borderRadius: theme.spacing(1),
    backgroundColor: theme.palette.action.selected,
    color: theme.palette.primary.main,
    border: `1px solid ${theme.palette.divider}`,
  },
  count: {
    color: theme.palette.text.secondary,
    fontWeight: 700,
    fontSize: '1.1rem',
  },
  countLabel: {
    marginTop: theme.spacing(2),
    padding: theme.spacing(1.5),
    backgroundColor: theme.palette.action.hover,
    borderRadius: theme.spacing(1.5),
    border: `1px solid ${theme.palette.divider}`,
  },
}));

interface TopicsDisplayProps {
  topics: TopicAnalysis;
}

export const TopicsDisplay: React.FC<TopicsDisplayProps> = ({ topics }) => {
  const classes = useStyles();

  console.log('📊 TopicsDisplay rendering with data:', topics);
  console.log('📊 Topics array:', topics.topics);

  if (!topics.topics || topics.topics.length === 0) {
    console.log('⚠️ No topics to display - returning null');
    return null;
  }

  return (
    <Paper className={classes.container} elevation={0}>
      <Typography variant="h6" className={classes.title}>
        <Category />
        Topic Analysis
      </Typography>

      <Grid container spacing={2}>
        {topics.topics.map((topic, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card className={classes.topicCard}>
              <CardContent>
                <Typography variant="h6" className={classes.topicName}>
                  <Label fontSize="small" />
                  {topic.name}
                </Typography>
                
                <Box className={classes.countLabel}>
                  <Typography variant="body2" color="textSecondary">
                    Mentions: <span className={classes.count}>{topic.count}</span>
                  </Typography>
                </Box>

                <Box mt={2}>
                  <Typography variant="caption" color="textSecondary">
                    Keywords:
                  </Typography>
                  <Box mt={1}>
                    {topic.keywords.map((keyword, idx) => (
                      <Chip
                        key={idx}
                        label={keyword}
                        size="small"
                        color="primary"
                        variant="outlined"
                        className={classes.keywordChip}
                      />
                    ))}
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Paper>
  );
};
