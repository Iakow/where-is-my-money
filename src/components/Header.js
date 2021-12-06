import React, { useState } from "react";
import { Budget } from "./Budget/Budget.js";
import { UserSettings } from "./UserSettings.js";

import MenuIcon from "@material-ui/icons/Menu";
import AddCircleIcon from "@material-ui/icons/AddCircle";
import { AppBar, IconButton } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

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
    color: "#f098ff",
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

        <IconButton className={classes.addButton} onClick={() => openTransactionForm()}>
          <AddCircleIcon fontSize="large" />
        </IconButton>
      </AppBar>

      <UserSettings
        open={settingsIsOpen}
        onClose={closeSettings}
        tags={userData.tags}
      />
    </>
  );
}
