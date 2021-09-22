import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import List from './List';

const drawerWidth = 140;
const useStyles = makeStyles(theme => ({
  title: {
    flexGrow: 1,
  },
  drawer: {
    top: '30px',
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
  },
  main: {
    display: 'flex',
  },
}));

import {
  // вот это тоже можно инкапсулировать глубже
  AppBar,
  Button,
  IconButton,
  Drawer,
  Tabs,
  Tab,
  Toolbar,
} from '@material-ui/core';

export default function Main({ userData, openForm }) {
  const classes = useStyles();
  const [tabValue, setTabValue] = useState(0);

  const onTabChange = (e, value) => {
    // зачем тут e?
    setTabValue(value);
  };

  return (
    <main className={classes.main}>
      <Drawer
        variant="permanent"
        className={classes.drawer}
        classes={{
          paper: classes.drawerPaper,
        }}
      >
        <Toolbar /> {/* какой-то грязный хак */}
        <Tabs orientation="vertical" value={tabValue} onChange={onTabChange}>
          <Tab label="Table" />
          <Tab label="Diagram" />
        </Tabs>
      </Drawer>

      {tabValue === 0 && (
        <List
          transactions={userData.transactions}
          categories={userData.categories}
          openForm={openForm}
        />
      )}

      {tabValue === 1 && <div>Diagram</div>}
    </main>
  );
}
