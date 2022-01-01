import React, { useEffect, useState, useContext } from "react";
import { UserDataContext } from "../../contexts/UserDataContext";

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
import SvgIcon from "@material-ui/core/SvgIcon";

import CommuteIcon from "@material-ui/icons/Commute";
import LocalHospitalIcon from "@material-ui/icons/LocalHospital";
import ShoppingCartIcon from "@material-ui/icons/ShoppingCart";

import MonetizationOnIcon from "@material-ui/icons/MonetizationOn";
import CardGiftcardIcon from "@material-ui/icons/CardGiftcard";

const useStyles = makeStyles((theme) => ({
  headerCell: {
    [theme.breakpoints.down("xs")]: {
      padding: 4,
      fontSize: 10,
      borderBottom: "6px solid #0000003d;",
    },
  },
  newHeaderCell: {
    [theme.breakpoints.down("xs")]: {
      padding: 0,
      fontSize: 10,
      borderBottom: "6px solid #0000003d;",
      color: "#40D1FF",
      backgroundColor: "#101010",
      "& .MuiTableSortLabel-active": {
        color: "#40D1FF",
      },
      /*  "& :last-child": {
        paddingRight: 0,
      } */
    },
  },
  outcome: {
    color: "#ff6060",
    fontSize: 15,
    // fontWeight: "bold"
    paddingLeft: 10,
  },
  income: {
    color: "#71D28D",
    fontSize: 15,
    // fontWeight: "bold"
    paddingLeft: 5,
  },
  comment: {
    fontSize: 14,
  },
  date: {
    fontSize: 14,
    [theme.breakpoints.down("xs")]: {
      // padding: 4,
      fontSize: 10,
    },
  },
  list: {
    overflowY: "auto",
    flexGrow: 1,
    /* height: "calc(100% - 50px)", */
    backgroundColor: "transparent",
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
  tag: {
    margin: 0,
  },
  icon: {
    margin: 0,
  },
  sortLabel: {
    color: "#40D1FF",
  },
  editButton: {
    [theme.breakpoints.down("xs")]: {
      height: 16,
      width: 16,
      color: "grey",
    },
  },
  outcomeIcon: {
    color: "#b76767",
    [theme.breakpoints.up("sm")]: {
      marginRight: 8,
    },
  },
  incomeIcon: {
    color: "#6e9573",
    [theme.breakpoints.up("sm")]: {
      marginRight: 8,
    },
  },
  tableRow: {
    height: 62,
    overflow: "hidden",
  },
  category: {
    display: "flex",
    alignItems: "center",
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

/* 
Тупой компонент сортируемой шапки.
Там будет определен активный элемент и направление стрелки.

Сортировки опираются на name. Т.е. мне все равно по клику нужно будет это определить.
Ну, клик - это индекс. 
*/

const columns = [
  { name: "Date", active: true },
  { name: "Sum", active: false /* numeric: true */ },
  { name: "Category", active: false },
  { name: "Tags", active: false },
  { name: "Comment", active: false },
];

export default function StatsTable({ transactions, openTransactionForm }) {
  const classes = useStyles();
  const theme = useTheme();
  const isXS = useMediaQuery(theme.breakpoints.down("xs"), { noSsr: true });

  const { categories, tags: userTags } = useContext(UserDataContext);

  const [columns, setColumns] = useState([
    { name: "Date", active: true },
    { name: "Sum", active: false /* numeric: true */ },
    { name: "Category", active: false },
    { name: "Tags", active: false },
    { name: "Comment", active: false },
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

  const onSortClick = (sortingIndex) => {
    setColumns(
      columns.map((column, i) => ({
        ...column,
        active: sortingIndex === i,
        order:
          (sortingIndex === i && (column.order === "desc" ? "asc" : "desc")) ||
          undefined,
      }))
    );

    setRows((rows) =>
      [...rows].sort(
        comparator(
          columns[sortingIndex].name.toLowerCase(),
          columns[sortingIndex].order === "desc"
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

  const handleFilterClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleFilterClose = () => {
    setAnchorEl(null);
  };

  const CatIcons = {
    outcome: [
      <SvgIcon className={classes.outcomeIcon}>
        <path d="M21.6,18.2L13,11.75v-0.91c1.65-0.49,2.8-2.17,2.43-4.05c-0.26-1.31-1.3-2.4-2.61-2.7C10.54,3.57,8.5,5.3,8.5,7.5h2 C10.5,6.67,11.17,6,12,6s1.5,0.67,1.5,1.5c0,0.84-0.69,1.52-1.53,1.5C11.43,8.99,11,9.45,11,9.99v1.76L2.4,18.2 C1.63,18.78,2.04,20,3,20h9h9C21.96,20,22.37,18.78,21.6,18.2z M6,18l6-4.5l6,4.5H6z" />
      </SvgIcon>,
      <CommuteIcon className={classes.outcomeIcon} />,
      <SvgIcon className={classes.outcomeIcon}>
        <path d="M16.48,10.41c-0.39,0.39-1.04,0.39-1.43,0l-4.47-4.46l-7.05,7.04l-0.66-0.63c-1.17-1.17-1.17-3.07,0-4.24l4.24-4.24 c1.17-1.17,3.07-1.17,4.24,0L16.48,9C16.87,9.39,16.87,10.02,16.48,10.41z M17.18,8.29c0.78,0.78,0.78,2.05,0,2.83 c-1.27,1.27-2.61,0.22-2.83,0l-3.76-3.76l-5.57,5.57c-0.39,0.39-0.39,1.02,0,1.41c0.39,0.39,1.02,0.39,1.42,0l4.62-4.62l0.71,0.71 l-4.62,4.62c-0.39,0.39-0.39,1.02,0,1.41c0.39,0.39,1.02,0.39,1.42,0l4.62-4.62l0.71,0.71l-4.62,4.62c-0.39,0.39-0.39,1.02,0,1.41 c0.39,0.39,1.02,0.39,1.41,0l4.62-4.62l0.71,0.71l-4.62,4.62c-0.39,0.39-0.39,1.02,0,1.41c0.39,0.39,1.02,0.39,1.41,0l8.32-8.34 c1.17-1.17,1.17-3.07,0-4.24l-4.24-4.24c-1.15-1.15-3.01-1.17-4.18-0.06L17.18,8.29z" />
      </SvgIcon>,
      <LocalHospitalIcon className={classes.outcomeIcon} />,
      <FastfoodIcon className={classes.outcomeIcon} />,
      <SvgIcon className={classes.outcomeIcon}>
        <path d="M15.5,6.5C15.5,5.66,17,4,17,4s1.5,1.66,1.5,2.5C18.5,7.33,17.83,8,17,8S15.5,7.33,15.5,6.5z M19.5,15 c1.38,0,2.5-1.12,2.5-2.5c0-1.67-2.5-4.5-2.5-4.5S17,10.83,17,12.5C17,13.88,18.12,15,19.5,15z M13,14h-2v-2H9v2H7v2h2v2h2v-2h2V14z M16,12v10H4V12c0-2.97,2.16-5.43,5-5.91V4H7V2h6c1.13,0,2.15,0.39,2.99,1.01l-1.43,1.43C14.1,4.17,13.57,4,13,4h-2v2.09 C13.84,6.57,16,9.03,16,12z" />
      </SvgIcon>,
      <ShoppingCartIcon className={classes.outcomeIcon} />,
    ],
    income: [
      <MonetizationOnIcon className={classes.incomeIcon} />,
      <MonetizationOnIcon className={classes.incomeIcon} />,
      <CardGiftcardIcon className={classes.incomeIcon} />,
      <MonetizationOnIcon className={classes.incomeIcon} />,
    ],
  };

  // ????????????????????????
  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  /*  const newTable = (
    <>
      <TableHeader columns={columns} />
      <TableBody rows={rows} />
    </>
  ); */

  return (
    <>
      <Paper className={classes.list}>
        <Table stickyHeader size="small">
          <TableHead className={classes.head}>
            <TableRow>
              {columns.map((column, index) => (
                <TableCell
                  classes={{ sizeSmall: classes.newHeaderCell }}
                  key={column.name}
                  align={column.numeric ? "right" : "center"}
                >
                  <TableSortLabel
                    className={classes.sortLabel}
                    classes={{
                      icon: classes.icon,
                      active: classes.sortLabel,
                    }}
                    active={column.active}
                    direction={column.order} // в инишл стейте нету. wtf?
                    onClick={() => onSortClick(index)}
                  >
                    {column.name}
                  </TableSortLabel>
                </TableCell>
              ))}

              <TableCell
                align="right"
                classes={{ sizeSmall: classes.newHeaderCell }}
              >
                <Tooltip title="Filter list">
                  <IconButton
                    aria-label="filter list"
                    onClick={handleFilterClick}
                  >
                    <Badge
                      color="secondary"
                      variant="dot"
                      invisible={filters.filterMoneyway === 0}
                    >
                      <FilterListIcon className={classes.sortLabel} />
                    </Badge>
                  </IconButton>
                </Tooltip>

                <Popover
                  id={id}
                  open={open}
                  anchorEl={anchorEl}
                  onClose={handleFilterClose}
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
            </TableRow>
          </TableHead>

          <TableBody className={classes.body}>
            {filterTransactions() // надо это делать на основе стейта фильтра
              .map((transaction) => {
                const { date, category, comment, sum, tags, id } = transaction;
                const categoryGroup = sum < 0 ? "outcome" : "income";
                totalSum += sum;

                return (
                  <TableRow
                    hover={true}
                    key={id}
                    id={id}
                    className={classes.tableRow}
                  >
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
                      <span className={classes.category}>
                        {CatIcons[categoryGroup][category]}
                        {!isXS && categories[categoryGroup][category]}
                      </span>
                    </TableCell>

                    <TableCell
                      classes={{ sizeSmall: classes.headerCell }}
                      align={"center"}
                    >
                      {tags // TODO: won't need after release???
                        ? tags.map((tag, i) => {
                            //
                            if (!userTags[tag]) return;

                            return (
                              <p className={classes.tag} key={tag}>
                                #{userTags[tag]}
                              </p>
                            );
                          })
                        : null}
                    </TableCell>

                    <TableCell
                      align="center"
                      className={classes.comment}
                      classes={{ sizeSmall: classes.headerCell }}
                    >
                      {comment ? (
                        isXS ? (
                          <ChatBubbleOutlineIcon
                            className={classes.editButton}
                          />
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
                        <EditIcon className={classes.editButton} />
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
