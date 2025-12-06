import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Paper, Typography, Box, makeStyles } from '@material-ui/core';
import { SentimentAnalysis } from '../types';

const useStyles = makeStyles(theme => ({
  chartContainer: {
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
    fontWeight: 700,
    fontSize: '1.25rem',
    color: theme.palette.text.primary,
  },
  legend: {
    display: 'flex',
    justifyContent: 'center',
    gap: theme.spacing(4),
    marginTop: theme.spacing(4),
    padding: theme.spacing(2.5),
    backgroundColor: theme.palette.action.hover,
    borderRadius: theme.spacing(2),
    border: `1px solid ${theme.palette.divider}`,
  },
  legendItem: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1.5),
  },
  legendColor: {
    width: 24,
    height: 24,
    borderRadius: 8,
    boxShadow: theme.palette.type === 'dark'
      ? '0 2px 4px rgba(0, 0, 0, 0.5)'
      : '0 2px 4px rgba(0, 0, 0, 0.15)',
  },
  legendText: {
    fontWeight: 600,
    color: theme.palette.text.primary,
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

  console.log('📊 SentimentChart rendering');
  console.log('  - Positive:', sentiment.positive, typeof sentiment.positive);
  console.log('  - Negative:', sentiment.negative, typeof sentiment.negative);
  console.log('  - Neutral:', sentiment.neutral, typeof sentiment.neutral);
  console.log('  - Data length:', sentiment.data?.length);
  console.log('  - Sample data items:', sentiment.data?.slice(0, 3));

  const data = [
    { name: 'Positive', value: sentiment.positive, color: COLORS.positive },
    { name: 'Negative', value: sentiment.negative, color: COLORS.negative },
    { name: 'Neutral', value: sentiment.neutral, color: COLORS.neutral },
  ].filter(item => item.value > 0);

  console.log('📊 Chart data after filtering:', data);

  const total = sentiment.positive + sentiment.negative + sentiment.neutral;
  console.log('📊 Total count:', total);

  if (total === 0 && sentiment.data && sentiment.data.length > 0) {
    console.error('⚠️ PROBLEM: We have data but total is 0!');
    console.error('This means sentiment values are not being counted correctly');
  }

  const renderCustomLabel = (entry: any) => {
    const percent = ((entry.value / total) * 100).toFixed(1);
    return `${percent}%`;
  };

  // If no data, show message
  if (total === 0 || data.length === 0) {
    return (
      <Paper className={classes.chartContainer} elevation={0}>
        <Typography variant="h6" className={classes.title}>
          Sentiment Distribution
        </Typography>
        <Box display="flex" justifyContent="center" alignItems="center" height={300}>
          <Typography variant="body1" color="textSecondary">
            No sentiment data available
          </Typography>
        </Box>
      </Paper>
    );
  }

  return (
    <Paper className={classes.chartContainer} elevation={0}>
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
            <Typography variant="body2" className={classes.legendText}>
              {item.name}: <strong>{item.value}</strong> ({((item.value / total) * 100).toFixed(0)}%)
            </Typography>
          </Box>
        ))}
      </Box>
    </Paper>
  );
};
