import { CodeSnippet } from '@backstage/core-components';
import {
  Typography,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
} from '@material-ui/core';
import { useStyles } from './styles';
import { ViewSchemaProps } from './types';

export function ViewSchemaTab({
  selectedComponentType,
  setSelectedComponentType,
  schemas,
  loading,
  componentSchema,
  onLoadSchema,
}: ViewSchemaProps) {
  const classes = useStyles();

  return (
    <>
      <Typography variant="h6" gutterBottom>
        View Component Schema
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
        onClick={onLoadSchema}
        disabled={loading}
        className={classes.button}
      >
        Load Schema
      </Button>
      {componentSchema && (
        <Box className={classes.resultBox}>
          <CodeSnippet
            text={JSON.stringify(componentSchema, null, 2)}
            language="json"
            showLineNumbers
          />
        </Box>
      )}
    </>
  );
}
