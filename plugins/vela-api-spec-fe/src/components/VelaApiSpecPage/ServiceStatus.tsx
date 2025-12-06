import React from 'react';
import { InfoCard } from '@backstage/core-components';
import { Box, Typography, Chip } from '@material-ui/core';
import { useStyles } from './styles';
import { ServiceStatusProps } from './types';

export function ServiceStatus({ health, schemas }: ServiceStatusProps) {
  const classes = useStyles();

  return (
    <InfoCard title="Service Status">
      <Box display="flex" alignItems="center">
        <Typography variant="body1">Plugin Status:</Typography>
        {health && (
          <Chip
            label={health.status === 'ok' ? 'Healthy' : 'Unhealthy'}
            color={health.status === 'ok' ? 'primary' : 'secondary'}
            size="small"
            className={classes.statusChip}
          />
        )}
      </Box>
      {schemas && (
        <Box mt={2}>
          <Typography variant="body2">
            Available Components: {Object.keys(schemas).length}
          </Typography>
          <Box mt={1}>
            {Object.keys(schemas).map(type => (
              <Chip
                key={type}
                label={type}
                size="small"
                style={{ margin: 4 }}
              />
            ))}
          </Box>
        </Box>
      )}
    </InfoCard>
  );
}
