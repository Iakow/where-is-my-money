import React, { useEffect, useState, useMemo, useContext } from "react";
import { UserDataContext } from "../../contexts/UserDataContext";
import { Link } from "react-router-dom";
import { Diagram } from "./Diargam";
import StatsTable from "./StatsTable";
import StatsTimeFilter from "./StatsTImeFilter";

import { makeStyles } from "@material-ui/core/styles";
import TableChartIcon from "@material-ui/icons/TableChart";
import PieChartIcon from "@material-ui/icons/PieChart";
import { Tabs, Tab } from "@material-ui/core";
import ReplyIcon from "@material-ui/icons/Reply";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import { Paper } from "@material-ui/core";
import { ButtonBase } from "@material-ui/core";
import { UserDataContext } from "../../contexts/UserDataContext";

const useStyles = makeStyles((theme) => ({
  main: {
    padding: "10px 0",
    height: "calc(100vh - 140px)",
    [theme.breakpoints.down("xs")]: {
      padding: 0,
      height: "100%",
      width: "100%",
    },
  },
  header: {
    display: "flex",
    height: 50,
    backgroundColor: "#1b1b1b",
    position: "relative",
  },
  paper: {
    height: "100%",
    display: "flex",
    flexDirection: "column",
    backgroundColor: "transparent",
  },
  budgetBtn: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    height: "150px",
    width: "150px",
  },
  navBtn: {
    position: "absolute",
    height: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: 50,
  },
  tabs: {
    backgroundColor: "#1b1b1b",
  },
}));

export function Stats({ openTransactionForm, type }) {
  const userData = useContext(UserDataContext);
  const classes = useStyles();
  const [tabValue, setTabValue] = useState(0);

  const [filters, setFilters] = useState({ startDate: null, lastDate: null });

  const handleFilterChange = (name, value) => {
    setFilters((oldFilters) => ({ ...oldFilters, ...{ [name]: value } }));
  };

  const onTabChange = (e, value) => {
    setTabValue(value);
  };

  const calculateStatsData = () => {
    const { categories: userCategories, transactions } = userData;
    const { startDate, lastDate } = filters;

    // create empty chartData
    const chartData = {};
    for (let moneyWay in userCategories) {
      chartData[moneyWay] = userCategories[moneyWay].map((category) => ({
        name: category,
        sum: 0,
      }));
    }

    // {transactions}  => [transactions]
    const transactionsArr = Object.entries(transactions).map(
      ([key, value]) => ({
        id: key,
        ...value,
      })
    );

    // filter transactions && fill chartData
    const tableData = transactionsArr.filter(({ date, sum, category }) => {
      const start = startDate === null ? true : startDate <= date;
      const end = lastDate === null ? true : date <= lastDate;

      const isInSample = start && end;

      if (isInSample === true)
        chartData[sum > 0 ? "income" : "outcome"][category]["sum"] +=
          Math.abs(sum);

      return isInSample;
    });

    return { chartData, tableData };
  };

  const { chartData, tableData } = useMemo(
    () => calculateStatsData(userData.transactions),
    [userData.transactions, filters]
  );

  if (type === "mobile")
    return (
      <main className={classes.main}>
        <Paper className={classes.paper}>
          <header className={classes.header}>
            <Link className={classes.navBtn} to="/">
              <ArrowBackIcon color="action" />
            </Link>
            <StatsTimeFilter
              handler={handleFilterChange}
              filterValue={filters}
              budgetValue={userData.budget}
            />
          </header>

          {tabValue === 0 && (
            <StatsTable
              transactions={tableData}
              openTransactionForm={openTransactionForm}
            />
          )}

          {tabValue === 1 && <Diagram data={chartData} />}

          <Tabs
            variant="fullWidth"
            value={tabValue}
            onChange={onTabChange}
            className={classes.tabs}
          >
            {/* <Tab icon={<ReplyIcon />} /> */}
            <Tab icon={<TableChartIcon />} />
            <Tab icon={<PieChartIcon />} />
          </Tabs>
        </Paper>
      </main>
    );

  return (
    <main className={classes.main}>
      <Paper className={classes.paper}>
        <header className={classes.header}>
          <Tabs value={tabValue} onChange={onTabChange}>
            <Tab icon={<TableChartIcon />} />
            <Tab icon={<PieChartIcon />} />
          </Tabs>

          <StatsTimeFilter
            handler={handleFilterChange}
            filterValue={filters}
            budgetValue={userData.budget}
          />
        </header>

        {tabValue === 0 && (
          <StatsTable
            transactions={tableData}
            userTags={userData.tags}
            categories={userData.categories}
            openTransactionForm={openTransactionForm}
          />
        )}

        {tabValue === 1 && <Diagram data={chartData} />}
      </Paper>
    </main>
  );
}
