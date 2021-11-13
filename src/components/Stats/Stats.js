import React, { useEffect, useState, useMemo } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import TableChartIcon from '@material-ui/icons/TableChart';
import PieChartIcon from '@material-ui/icons/PieChart';
import { Tabs, Tab } from '@material-ui/core';
import List from './List';
import StatsTimeFilter from './StatsTImeFilter';
import Diagram from './Diargam';

const useStyles = makeStyles(theme => ({
  main: {
    display: 'flex',
    flexDirection: 'column',
    paddingTop: 150,
  },
  header: {
    display: 'flex',
  },
  budgetBtn: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    height: '150px',
    width: '150px',
  },
  chart: {
    height: 400,
    width: 400,
  },
}));

export default function Stats({ userData, openForm }) {
  const classes = useStyles();
  const [tabValue, setTabValue] = useState(0);

  const [filters, setFilters] = useState({ startDate: null, lastDate: null });

  const handleFilterChange = (name, value) => {
    setFilters(oldFilters => ({ ...oldFilters, ...{ [name]: value } }));
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
      chartData[moneyWay] = userCategories[moneyWay].map(category => ({ name: category, sum: 0 }));
    }

    // {transactions}  => [transactions]
    const transactionsArr = Object.entries(transactions).map(([key, value]) => ({
      id: key,
      ...value,
    }));

    // filter transactions && fill chartData
    const tableData = transactionsArr.filter(({ date, sum, category }) => {
      const start = startDate === null ? true : startDate <= date;
      const end = lastDate === null ? true : date <= lastDate;

      const isInSample = start && end;

      if (isInSample === true)
        chartData[sum > 0 ? 'income' : 'outcome'][category]['sum'] += Math.abs(sum);

      return isInSample;
    });

    return { chartData, tableData };
  };

  const { chartData, tableData } = useMemo(() => calculateStatsData(userData.transactions), [
    userData.transactions,
    filters,
  ]);

  return (
    <main className={classes.main}>
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
        <List
          transactions={tableData}
          userTags={userData.tags}
          categories={userData.categories}
          openForm={openForm}
        />
      )}

      {tabValue === 1 && (
        <div className={classes.chart}>
          <Diagram data={chartData} />
        </div>
      )}
    </main>
  );
}
