import React, { useState, useMemo } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  TableSortLabel,
  Paper,
  TextField,
  Box,
  Tooltip,
  makeStyles,
} from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  tableContainer: {
    maxHeight: 600,
    border: `2px solid ${theme.palette.divider}`,
    borderRadius: theme.spacing(2),
    overflow: 'auto',
    boxShadow: theme.palette.type === 'dark'
      ? '0 4px 12px rgba(0, 0, 0, 0.5)'
      : '0 4px 12px rgba(0, 0, 0, 0.06)',
    backgroundColor: theme.palette.background.paper,
    '&::-webkit-scrollbar': {
      width: 12,
      height: 12,
    },
    '&::-webkit-scrollbar-track': {
      backgroundColor: theme.palette.action.hover,
      borderRadius: 6,
    },
    '&::-webkit-scrollbar-thumb': {
      backgroundColor: theme.palette.action.selected,
      borderRadius: 6,
      border: `2px solid ${theme.palette.background.paper}`,
      '&:hover': {
        backgroundColor: theme.palette.action.disabled,
      },
    },
  },
  headerCell: {
    fontWeight: 700,
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
    position: 'sticky',
    top: 0,
    zIndex: 10,
    borderBottom: `3px solid ${theme.palette.primary.dark}`,
    fontSize: '0.95rem',
    whiteSpace: 'nowrap',
    minWidth: 120,
  },
  filterBox: {
    marginBottom: theme.spacing(3),
    '& .MuiOutlinedInput-root': {
      borderRadius: theme.spacing(2),
      backgroundColor: theme.palette.background.paper,
    },
  },
  truncatedCell: {
    maxWidth: 300,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    cursor: 'help',
  },
  tableRow: {
    backgroundColor: theme.palette.background.paper,
    '&:hover': {
      backgroundColor: theme.palette.action.hover,
      cursor: 'pointer',
    },
    '&:nth-of-type(even)': {
      backgroundColor: theme.palette.action.selected,
    },
  },
  tableCell: {
    padding: theme.spacing(2),
    borderBottom: `1px solid ${theme.palette.divider}`,
    minWidth: 100,
  },
  paginationContainer: {
    marginTop: theme.spacing(2),
    display: 'flex',
    justifyContent: 'flex-end',
    backgroundColor: theme.palette.background.paper,
    borderRadius: theme.spacing(2),
    border: `1px solid ${theme.palette.divider}`,
  },
}));

interface DataTableProps {
  headers: string[];
  rows: any[][];
}

type Order = 'asc' | 'desc';

export const DataTable: React.FC<DataTableProps> = ({ headers, rows }) => {
  const classes = useStyles();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(50);
  const [orderBy, setOrderBy] = useState<number>(-1);
  const [order, setOrder] = useState<Order>('asc');
  const [filter, setFilter] = useState('');

  const handleSort = (columnIndex: number) => {
    const isAsc = orderBy === columnIndex && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(columnIndex);
  };

  const filteredAndSortedRows = useMemo(() => {
    let processedRows = [...rows];

    // Filter
    if (filter) {
      processedRows = processedRows.filter(row =>
        row.some(cell =>
          String(cell).toLowerCase().includes(filter.toLowerCase()),
        ),
      );
    }

    // Sort
    if (orderBy >= 0) {
      processedRows.sort((a, b) => {
        const aVal = a[orderBy];
        const bVal = b[orderBy];
        
        const aNum = Number(aVal);
        const bNum = Number(bVal);
        
        if (!isNaN(aNum) && !isNaN(bNum)) {
          return order === 'asc' ? aNum - bNum : bNum - aNum;
        }
        
        const aStr = String(aVal).toLowerCase();
        const bStr = String(bVal).toLowerCase();
        
        if (order === 'asc') {
          return aStr < bStr ? -1 : aStr > bStr ? 1 : 0;
        }
        return aStr > bStr ? -1 : aStr < bStr ? 1 : 0;
      });
    }

    return processedRows;
  }, [rows, filter, orderBy, order]);

  const paginatedRows = useMemo(() => {
    const start = page * rowsPerPage;
    return filteredAndSortedRows.slice(start, start + rowsPerPage);
  }, [filteredAndSortedRows, page, rowsPerPage]);

  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <Box>
      <Box className={classes.filterBox}>
        <TextField
          fullWidth
          label="Search Data"
          variant="outlined"
          size="medium"
          value={filter}
          onChange={e => {
            setFilter(e.target.value);
            setPage(0);
          }}
          placeholder="Type to search across all columns..."
          InputProps={{
            startAdornment: <Box mr={1}>🔍</Box>,
          }}
        />
      </Box>

      <TableContainer component={Paper} className={classes.tableContainer} elevation={0}>
        <Table stickyHeader size="medium">
          <TableHead>
            <TableRow>
              {headers.map((header, index) => (
                <TableCell key={index} className={classes.headerCell}>
                  <TableSortLabel
                    active={orderBy === index}
                    direction={orderBy === index ? order : 'asc'}
                    onClick={() => handleSort(index)}
                    style={{ color: 'inherit' }}
                  >
                    {header}
                  </TableSortLabel>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedRows.map((row, rowIndex) => (
              <TableRow key={rowIndex} className={classes.tableRow}>
                {row.map((cell, cellIndex) => {
                  const cellContent = String(cell || '');
                  const isTruncated = cellContent.length > 80;
                  
                  return (
                    <TableCell key={cellIndex} className={classes.tableCell}>
                      {isTruncated ? (
                        <Tooltip title={cellContent} arrow placement="top" interactive>
                          <div className={classes.truncatedCell}>
                            {cellContent}
                          </div>
                        </Tooltip>
                      ) : (
                        cellContent
                      )}
                    </TableCell>
                  );
                })}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Box className={classes.paginationContainer}>
        <TablePagination
          rowsPerPageOptions={[25, 50, 100, 200]}
          component="div"
          count={filteredAndSortedRows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Box>
    </Box>
  );
};
