import React, { useState } from "react";
import { UserDataContext } from "../../contexts/UserDataContext";
import { useFirebase } from "../../data/firebase";

import {
  makeStyles,
  useTheme,
  createTheme,
  ThemeProvider,
} from "@material-ui/core/styles";

import {
  CssBaseline,
  CircularProgress,
  useMediaQuery,
} from "@material-ui/core";

import { Auth } from "../Auth";
import { TransactionForm } from "../TransactionForm/TransactionForm";
import { SetBalanceForm } from "../SetBalanceForm";
import { Desktop } from "./Desktop";
import { Mobile } from "./Mobile";

const useStyles = makeStyles((theme) => {
  return {
    loader: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "100vh",
    },
    app: {
      // без этого слетает листнер на ресайз !!!
      height: "100vh",
      [theme.breakpoints.down("xs")]: {
        backgroundImage: "radial-gradient(transparent, black)",
        /* height: "calc(var(--vh, 1vh) * 100)", */
      },
    },
  };
});

const darkTheme = createTheme({
  palette: {
    type: "dark",
  },
});

export function App() {
  const classes = useStyles();
  const theme = useTheme();
  const isXS = useMediaQuery(theme.breakpoints.down("xs"), { noSsr: true });

  const { isResponseWaiting, userData, isAuth } = useFirebase();
console.log(userData)
  //////////////////////////////////////////////////////////////////
  const [transactionForm, setTransactionForm] = useState({
    isOpen: false,
    transactionID: null,
  });

  const openTransactionForm = (id) => {
    setTransactionForm({ isOpen: true, transactionID: id });
  };

  const closeForm = () => {
    setTransactionForm({ isOpen: false, transactionID: null });
  };
  ////////////////////////////////////////////////////////////////////

  if (isResponseWaiting === true) {
    return (
      <div className={classes.loader}>
        <CircularProgress />
      </div>
    );
  }

  if (isAuth === false) {
    return (
      <ThemeProvider theme={darkTheme}>
        <CssBaseline />
        <Auth />
      </ThemeProvider>
    );
  }

  if (userData.balance === null) {
    return (
      <ThemeProvider theme={darkTheme}>
          <CssBaseline />
          <SetBalanceForm />
      </ThemeProvider>
    );
  }

  return (
    <UserDataContext.Provider value={userData}>
      <ThemeProvider theme={darkTheme}>
        <div className={classes.app}>
          <CssBaseline />

          {isXS ? (
            <Mobile openTransactionForm={openTransactionForm} />
          ) : (
            <Desktop openTransactionForm={openTransactionForm} />
          )}

          <TransactionForm
            isOpen={transactionForm.isOpen}
            onClose={closeForm}
            currentTransactionID={transactionForm.transactionID}
          />
        </div>
      </ThemeProvider>
    </UserDataContext.Provider>
  );
}
