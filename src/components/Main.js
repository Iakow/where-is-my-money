import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import TableChartIcon from '@material-ui/icons/TableChart';
import PieChartIcon from '@material-ui/icons/PieChart';
import { Tabs, Tab } from '@material-ui/core';
import List from './List';

import Budget from './Budget/Budget.js';

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
}));

export default function Main({ userData, openForm }) {
  console.log('  Main');
  const classes = useStyles();
  const [tabValue, setTabValue] = useState(0);

  const onTabChange = (e, value) => {
    // зачем тут e?
    setTabValue(value);
  };

  return (
    <main className={classes.main}>
      <header className={classes.header}>
        <Tabs /* centered */ value={tabValue} onChange={onTabChange}>
          <Tab icon={<TableChartIcon />} />
          <Tab icon={<PieChartIcon />} />
        </Tabs>
        <div className={classes.filter}>обощенное название фильтра и попапчик</div>
      </header>

      {tabValue === 0 && (
        <List
          transactions={userData.transactions}
          categories={userData.categories}
          openForm={openForm}
        />
      )}

      {tabValue === 1 && <Budget userData={userData} type="mobile" />}
    </main>
  );
}
