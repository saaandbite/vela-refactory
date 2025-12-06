import { makeStyles } from '@material-ui/core/styles';

export const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(3),
  },
  formControl: {
    marginBottom: theme.spacing(2),
    minWidth: 200,
  },
  button: {
    marginTop: theme.spacing(2),
    marginRight: theme.spacing(1),
  },
  resultBox: {
    marginTop: theme.spacing(3),
    padding: theme.spacing(2),
    backgroundColor: theme.palette.background.default,
    borderRadius: theme.shape.borderRadius,
  },
  statusChip: {
    marginLeft: theme.spacing(1),
  },
  tabPanel: {
    padding: theme.spacing(3, 0),
  },
}));
