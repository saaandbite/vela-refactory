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
  },
  headerCell: {
    fontWeight: 'bold',
    backgroundColor: theme.palette.background.default,
    position: 'sticky',
    top: 0,
    zIndex: 10,
  },
  filterBox: {
    marginBottom: theme.spacing(2),
  },
  truncatedCell: {
    maxWidth: 200,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
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
          label="Filter data"
          variant="outlined"
          size="small"
          value={filter}
          onChange={e => {
            setFilter(e.target.value);
            setPage(0);
          }}
          placeholder="Search across all columns..."
        />
      </Box>

      <TableContainer component={Paper} className={classes.tableContainer}>
        <Table stickyHeader size="small">
          <TableHead>
            <TableRow>
              {headers.map((header, index) => (
                <TableCell key={index} className={classes.headerCell}>
                  <TableSortLabel
                    active={orderBy === index}
                    direction={orderBy === index ? order : 'asc'}
                    onClick={() => handleSort(index)}
                  >
                    {header}
                  </TableSortLabel>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedRows.map((row, rowIndex) => (
              <TableRow key={rowIndex} hover>
                {row.map((cell, cellIndex) => {
                  const cellContent = String(cell || '');
                  const isTruncated = cellContent.length > 50;
                  
                  return (
                    <TableCell key={cellIndex}>
                      {isTruncated ? (
                        <Tooltip title={cellContent} arrow>
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

      <TablePagination
        rowsPerPageOptions={[25, 50, 100]}
        component="div"
        count={filteredAndSortedRows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Box>
  );
};
