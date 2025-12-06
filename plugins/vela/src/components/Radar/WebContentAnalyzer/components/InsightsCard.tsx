import React from 'react';
import {
  Paper,
  Typography,
  Box,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  makeStyles,
} from '@material-ui/core';
import { EmojiObjects, TrendingUp } from '@material-ui/icons';

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
  list: {
    padding: 0,
  },
  listItem: {
    paddingLeft: 0,
  },
}));

interface InsightsCardProps {
  insights: string[];
}

export const InsightsCard: React.FC<InsightsCardProps> = ({ insights }) => {
  const classes = useStyles();

  if (!insights.length) {
    return null;
  }

  return (
    <Paper className={classes.paper}>
      <Box className={classes.title}>
        <TrendingUp color="primary" />
        <Typography variant="h6">Key Insights</Typography>
      </Box>
      <List className={classes.list}>
        {insights.map((insight, index) => (
          <ListItem key={index} className={classes.listItem}>
            <ListItemIcon>
              <EmojiObjects color="action" />
            </ListItemIcon>
            <ListItemText primary={insight} />
          </ListItem>
        ))}
      </List>
    </Paper>
  );
};
