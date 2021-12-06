import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import IconButton from "@material-ui/core/IconButton";
import AlarmAddIcon from "@material-ui/icons/AlarmAdd";
import SettingsIcon from "@material-ui/icons/Settings";
import Form from "./Form";
import Chart from "./Chart";

const useStyles = makeStyles((theme) => ({
  budgetBtn: {
    color: "gainsboro",
    [theme.breakpoints.down("xs")]: {
      position: "absolute",
      top: "20%",
      opacity: "0.1"
    },
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
    display: "flex",
    justifyContent: "center",
    [theme.breakpoints.down("xs")]: {
      fontSize: 46,
      position: "absolute",
      /* fontWeight: "bold", */
      color: "#71D28D",
    },
  },
  budget: {
    display: "flex",
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
    [theme.breakpoints.down("xs")]: {
      flexDirection: "column",
    },
  },
}));

export function Budget({ userData, type }) {
  // type надо как-то через тему, наверное
  const classes = useStyles();
  const [popupIsOpen, setPopupIsOpen] = useState(false);
  const { budget, balance } = userData;

  const openForm = () => {
    setPopupIsOpen(true);
  };

  const colseForm = () => {
    setPopupIsOpen(false);
  };

  const balanceText = type === "desktop" ? "BALANCE: " : "";

  return (
    <div className={classes.root}>
      <span className={classes.balance}>{balanceText + balance}</span>

      <div className={classes.budget}>
        {budget && (
          <div className={classes[type]}>
            <Chart userData={userData} type={type} />
          </div>
        )}

        <IconButton className={classes.budgetBtn} onClick={openForm}>
          {budget ? <SettingsIcon /> : <AlarmAddIcon />}
        </IconButton>
      </div>

      <Form isOpen={popupIsOpen} close={colseForm} value={budget} />
    </div>
  );
}
