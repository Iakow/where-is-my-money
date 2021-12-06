import React, { useEffect, useState } from "react";

import { makeStyles } from "@material-ui/core/styles";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { useTheme } from "@material-ui/core/styles";
// import useMediaQuery from '../../useMediaQuiery';

import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import ChatBubbleOutlineIcon from "@material-ui/icons/ChatBubbleOutline";
import TableCell from "@material-ui/core/TableCell";
import ChatIcon from "@material-ui/icons/Chat";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import { TableSortLabel } from "@material-ui/core";
import FilterListIcon from "@material-ui/icons/FilterList";
import Tooltip from "@material-ui/core/Tooltip";
import IconButton from "@material-ui/core/IconButton";
import EditIcon from "@material-ui/icons/Edit";

import Popover from "@material-ui/core/Popover";
import Chip from "@material-ui/core/Chip";
import FastfoodIcon from "@material-ui/icons/Fastfood";
import TableFooter from "@material-ui/core/TableFooter";
import { Badge } from "@material-ui/core";

import { getDateString } from "../../utils";
import Filters from "./Filters";

const useStyles = makeStyles(theme => ({
  outcome: {
    color: "red",
  },
  income: {
    color: "green",
  },
  comment: {
    fontSize: 14,
  },
  date: {
    fontSize: 14,
  },
  list: {
    overflowY: "auto",
    height: "calc(100% - 50px)",
  },
  footer: {
    backgroundColor: "#ededed",
    height: 50,
    left: 0,
    bottom: 0,
    zIndex: 2,
    position: "sticky",
    fontSize: 20,
  },
  headerCell: {
      [theme.breakpoints.down("xs")]: {
        padding: 4,
        fontSize: 10,
      },
    },
  tag: {
    margin: 0,
  },
  icon: {
    margin: 0,
  },
}));

const comparator =
  (prop, desc = true) =>
  (a, b) => {
    const order = desc ? -1 : 1;

    if (a[prop] < b[prop]) {
      return -1 * order;
    }

    if (a[prop] > b[prop]) {
      return 1 * order;
    }

    return 0 * order;
  };

