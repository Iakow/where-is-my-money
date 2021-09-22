import React, { useEffect, useState } from 'react';

import { makeStyles } from '@material-ui/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import { TableSortLabel } from '@material-ui/core';
import FilterListIcon from '@material-ui/icons/FilterList';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';
import EditIcon from '@material-ui/icons/Edit';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import Popover from '@material-ui/core/Popover';

import { removeTransaction } from '../data/firebase';

import styles from '../style';
import { getDateString } from '../utils';
import Filters from '../components/Filters';

const useStyles = makeStyles({
  outcome: {
    color: 'red',
  },
  income: {
    color: 'green',
  },
  /* head: {
    '& th': {
      backgroundColor: '#0a0a50',
      color: 'white',
    },
  }, */
});

const comparator = (prop, desc = true) => (a, b) => {
  const order = desc ? -1 : 1;

  if (a[prop] < b[prop]) {
    return -1 * order;
  }

  if (a[prop] > b[prop]) {
    return 1 * order;
  }

  return 0 * order;
};

export default function List({ transactions, categories, openForm }) {
  const classes = useStyles();

  const [columns, setColumns] = useState([
    { name: 'Date', sortable: true, active: true },
    { name: 'Sum', sortable: true, active: false, numeric: true },
    { name: 'Category', sortable: true, active: false },
    { name: 'Comment', sortable: true, active: false },
    { name: '', sortable: false },
  ]);

  const [rows, setRows] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);

  const onSortClick = index => () => {
    setColumns(
      columns.map((column, i) => ({
        ...column,
        active: index === i,
        order: (index === i && (column.order === 'desc' ? 'asc' : 'desc')) || undefined,
      })),
    );
    setRows(
      rows
        .slice()
        .sort(comparator(columns[index].name.toLowerCase(), columns[index].order === 'desc')),
    );
  };

  const [filters, setFilters] = useState({
    filterMoneyway: 0,
    filterDate: {
      firstDate: { dateValue: 0, isEnabled: false },
      lastDate: { dateValue: Date.now(), isEnabled: false },
    },
  });

  useEffect(() => {
    /* filterTransactions(filters); */
    /* нужно применить компаратор, но сперва как-то узнать какая из сортировок активна и куда */
    /* найти sortable: true, active: true и извлечь order*/

    const x = columns.find(item => item.active === true); // нихуя не безопасно

    setRows(
      Object.entries({ ...transactions })
        .map(item => ({ id: item[0], ...item[1] }))
        .sort(comparator(x.name.toLowerCase(), x.order)),
    );
  }, [transactions]);

  let totalSum = 0;

  function handleFilterControlls(name, value) {
    const newFilterState = { ...filters };
    if (name == 'filterMoneyway') {
      newFilterState.filterMoneyway = +value;
    }

    if (name == 'firstDate' || name == 'lastDate') {
      newFilterState.filterDate[name] = value;
    }

    setFilters(newFilterState);
  }

  function filterTransactions() {
    // как-то оно подозрительно похоже на редюсер
    let filteredTransactions = [...rows];

    if (filters.filterDate.firstDate.isEnabled) {
      filteredTransactions = filteredTransactions.filter(
        transaction => transaction.date >= filters.filterDate.firstDate.dateValue,
      );
    }

    if (filters.filterDate.lastDate.isEnabled) {
      filteredTransactions = filteredTransactions.filter(
        transaction => transaction.date <= filters.filterDate.lastDate.dateValue,
      );
    }

    if (filters.filterMoneyway !== 0) {
      filteredTransactions = filteredTransactions.filter(
        transaction => filters.filterMoneyway * transaction.sum > 0,
      );
    }
    console.log(filteredTransactions);
    return filteredTransactions;
  }

  const handleClick = event => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  // ????????????????????????
  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

  return (
    <>
      <Paper /* className={styles.list} */>
        <Table stickyHeader size="small">
          <TableHead className={classes.head}>
            <TableRow>
              {columns.map((column, index) => {
                if (column.sortable) {
                  return (
                    <TableCell key={column.name} align={column.numeric ? 'right' : 'inherit'}>
                      <TableSortLabel
                        active={column.active}
                        direction={column.order}
                        onClick={onSortClick(index)}
                      >
                        {column.name}
                      </TableSortLabel>
                    </TableCell>
                  );
                } else {
                  return (
                    <TableCell key={column.name} align="right">
                      <Tooltip title="Filter list">
                        <IconButton aria-label="filter list" onClick={handleClick}>
                          <FilterListIcon />
                        </IconButton>
                      </Tooltip>
                      <Popover
                        id={id}
                        open={open}
                        anchorEl={anchorEl}
                        onClose={handleClose}
                        anchorOrigin={{
                          vertical: 'bottom',
                          horizontal: 'center',
                        }}
                        transformOrigin={{
                          vertical: 'top',
                          horizontal: 'center',
                        }}
                      >
                        <Filters
                          value={filters}
                          upFilterState={handleFilterControlls}
                          totalSelectedSum={totalSum}
                        />
                      </Popover>
                    </TableCell>
                  );
                }
              })}
            </TableRow>
          </TableHead>

          <TableBody>
            {filterTransactions() // надо это делать на основе стейта фильтра
              .map(transaction => {
                const { date, category, comment, sum, id } = transaction;
                const categoryGroup = sum < 0 ? 'outcome' : 'income';
                totalSum += sum;
                const color = { outcome: 'red', income: 'green' };

                return (
                  <TableRow hover={true} key={id} id={id}>
                    <TableCell>{new Date(date).toLocaleString()}</TableCell>

                    <TableCell align="right" className={classes[categoryGroup]}>
                      {sum}
                    </TableCell>

                    <TableCell>{categories[categoryGroup][category]}</TableCell>

                    <TableCell>{comment}</TableCell>

                    <TableCell align="right">
                      <IconButton
                        aria-label="filter list"
                        onClick={e => {
                          openForm(id);
                        }}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton aria-label="filter list" onClick={e => removeTransaction(id)}>
                        <DeleteForeverIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </Paper>
    </>
  );
}
