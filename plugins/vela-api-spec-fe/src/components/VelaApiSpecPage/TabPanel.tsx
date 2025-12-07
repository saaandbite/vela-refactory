import { Box } from '@material-ui/core';
import { useStyles } from './styles';
import { TabPanelProps } from './types';

export function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  const classes = useStyles();

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      {...other}
    >
      {value === index && <Box className={classes.tabPanel}>{children}</Box>}
    </div>
  );
}