export default function StatsTable({
  transactions,
  categories,
  userTags,
  openTransactionForm,
}) {
  const classes = useStyles();
  const theme = useTheme();
  const isXS = useMediaQuery(theme.breakpoints.down("xs"), { noSsr: true });
  // const isXS = useMediaQuery("(max-width: 640px)", { noSsr: true });
  console.log("mathcesTable :", isXS);

  // const isXS = false;

  const [columns, setColumns] = useState([
    { name: "Date", sortable: true, active: true },
    { name: "Sum", sortable: true, active: false, numeric: true },
    { name: "Category", sortable: true, active: false },
    { name: "Tags", sortable: true, active: false },
    { name: "Comment", sortable: true, active: false },
    { name: "", sortable: false },
  ]);

  const [rows, setRows] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);

  const [filters, setFilters] = useState({
    filterMoneyway: 0,
  });

  useEffect(() => {
    const activeSortingCell = columns.find((item) => item.active === true);

    setRows(
      [...transactions].sort(
        comparator(
          activeSortingCell.name.toLowerCase(),
          activeSortingCell.order
        )
      )
    );
  }, [transactions]);

  let totalSum = 0;

  const onSortClick = (index) => () => {
    setColumns(
      columns.map((column, i) => ({
        ...column,
        active: index === i,
        order:
          (index === i && (column.order === "desc" ? "asc" : "desc")) ||
          undefined,
      }))
    );
    setRows(
      rows
        .slice()
        .sort(
          comparator(
            columns[index].name.toLowerCase(),
            columns[index].order === "desc"
          )
        )
    );
  };

  function handleFilterControlls(name, value) {
    const newFilterState = { ...filters };
    if (name == "filterMoneyway") {
      newFilterState.filterMoneyway = +value;
    }

    if (name == "firstDate" || name == "lastDate") {
      newFilterState.filterDate[name] = value;
    }

    setFilters(newFilterState);
  }

  function filterTransactions() {
    let filteredTransactions = [...rows];

    if (filters.filterMoneyway !== 0) {
      filteredTransactions = filteredTransactions.filter(
        (transaction) => filters.filterMoneyway * transaction.sum > 0
      );
    }

    filteredTransactions.forEach((transaction) => {
      totalSum += transaction.sum;
    }); //// так не работает
    return filteredTransactions;
  }

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  // ????????????????????????
  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  return (
    <>
      <Paper className={classes.list}>
        <Table stickyHeader size="small">
          <TableHead className={classes.head}>
            <TableRow>
              {columns.map((column, index) => {
                if (column.sortable) {
                  return (
                    <TableCell
                      classes={{ sizeSmall: classes.headerCell }}
                      key={column.name}
                      align={column.numeric ? "right" : "inherit"}
                    >
                      <TableSortLabel
                        classes={{ icon: classes.icon }}
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
                    <TableCell
                      key={column.name}
                      align="right"
                      classes={{ sizeSmall: classes.headerCell }}
                    >
                      <Tooltip title="Filter list">
                        <IconButton
                          aria-label="filter list"
                          onClick={handleClick}
                        >
                          <Badge
                            color="secondary"
                            variant="dot"
                            invisible={filters.filterMoneyway === 0}
                          >
                            <FilterListIcon />
                          </Badge>
                        </IconButton>
                      </Tooltip>
                      <Popover
                        id={id}
                        open={open}
                        anchorEl={anchorEl}
                        onClose={handleClose}
                        anchorOrigin={{
                          vertical: "bottom",
                          horizontal: "center",
                        }}
                        transformOrigin={{
                          vertical: "top",
                          horizontal: "center",
                        }}
                      >
                        <Filters
                          value={filters}
                          upFilterState={handleFilterControlls}
                        />
                      </Popover>
                    </TableCell>
                  );
                }
              })}
            </TableRow>
          </TableHead>

          <TableBody className={classes.body}>
            {filterTransactions() // надо это делать на основе стейта фильтра
              .map((transaction) => {
                const { date, category, comment, sum, tags, id } = transaction;
                const categoryGroup = sum < 0 ? "outcome" : "income";
                totalSum += sum;

                return (
                  <TableRow hover={true} key={id} id={id}>
                    <TableCell
                      className={classes.date}
                      classes={{ sizeSmall: classes.headerCell }}
                    >
                      {new Date(date).toLocaleString()}
                    </TableCell>

                    <TableCell
                      align="right"
                      className={classes[categoryGroup]}
                      classes={{ sizeSmall: classes.headerCell }}
                    >
                      {sum}
                    </TableCell>

                    <TableCell classes={{ sizeSmall: classes.headerCell }}>
                      <FastfoodIcon fontSize="small" />
                      {!isXS && categories[categoryGroup][category]}
                    </TableCell>

                    <TableCell
                      classes={{ sizeSmall: classes.headerCell }}
                      align={"center"}
                    >
                      {tags // TODO: won't need after release
                        ? tags.map((tag) =>
                            userTags[tag] ? (
                              <p className={classes.tag} key={tag}>
                                #{userTags[tag]}
                              </p> /* (
                              <Chip
                                key={tag}
                                label={userTags[tag]}
                                size="small"
                                color="primary"
                                variant="outlined"
                              />
                            ) */
                            ) : null
                          )
                        : null}
                    </TableCell>

                    <TableCell
                      className={classes.comment}
                      classes={{ sizeSmall: classes.headerCell }}
                    >
                      {comment ? (
                        isXS ? (
                          <ChatBubbleOutlineIcon />
                        ) : (
                          comment
                        )
                      ) : null}
                    </TableCell>

                    <TableCell
                      align="right"
                      classes={{ sizeSmall: classes.headerCell }}
                    >
                      <IconButton
                        aria-label="filter list"
                        onClick={(e) => {
                          openTransactionForm(id);
                        }}
                      >
                        <EditIcon />
                      </IconButton>

                      {/* <IconButton aria-label="filter list" onClick={e => removeTransaction(id)}>
                        <DeleteForeverIcon />
                      </IconButton> */}
                    </TableCell>
                  </TableRow>
                );
              })}
          </TableBody>
          <TableFooter className={classes.footer}>
            <TableRow>
              <TableCell colSpan={6}>
                Сюда можно вставить какую-нибудь инфу, только не ясно чо шрифт
                такой маленький
              </TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </Paper>
    </>
  );
}
