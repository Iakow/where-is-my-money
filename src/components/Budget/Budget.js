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
  },
  desktop: {
    // TODO
    height: 50,
    width: 300,
  },
  mobile: {
    height: 600,
    width: 400,
  },

  balance: {
    display: "flex",
    justifyContent: "center",
  },
  budget: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
}));

export function Budget({ userData, type }) {
  const classes = useStyles();
  const [popupIsOpen, setPopupIsOpen] = useState(false);
  const { budget, balance } = userData;

  const openForm = () => {
    setPopupIsOpen(true);
  };

  const colseForm = () => {
    setPopupIsOpen(false);
  };

  return (
    <div>
      <span className={classes.balance}>{`BALANCE: ${balance}`}</span>

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
