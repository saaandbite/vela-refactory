import { Typography, TextField, Button } from '@material-ui/core';
import { useStyles } from './styles';
import { GenerateSiteConfigProps } from './types';

export function GenerateSiteConfigTab({
  siteName,
  setSiteName,
  siteDescription,
  setSiteDescription,
  loading,
  onGenerate,
  onValidate,
  hasGeneratedResult,
}: GenerateSiteConfigProps) {
  const classes = useStyles();

  return (
    <>
      <Typography variant="h6" gutterBottom>
        Generate Site Configuration
      </Typography>
      <TextField
        label="Site Name"
        value={siteName}
        onChange={e => setSiteName(e.target.value)}
        fullWidth
        className={classes.formControl}
      />
      <TextField
        label="Site Description"
        value={siteDescription}
        onChange={e => setSiteDescription(e.target.value)}
        fullWidth
        multiline
        rows={2}
        className={classes.formControl}
      />
      <Button
        variant="contained"
        color="primary"
        onClick={onGenerate}
        disabled={loading}
        className={classes.button}
      >
        Generate
      </Button>
      {hasGeneratedResult && (
        <Button
          variant="outlined"
          color="secondary"
          onClick={onValidate}
          disabled={loading}
          className={classes.button}
        >
          Validate
        </Button>
      )}
    </>
  );
}
