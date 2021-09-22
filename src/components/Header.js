import React from 'react';
import AddCircleIcon from '@material-ui/icons/AddCircle';

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
  },

  logoutButton: {
    marginLeft: theme.spacing(1),
    alignSelf: 'center',
    color: 'white',
  },
  addButton: {
    color: '#f098ff',
  },
}));

import { AppBar, Button, IconButton } from '@material-ui/core';

export default function Header({ balance, openForm }) {
  const classes = useStyles();

  return (
    <AppBar position="fixed" className={classes.root}>
      <Button className={classes.logoutButton} size="small" variant="outlined" onClick={signout}>
        Sign out
      </Button>

      <span>BALANCE: {balance}</span>

      <IconButton className={classes.addButton} onClick={() => openForm()}>
        <AddCircleIcon />
      </IconButton>
    </AppBar>
  );
}
