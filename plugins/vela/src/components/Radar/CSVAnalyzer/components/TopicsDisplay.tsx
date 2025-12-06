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
    padding: theme.spacing(3),
    marginTop: theme.spacing(2),
  },
  title: {
    marginBottom: theme.spacing(2),
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1),
  },
  topicCard: {
    height: '100%',
    transition: 'transform 0.2s',
    '&:hover': {
      transform: 'translateY(-4px)',
      boxShadow: theme.shadows[4],
    },
  },
  topicName: {
    fontWeight: 'bold',
    marginBottom: theme.spacing(1),
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1),
  },
  keywordChip: {
    margin: theme.spacing(0.5),
  },
  count: {
    color: theme.palette.primary.main,
    fontWeight: 'bold',
  },
}));

interface TopicsDisplayProps {
  topics: TopicAnalysis;
}

export const TopicsDisplay: React.FC<TopicsDisplayProps> = ({ topics }) => {
  const classes = useStyles();

  if (!topics.topics || topics.topics.length === 0) {
    return null;
  }

  return (
    <Paper className={classes.container}>
      <Typography variant="h6" className={classes.title}>
        <Category />
        Topic Analysis Results
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
                
                <Typography variant="body2" color="textSecondary" gutterBottom>
                  Mentions: <span className={classes.count}>{topic.count}</span>
                </Typography>

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
