import React, { useState } from "react";

import {
  makeStyles,
  TableHead,
  TableCell,
  TableSortLabel,
  TableRow,
  Tooltip,
  IconButton,
  Badge,
  Popover,
} from "@material-ui/core";

import FilterListIcon from "@material-ui/icons/FilterList";

import Filters from "./Filters";

const useStyles = makeStyles((theme) => ({
  headerCell: {
    color: "#40D1FF",
    backgroundColor: "#282828",

    "& .MuiTableSortLabel-active": {
      color: "#40D1FF",
    },
    "& .MuiTableSortLabel-icon": {
      color: "#f64857 !important",
      margin: 0,
    },
    "& .MuiIconButton-label": {
      color: "#40D1FF",
    },
    [theme.breakpoints.down("xs")]: {
      backgroundColor: "#101010",
      padding: 0,
      fontSize: 10,
      borderBottom: "6px solid #0000003d;",

      "&.MuiTableCell-sizeSmall:last-child": {
        paddingRight: 4,
        color: "red"
      },
    },
  },
}));

const columns = [
  { name: "Date", align: "center" },
  { name: "Sum", align: "center" },
  { name: "Category", align: "center" },
  { name: "Tags", align: "center" },
  { name: "Note", align: "center" },
];

export function TableHeader(props) {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = useState(null);
  const { sortBy, sortOrder, handleSort, filters, handleFilter } = props;

  const openFilter = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const closeFilter = () => {
    setAnchorEl(null);
  };

  const hanleSorting = (name) => {
    const order = sortOrder === "desc" ? "asc" : "desc";
    handleSort(name, order);
  };

  return (
    <TableHead>
      <TableRow>
        {columns.map((column) => (
          <TableCell
            className={classes.headerCell}
            key={column.name}
            align={column.align}
          >
            <TableSortLabel
              active={sortBy === column.name.toLocaleLowerCase()}
              direction={sortOrder}
              onClick={() => hanleSorting(column.name.toLocaleLowerCase())}
            >
              {column.name}
            </TableSortLabel>
          </TableCell>
        ))}

        <TableCell className={classes.headerCell} align="right">
          <Tooltip title="Filter list">
            <IconButton aria-label="filter list" onClick={openFilter}>
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
            open={Boolean(anchorEl)}
            anchorEl={anchorEl}
            onClose={closeFilter}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "center",
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "center",
            }}
          >
            <Filters value={filters} handleFilter={handleFilter} />
          </Popover>
        </TableCell>
      </TableRow>
    </TableHead>
  );
}
