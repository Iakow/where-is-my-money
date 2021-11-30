import React, { useEffect, useState, useMemo } from "react";
import { Diagram } from "./Diargam";
import StatsTable from "./StatsTable";
import StatsTimeFilter from "./StatsTImeFilter";

import { makeStyles } from "@material-ui/core/styles";
import TableChartIcon from "@material-ui/icons/TableChart";
import PieChartIcon from "@material-ui/icons/PieChart";
import { Tabs, Tab } from "@material-ui/core";
import { Paper } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  main: {
    padding: "10px 0",
    height: "calc(100vh - 140px)",
    [theme.breakpoints.down("xs")]: {
      padding: 0,
      height: "100vh",
    },
  },
  header: {
    display: "flex",
    height: 50,
  },
  paper: {
    height: "100%",
    display: "flex",
    flexDirection: "column",
  },
  budgetBtn: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    height: "150px",
    width: "150px",
  },
}));

export function Stats({ userData, openForm }) {
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
            openForm={openForm}
          />
        )}

        {tabValue === 1 && <Diagram data={chartData} />}
      </Paper>
    </main>
  );
}
