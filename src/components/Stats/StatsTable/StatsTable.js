import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Table, TableBody, Paper } from "@material-ui/core";

import { TableHeader } from "./TableHeader";
import { TransactionRow } from "./TransactionRow";

const useStyles = makeStyles(() => ({
  statsTable: {
    overflowY: "auto",
    flexGrow: 1,
    backgroundColor: "transparent",
  },
}));

export function StatsTable({ transactions, openTransactionForm }) {
  const classes = useStyles();
  
  const [filters, setFilters] = useState({
    filterMoneyway: 0,
  });

  const [sorting, setSorting] = useState({
    name: "date",
    order: "desc",
  });

  const handleSort = (name, order) => {
    setSorting({ name, order });
  };

  const handleFilter = (value) => {
    setFilters(value);
  };

  const selectTransactions = () => {
    let selectedTransactions = [...transactions];

    if (filters.filterMoneyway !== 0) {
      selectedTransactions = selectedTransactions.filter(
        (transaction) => filters.filterMoneyway * transaction.sum > 0
      );
    }

    selectedTransactions.sort((a, b) => {
      const order = sorting.order === "desc" ? -1 : 1;
      const prop = sorting.name;

      if (a[prop] < b[prop]) return -1 * order;
      if (a[prop] > b[prop]) return 1 * order;
      return 0;
    });

    return selectedTransactions;
  };

  return (
    <div className={classes.statsTable}>
      <Table stickyHeader size="small" >
        <TableHeader
          sortBy={sorting.name}
          sortOrder={sorting.order}
          filters={filters}
          handleSort={handleSort}
          handleFilter={handleFilter}
        />

        <TableBody>
          {selectTransactions().map((transaction) => (
            <TransactionRow
              key={transaction.id}
              transaction={transaction}
              openTransactionForm={openTransactionForm}
            />
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
