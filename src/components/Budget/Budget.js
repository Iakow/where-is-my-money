import React, { useState, useContext } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { UserDataContext } from "../../contexts/UserDataContext";
import IconButton from "@material-ui/core/IconButton";
import AlarmAddIcon from "@material-ui/icons/AlarmAdd";
import SettingsIcon from "@material-ui/icons/Settings";
import MenuIcon from "@material-ui/icons/Menu";
import Form from "./Form";
import Chart from "./Chart";
import { UserSettings } from "../UserSettings";

const useStyles = makeStyles((theme) => ({
  budgetBtn: {
    color: "gainsboro",
    [theme.breakpoints.down("xs")]: {
      position: "absolute",
      top: "20%",
      opacity: "0.3",
    },
  },
  mobileSettingsBtn: {
    color: "gray",
    position: "absolute",
    top: 0,
    left: 0,
  },
  root: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
  },
  desktop: {
    // TODO
    height: 50,
    width: 300,
  },
  mobile: {
    height: "100vw",
    width: "100vw",
  },
  balance: {
    [theme.breakpoints.down("xs")]: {
      fontSize: 42,
      /* fontWeight: "bold", */
      filter: "blur(0.5px)",
      color: "#71D28D",
    },
  },
  info: {
    flexDirection: "column",
    alignItems: "center",
    display: "flex",
    justifyContent: "center",
    [theme.breakpoints.down("xs")]: {
      position: "absolute",
    },
  },
  visualization: {
    display: "flex",
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
    [theme.breakpoints.down("xs")]: {
      flexDirection: "column",
      height: "100vw",
      width: "100vw",
    },
  },
  days: {
    color: "gray",
  },
}));

export function Budget({ type }) {
  const userData = useContext(UserDataContext);
  const { balance, budget, transactions } = userData;
  const classes = useStyles();
  const [popupIsOpen, setPopupIsOpen] = useState(false);
  const [settingsIsOpen, setSettingsIsOpen] = useState(false);

  const openForm = () => {
    setPopupIsOpen(true);
  };

  const colseForm = () => {
    setPopupIsOpen(false);
  };

  const openSettings = () => {
    setSettingsIsOpen(true);
  };

  const closeSettings = () => {
    setSettingsIsOpen(false);
  };

  const balanceText = type === "desktop" ? "BALANCE: " : "";
  const daysLeft =
    budget && Math.round((budget.lastDate - Date.now()) / (1000 * 3600 * 24));

  return (
    <div className={classes.root}>
      {type === "mobile" && (
        <IconButton
          className={classes.mobileSettingsBtn}
          onClick={openSettings}
        >
          <MenuIcon />
        </IconButton>
      )}

      <div className={classes.info}>
        <span className={classes.balance}>{balanceText + balance}</span>
        {type === "mobile" && budget && (
          <span className={classes.days}>{daysLeft} days left</span>
        )}
      </div>

      <div className={classes.visualization}>
        {/* если не мобила и нет бюджета */}

        {!(!budget && type === "desktop") && (
          <div className={classes[type]}>
            <Chart type={type} />
          </div>
        )}

        <IconButton className={classes.budgetBtn} onClick={openForm}>
          {budget ? <SettingsIcon /> : <AlarmAddIcon />}
        </IconButton>
      </div>

      <Form isOpen={popupIsOpen} close={colseForm} value={budget} />

      <UserSettings open={settingsIsOpen} onClose={closeSettings} />
    </div>
  );
}
