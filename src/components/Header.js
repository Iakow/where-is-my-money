import React, { useState } from "react";
import { Budget } from "./Budget/Budget.js";
import { UserSettings } from "./UserSettings.js";

import MenuIcon from "@material-ui/icons/Menu";
import { AppBar, IconButton } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { AddButton } from "./AddButton.js";

const useStyles = makeStyles((theme) => ({
  bar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    height: 140,
  },
  addButton: {
    position: "relative",
    top: 60,
  },
  settingsButton: {
    color: "white",
  },
}));

export function Header({ userData, openTransactionForm }) {
  const classes = useStyles();
  const [settingsIsOpen, setSettingsIsOpen] = useState(false);

  const openSettings = () => {
    setSettingsIsOpen(true);
  };

  const closeSettings = () => {
    setSettingsIsOpen(false);
  };

  return (
    <>
      <AppBar position="static" className={classes.bar}>
        <IconButton className={classes.settingsButton} onClick={openSettings}>
          <MenuIcon />
        </IconButton>

        <Budget userData={userData} type="desktop" />
        
        <AddButton
          className={classes.addButton}
          handler={openTransactionForm}
        />
      </AppBar>

      <UserSettings
        open={settingsIsOpen}
        onClose={closeSettings}
        tags={userData.tags}
      />
    </>
  );
}
