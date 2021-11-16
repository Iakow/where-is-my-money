import React, { useState } from 'react';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import Budget from './Budget/Budget.js';
import MenuIcon from '@material-ui/icons/Menu';
import UserSettings from './UserSettings.js';

import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
} from '@material-ui/core';
import { AppBar, IconButton } from '@material-ui/core';

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
  settingsButton: {
    color: 'white',
  },
}));

export default function Header({ userData, openForm }) {
  const classes = useStyles();
  const [settingsIsOpen, setSettingsIsOpen] = useState(false);

  return (
    <AppBar position="fixed" className={classes.root}>
      {/* <Button className={classes.logoutButton} size="small" variant="outlined" onClick={signout}>
        Sign out
      </Button> */}
      <IconButton
        className={classes.settingsButton}
        onClick={() => {
          setSettingsIsOpen(true);
        }}
      >
        <MenuIcon />
      </IconButton>

      <Budget userData={userData} type="desktop" />

      <IconButton className={classes.addButton} onClick={() => openForm()}>
        <AddCircleIcon fontSize="large" />
      </IconButton>

      <Dialog
        open={settingsIsOpen}
        onClose={() => {
          setSettingsIsOpen(false);
        }}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle>My settings</DialogTitle>

        <DialogContent>
          <UserSettings />
        </DialogContent>
        {/* <DialogActions>
          <Button
            onClick={() => {
              setSettingsIsOpen(false);
            }}
            color="primary"
          >
            ок
          </Button>
        </DialogActions> */}
      </Dialog>
    </AppBar>
  );
}
