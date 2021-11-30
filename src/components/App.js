import React, { useState } from "react";
import { useFirebase } from "../data/firebase";

import { makeStyles, useTheme } from "@material-ui/core/styles";
import { CssBaseline } from "@material-ui/core";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { CircularProgress } from "@material-ui/core";

import { Auth } from "./Auth";
import { TransactionForm } from "./TransactionForm/TransactionForm";
import { SetBalanceForm } from "./SetBalanceForm";
import { Desktop } from "./Desktop";
import { Mobile } from "./Mobile";

const useStyles = makeStyles((theme) => {
  console.log(theme);
  return {
    loader: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "100vh",
    },
    app: {
      // без этого слетает листнер на ресайз !!!
      [theme.breakpoints.down("xs")]: {
        display: "block",
      },
    },
  };
});

export function App() {
  const classes = useStyles();
  const theme = useTheme();
  const isXS = useMediaQuery(theme.breakpoints.down("xs"), { noSsr: true });

  const { isResponseWaiting, userData, isAuth } = useFirebase();
  const [transactionForm, setTransactionForm] = useState({
    isOpen: false,
    transactionID: null,
  });

  const closeForm = () => {
    setTransactionForm({ isOpen: false, transactionID: null });
  };

  const openTransactionForm = (id) => {
    setTransactionForm({ isOpen: true, transactionID: id });
  };

  if (isResponseWaiting === true) {
    return (
      <div className={classes.loader}>
        <CircularProgress />
        <span>download</span>
      </div>
    );
  }

  if (isAuth === false) {
    return <Auth />;
  }

  if (userData.transactions.balance === null) {
    return <SetBalanceForm />;
  }

  return (
    <div className={classes.app}>
      <CssBaseline />

      {isXS ? (
        <Mobile userData={userData} openTransactionForm={openTransactionForm} />
      ) : (
        <Desktop
          userData={userData}
          openTransactionForm={openTransactionForm}
        />
      )}

      <TransactionForm
        isOpen={transactionForm.isOpen}
        onClose={closeForm}
        userData={userData}
        currentTransactionID={transactionForm.transactionID}
      />
    </div>
  );
}
