import React, { useState } from 'react';
import { Tabs, Tab, Button } from '@material-ui/core';

import { signout } from '../data/firebase';
import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  container: {
    display: 'flex',
    flexDirection: 'row',
  },
  tabContent: {
    height: '50vh',
    width: '50vw',
  },
}));

export default function UserSettings() {
  const [tab, setTab] = useState(0);
  const classes = useStyles();

  const onTabChange = (e, value) => {
    setTab(value);
  };
  return (
    <div className={classes.container}>
      <Tabs
        value={tab}
        orientation="vertical"
        onChange={onTabChange}
        TabIndicatorProps={{
          style: {
            display: 'none',
          },
        }}
      >
        <Tab label="My account" />
        <Tab label="My tags" />
      </Tabs>
      <div className={classes.tabContent}>
        {tab === 0 && (
          <Button size="small" variant="outlined" onClick={signout}>
            Sign out
          </Button>
        )}
        {tab === 1 &&
          'Список тегов, у каждого кнопка редактирования - там попап с возможностью удалить или изменить название. Плюс общая кнопка добавления -  тот же попап. Все как с транзакциями, только без сложной таблицы'}
      </div>
    </div>
  );
}
