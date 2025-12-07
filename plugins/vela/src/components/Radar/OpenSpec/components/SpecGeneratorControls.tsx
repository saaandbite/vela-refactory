import React, { useState } from 'react';
import {
  Box,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Typography,
  CircularProgress,
  Stepper,
  Step,
  StepLabel,
  makeStyles,
} from '@material-ui/core';
import { Description, Build, Assignment } from '@material-ui/icons';
import { AI_MODELS } from '../types';

const useStyles = makeStyles(theme => ({
  container: {
    marginTop: theme.spacing(3),
    padding: theme.spacing(3),
    backgroundColor: theme.palette.background.paper,
    borderRadius: theme.spacing(2),
    border: `1px solid ${theme.palette.divider}`,
  },
  title: {
    fontWeight: 600,
    marginBottom: theme.spacing(3),
  },
  modelSelect: {
    marginBottom: theme.spacing(3),
  },
  buttons: {
    display: 'flex',
    gap: theme.spacing(2),
    flexWrap: 'wrap',
  },
  button: {
    flex: 1,
    minWidth: 150,
    padding: theme.spacing(1.5),
    fontWeight: 600,
  },
  stepper: {
    marginTop: theme.spacing(3),
    backgroundColor: 'transparent',
  },
  modelInfo: {
    marginTop: theme.spacing(1),
    padding: theme.spacing(1.5),
    backgroundColor: theme.palette.action.hover,
    borderRadius: theme.spacing(1),
    fontSize: '0.875rem',
  },
}));

interface SpecGeneratorControlsProps {
  hasContent: boolean;
  hasRequirements: boolean;
  hasDesign: boolean;
  onGenerateRequirements: (model: string) => Promise<void>;
  onGenerateDesign: (model: string) => Promise<void>;
  onGenerateTasks: (model: string) => Promise<void>;
  loading: boolean;
  currentStep?: 'requirements' | 'design' | 'tasks';
}

export const SpecGeneratorControls: React.FC<SpecGeneratorControlsProps> = ({
  hasContent,
  hasRequirements,
  hasDesign,
  onGenerateRequirements,
  onGenerateDesign,
  onGenerateTasks,
  loading,
  currentStep,
}) => {
  const classes = useStyles();
  const [selectedModel, setSelectedModel] = useState<string>(AI_MODELS.NOVA.id);

  const models = Object.values(AI_MODELS);
  const selectedModelInfo = models.find(m => m.id === selectedModel);

  const steps = ['Requirements', 'Design', 'Tasks'];
  const activeStep = currentStep
    ? steps.indexOf(
        currentStep.charAt(0).toUpperCase() + currentStep.slice(1),
      )
    : -1;

  return (
    <Box className={classes.container}>
      <Typography variant="h6" className={classes.title}>
        Generate Specification Documents
      </Typography>

      <FormControl fullWidth variant="outlined" className={classes.modelSelect}>
        <InputLabel>AI Model</InputLabel>
        <Select
          value={selectedModel}
          onChange={e => setSelectedModel(e.target.value as string)}
          label="AI Model"
          disabled={loading}
        >
          {models.map(model => (
            <MenuItem key={model.id} value={model.id}>
              {model.name} - {model.speed} / {model.quality}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {selectedModelInfo && (
        <Box className={classes.modelInfo}>
          <strong>{selectedModelInfo.name}</strong>
          <br />
          Speed: {selectedModelInfo.speed} • Quality: {selectedModelInfo.quality}
        </Box>
      )}

      <Box className={classes.buttons}>
        <Button
          variant="contained"
          color="primary"
          className={classes.button}
          onClick={() => onGenerateRequirements(selectedModel)}
          disabled={!hasContent || loading}
          startIcon={
            loading && currentStep === 'requirements' ? (
              <CircularProgress size={20} />
            ) : (
              <Description />
            )
          }
        >
          {hasRequirements ? 'Regenerate' : 'Generate'} Requirements
        </Button>

        <Button
          variant="contained"
          color="primary"
          className={classes.button}
          onClick={() => onGenerateDesign(selectedModel)}
          disabled={!hasRequirements || loading}
          startIcon={
            loading && currentStep === 'design' ? (
              <CircularProgress size={20} />
            ) : (
              <Build />
            )
          }
        >
          {hasDesign ? 'Regenerate' : 'Generate'} Design
        </Button>

        <Button
          variant="contained"
          color="primary"
          className={classes.button}
          onClick={() => onGenerateTasks(selectedModel)}
          disabled={!hasDesign || loading}
          startIcon={
            loading && currentStep === 'tasks' ? (
              <CircularProgress size={20} />
            ) : (
              <Assignment />
            )
          }
        >
          Generate Tasks
        </Button>
      </Box>

      {(hasRequirements || hasDesign) && (
        <Stepper activeStep={activeStep} className={classes.stepper}>
          {steps.map(label => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
      )}
    </Box>
  );
};
