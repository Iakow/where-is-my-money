import React, { useState } from "react";
import { AppBar, IconButton, makeStyles } from "@material-ui/core";
import MenuIcon from "@material-ui/icons/Menu";

import { Budget } from "./Budget/Budget.js";
import { UserSettings } from "./UserSettings.js";

const useStyles = makeStyles(() => ({
  bar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    height: 120,
  },
  settingsButton: {
    color: "white",
    position: "absolute",
    left: 0,
  },
}));

export function Header() {
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

        <Budget type="desktop" />
      </AppBar>

      <UserSettings open={settingsIsOpen} onClose={closeSettings} />
    </>
  );
}
