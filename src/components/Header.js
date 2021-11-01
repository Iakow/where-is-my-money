import React from 'react';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import Budget from './Budget/Budget.js';

import { signout } from '../data/firebase';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
  root: {
    // это кто?
    flexGrow: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    zIndex: 1201, // theme.zIndex.drawer + 1,
    height: 140,
  },

  logoutButton: {
    marginLeft: theme.spacing(1),
    alignSelf: 'center',
    color: 'white',
  },
  addButton: {
    position: 'relative',
    top: 60,
    color: '#f098ff',
  },
}));

import { AppBar, Button, IconButton } from '@material-ui/core';

export default function Header({ userData, openForm }) {
  const classes = useStyles();

  return (
    <AppBar position="fixed" className={classes.root}>
      <Button className={classes.logoutButton} size="small" variant="outlined" onClick={signout}>
        Sign out
      </Button>

      <Budget userData={userData} type="desktop" />

      <IconButton className={classes.addButton} onClick={() => openForm()}>
        <AddCircleIcon fontSize="large" />
      </IconButton>
    </AppBar>
  );
}
