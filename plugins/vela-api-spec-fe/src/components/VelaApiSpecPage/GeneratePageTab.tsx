import { Typography, TextField, Button } from '@material-ui/core';
import { useStyles } from './styles';
import { GeneratePageProps } from './types';

export function GeneratePageTab({
  pagePath,
  setPagePath,
  pageTitle,
  setPageTitle,
  loading,
  onGenerate,
}: GeneratePageProps) {
  const classes = useStyles();

  return (
    <>
      <Typography variant="h6" gutterBottom>
        Generate Page Configuration
      </Typography>
      <TextField
        label="Page Path"
        value={pagePath}
        onChange={e => setPagePath(e.target.value)}
        fullWidth
        className={classes.formControl}
        placeholder="/about"
      />
      <TextField
        label="Page Title"
        value={pageTitle}
        onChange={e => setPageTitle(e.target.value)}
        fullWidth
        className={classes.formControl}
      />
      <Button
        variant="contained"
        color="primary"
        onClick={onGenerate}
        disabled={loading}
        className={classes.button}
      >
        Generate Page
      </Button>
    </>
  );
}
