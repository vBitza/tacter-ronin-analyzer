import * as React from 'react';
import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useTheme, styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableHead from '@mui/material/TableHead';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableFooter from '@mui/material/TableFooter';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import IconButton from '@mui/material/IconButton';
import FirstPageIcon from '@mui/icons-material/FirstPage';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import LastPageIcon from '@mui/icons-material/LastPage';
import ArrowRightAltIcon from '@mui/icons-material/ArrowRightAlt';
import uid from '../helpers/uid';

function TablePaginationActions(props) {
  const theme = useTheme();
  const { count, page, rowsPerPage, onPageChange } = props;

  const handleFirstPageButtonClick = (event) => {
    onPageChange(event, 0);
  };

  const handleBackButtonClick = (event) => {
    onPageChange(event, page - 1);
  };

  const handleNextButtonClick = (event) => {
    onPageChange(event, page + 1);
  };

  const handleLastPageButtonClick = (event) => {
    onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
  };

  return (
    <Box sx={{
      flexShrink: 0,
      ml: 2.5,
    }}>
      <IconButton
        style={{
          color: '#A4B3BF'
        }}
        onClick={handleFirstPageButtonClick}
        disabled={page === 0}
        aria-label="first page"
      >
        {theme.direction === 'rtl' ? <LastPageIcon /> : <FirstPageIcon />}
      </IconButton>
      <IconButton
        style={{
          color: '#A4B3BF'
        }}
        onClick={handleBackButtonClick}
        disabled={page === 0}
        aria-label="previous page"
      >
        {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
      </IconButton>
      <IconButton
        style={{
          color: '#A4B3BF'
        }}
        onClick={handleNextButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="next page"
      >
        {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
      </IconButton>
      <IconButton
        style={{
          color: '#A4B3BF'
        }}
        onClick={handleLastPageButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="last page"
      >
        {theme.direction === 'rtl' ? <FirstPageIcon /> : <LastPageIcon />}
      </IconButton>
    </Box>
  );
}

TablePaginationActions.propTypes = {
  count: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
  page: PropTypes.number.isRequired,
  rowsPerPage: PropTypes.number.isRequired,
};

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: '#151719',
    color: 'white',
  },
  [`&.${tableCellClasses.body}`]: {
    color: 'white'
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  'td, th': {
    borderBottom: '1px solid #565D64'
  },
  // hide last border
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));

const StyledTablePagination = styled(TablePagination)(({  theme }) => ({
  'tfoot': {
    color: 'white'
  }
}));

export default function CustomPaginationActionsTable({tableData}) {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [data, setData] = useState([]);

  useEffect(() => {
    if (tableData.length &&
      tableData.every((item) => item.children && item.children.length !== 0)
    ) {
      setData(tableData.map((item) => [...item.children]).flat())
    } else {
      setData(tableData);
    }

  }, [tableData]);

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - data.length) : 0;

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const getTimeDifference = (timestamp) => {
    const now = new Date().getTime();
    const transactionDate = new Date(timestamp * 1000).getTime();
    const secondsDifference = (now - transactionDate) / 1000;

    const hourSeconds = 60 * 60;
    const daySeconds = hourSeconds * 24;
    const weekSeconds = daySeconds * 7;

    if (secondsDifference / weekSeconds > 0) {
      return `${Math.ceil(secondsDifference / weekSeconds)} weeks ago`
    } else if (secondsDifference / daySeconds > 0) {
      return `${secondsDifference / daySeconds} days ago`
    } else if (secondsDifference / hourSeconds > 0) {
      return `${secondsDifference/hourSeconds} hours ago`
    } else {
      return `${secondsDifference/60} minutes ago`
    };
  };

  return (
    <TableContainer component={Paper}>
      <Table
        sx={{
          minWidth: 500,
          backgroundColor: '#151719',
        }}
        size="small"
        aria-label="custom pagination table"
      >
        <TableHead>
          <StyledTableRow>
            <StyledTableCell>Date</StyledTableCell>
            <StyledTableCell>From</StyledTableCell>
            <StyledTableCell></StyledTableCell>
            <StyledTableCell>To</StyledTableCell>
            <StyledTableCell>Value</StyledTableCell>
          </StyledTableRow>
        </TableHead>

        <TableBody>
          {(rowsPerPage > 0
            ? data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            : data
          ).map((row, index) => (
            <StyledTableRow key={uid(`table-${index}`).id}>
              <StyledTableCell>
                {getTimeDifference(row.timestamp)}
              </StyledTableCell>
              <StyledTableCell>
                {row.shortName}
              </StyledTableCell>
              <StyledTableCell>
                <ArrowRightAltIcon/>
              </StyledTableCell>
              <StyledTableCell>
                {row.shortTo}
              </StyledTableCell>
              <StyledTableCell>
                {row.value}
              </StyledTableCell>
            </StyledTableRow>
          ))}

          {emptyRows > 0 && (
            <StyledTableRow style={{ height: 53 * emptyRows }}>
              <StyledTableCell colSpan={6} />
            </StyledTableRow>
          )}
        </TableBody>
        <TableFooter>
          <StyledTableRow>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
              colSpan={3}
              count={data.length}
              rowsPerPage={rowsPerPage}
              page={page}
              SelectProps={{
                inputProps: {
                  'aria-label': 'rows per page',
                },
                native: true,
              }}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              ActionsComponent={TablePaginationActions}
              style={{
                color: '#A4B3BF'
              }}
            />
          </StyledTableRow>
        </TableFooter>
      </Table>
    </TableContainer>
  );
}
