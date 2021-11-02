import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import TableChartIcon from '@material-ui/icons/TableChart';
import PieChartIcon from '@material-ui/icons/PieChart';
import { Tabs, Tab } from '@material-ui/core';
import List from './List';
import TimeFilter from './TImeFilter';
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
  filter: {
    flexGrow: 1,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#80808024',
    padding: 15,
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

  //TODO костыль убрать, дату надо как-то обновлять или иначе обрабатывать
  const [filters, setFilters] = useState({ startDate: 0, lastDate: Date.now() + 10000 });

  const handleFilterChange = (name, value) => {
    //TODO поискать варик лаконичнее
    setFilters(oldFilters => {
      const newFilterState = { ...oldFilters };
      newFilterState[name] = value;
      return newFilterState;
    });
  };

  const onTabChange = (e, value) => {
    // зачем тут e?
    setTabValue(value);
  };

  const calculateStatsData = () => {
    const userCategories = userData.categories;
    const { startDate, lastDate } = filters;

    const chartData = {};
    for (let type in userCategories) {
      chartData[type] = userCategories[type].map(category => ({ name: category, sum: 0 }));
    }

    const preparedTransactions = Object.entries(userData.transactions).map(([key, value]) => ({
      id: key,
      ...value,
    }));

    const tableData = preparedTransactions.filter(({ date, sum, category }) => {
      const isInSample = startDate <= date && date <= lastDate;

      if (isInSample === true)
        chartData[sum > 0 ? 'income' : 'outcome'][category]['sum'] += Math.abs(sum);

      return isInSample;
    });

    return { chartData, tableData };
  };

  const { chartData, tableData } = calculateStatsData();

  return (
    <main className={classes.main}>
      <header className={classes.header}>
        <Tabs value={tabValue} onChange={onTabChange}>
          <Tab icon={<TableChartIcon />} />
          <Tab icon={<PieChartIcon />} />
        </Tabs>

        <div className={classes.filter}>
          <TimeFilter
            handler={handleFilterChange}
            filterValue={filters} // а как я тут определю None, например?
            budgetValue={userData.budget}
          />
        </div>
      </header>

      {tabValue === 0 && (
        <List transactions={tableData} categories={userData.categories} openForm={openForm} />
      )}

      {tabValue === 1 && (
        <div className={classes.chart}>
          <Diagram data={chartData} />
        </div>
      )}
    </main>
  );
}
