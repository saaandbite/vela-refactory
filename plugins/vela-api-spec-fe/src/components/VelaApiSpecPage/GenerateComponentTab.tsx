import React from 'react';
import {
  Typography,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@material-ui/core';
import { useStyles } from './styles';
import { GenerateComponentProps } from './types';

export function GenerateComponentTab({
  selectedComponentType,
  setSelectedComponentType,
  schemas,
  loading,
  onGenerate,
}: GenerateComponentProps) {
  const classes = useStyles();

  return (
    <>
      <Typography variant="h6" gutterBottom>
        Generate Component
      </Typography>
      <FormControl fullWidth className={classes.formControl}>
        <InputLabel>Component Type</InputLabel>
        <Select
          value={selectedComponentType}
          onChange={e => setSelectedComponentType(e.target.value as string)}
        >
          {schemas &&
            Object.keys(schemas).map(type => (
              <MenuItem key={type} value={type}>
                {type}
              </MenuItem>
            ))}
        </Select>
      </FormControl>
      <Button
        variant="contained"
        color="primary"
        onClick={onGenerate}
        disabled={loading}
        className={classes.button}
      >
        Generate Component
      </Button>
    </>
  );
}
