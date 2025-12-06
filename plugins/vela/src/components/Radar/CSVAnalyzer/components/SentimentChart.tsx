import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { Paper, Typography, Box, makeStyles } from '@material-ui/core';
import { SentimentAnalysis } from '../types';

const useStyles = makeStyles(theme => ({
  chartContainer: {
    padding: theme.spacing(3),
    marginTop: theme.spacing(2),
  },
  title: {
    marginBottom: theme.spacing(2),
  },
  legend: {
    display: 'flex',
    justifyContent: 'center',
    gap: theme.spacing(3),
    marginTop: theme.spacing(2),
  },
  legendItem: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1),
  },
  legendColor: {
    width: 16,
    height: 16,
    borderRadius: 4,
  },
}));

interface SentimentChartProps {
  sentiment: SentimentAnalysis;
}

const COLORS = {
  positive: '#4caf50',
  negative: '#f44336',
  neutral: '#ff9800',
};

export const SentimentChart: React.FC<SentimentChartProps> = ({ sentiment }) => {
  const classes = useStyles();

  const data = [
    { name: 'Positive', value: sentiment.positive, color: COLORS.positive },
    { name: 'Negative', value: sentiment.negative, color: COLORS.negative },
    { name: 'Neutral', value: sentiment.neutral, color: COLORS.neutral },
  ].filter(item => item.value > 0);

  const total = sentiment.positive + sentiment.negative + sentiment.neutral;

  const renderCustomLabel = (entry: any) => {
    const percent = ((entry.value / total) * 100).toFixed(1);
    return `${percent}%`;
  };

  return (
    <Paper className={classes.chartContainer}>
      <Typography variant="h6" className={classes.title}>
        Sentiment Distribution
      </Typography>
      
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={renderCustomLabel}
            outerRadius={100}
            fill="#8884d8"
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip
            formatter={(value: number) => [
              `${value} (${((value / total) * 100).toFixed(1)}%)`,
              'Count',
            ]}
          />
        </PieChart>
      </ResponsiveContainer>

      <Box className={classes.legend}>
        {data.map(item => (
          <Box key={item.name} className={classes.legendItem}>
            <Box
              className={classes.legendColor}
              style={{ backgroundColor: item.color }}
            />
            <Typography variant="body2">
              {item.name}: {item.value}
            </Typography>
          </Box>
        ))}
      </Box>
    </Paper>
  );
};
