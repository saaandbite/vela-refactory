import React from 'react';
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  makeStyles,
} from '@material-ui/core';
import { StructuredData } from '../types';

const useStyles = makeStyles(theme => ({
  paper: {
    padding: theme.spacing(3),
  },
  title: {
    marginBottom: theme.spacing(2),
  },
  tableContainer: {
    maxHeight: 600,
  },
  headerCell: {
    fontWeight: 'bold',
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
  },
}));

interface DataTableProps {
  data: StructuredData;
}

export const DataTable: React.FC<DataTableProps> = ({ data }) => {
  const classes = useStyles();

  if (!data.headers.length || !data.rows.length) {
    return (
      <Paper className={classes.paper}>
        <Typography variant="body1" color="textSecondary">
          No structured data available
        </Typography>
      </Paper>
    );
  }

  return (
    <Paper className={classes.paper}>
      <Typography variant="h6" className={classes.title}>
        Extracted Data ({data.rows.length} rows)
      </Typography>
      <TableContainer className={classes.tableContainer}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              {data.headers.map((header, index) => (
                <TableCell key={index} className={classes.headerCell}>
                  {header}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {data.rows.map((row, rowIndex) => (
              <TableRow key={rowIndex} hover>
                {row.map((cell, cellIndex) => (
                  <TableCell key={cellIndex}>{cell}</TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};
