import React, { useContext } from "react";
import {
  TableRow,
  TableCell,
  IconButton,
  useMediaQuery,
} from "@material-ui/core";
import ChatBubbleOutlineIcon from "@material-ui/icons/ChatBubbleOutline";
import EditIcon from "@material-ui/icons/Edit";
import { makeStyles, useTheme } from "@material-ui/core/styles";

import { UserDataContext } from "../../../contexts/UserDataContext";
import { CategoryIcons } from "../../CaterogyIcons";

const useStyles = makeStyles((theme) => ({
  tableRow: {
    height: 62,
    overflow: "hidden",

    "& .MuiTableCell-sizeSmall:last-child": {
      [theme.breakpoints.down("xs")]: {
        paddingRight: 4,
      },
    },
  },
  tableCell: {
    [theme.breakpoints.down("xs")]: {
      padding: 4,
      fontSize: 10,
      borderBottom: "6px solid #0000003d;",
    },
  },
  outcome: {
    color: "#ff6060",
    fontSize: 15,
    paddingLeft: 10,
  },
  income: {
    color: "#71D28D",
    fontSize: 15,
    paddingLeft: 5,
  },
  comment: {
    fontSize: 14,
  },
  date: {
    fontSize: 14,
    [theme.breakpoints.down("xs")]: {
      fontSize: 10,
    },
  },
  tag: {
    margin: 0,
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
  category: {
    display: "flex",
    alignItems: "center",
  },
}));

export function TransactionRow({ transaction, openTransactionForm }) {
  const classes = useStyles();
  const theme = useTheme();
  const isXS = useMediaQuery(theme.breakpoints.down("xs"), { noSsr: true });

  const { categories: userCategories, tags: userTags } =
    useContext(UserDataContext);
  const { date, category, comment, sum, tags, id } = transaction;
  const categoryGroup = sum < 0 ? "outcome" : "income";

  return (
    <TableRow hover={true} className={classes.tableRow}>
      <TableCell className={`${classes.date} ${classes.tableCell}`}>
        {new Date(date).toLocaleString()}
      </TableCell>

      <TableCell
        className={`${classes[categoryGroup]} ${classes.tableCell}`}
        align="right"
      >
        {sum}
      </TableCell>

      <TableCell className={classes.tableCell}>
        <span className={classes.category}>
          <span className={classes[`${categoryGroup}Icon`]}>
            {CategoryIcons[categoryGroup][category]}
          </span>

          {!isXS && userCategories[categoryGroup][category]}
        </span>
      </TableCell>

      <TableCell className={classes.tableCell} align={"center"}>
        {tags &&
          tags.map(
            (tag) =>
              userTags[tag] && (
                <p className={classes.tag} key={tag}>
                  #{userTags[tag]}
                </p>
              )
          )}
      </TableCell>

      <TableCell
        align="center"
        className={`${classes.comment} ${classes.tableCell}`}
      >
        {comment ? (
          isXS ? (
            <ChatBubbleOutlineIcon className={classes.editButton} />
          ) : (
            comment
          )
        ) : null}
      </TableCell>

      <TableCell className={classes.tableCell} align="right">
        <IconButton
          aria-label="filter list"
          onClick={() => {
            openTransactionForm(id);
          }}
        >
          <EditIcon className={classes.editButton} />
        </IconButton>
      </TableCell>
    </TableRow>
  );
}
