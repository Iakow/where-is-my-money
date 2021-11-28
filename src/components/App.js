import React, { useState } from "react";
import { Routes, Route, Link } from "react-router-dom";

import { useFirebase } from "../data/firebase";

import { makeStyles, useTheme } from "@material-ui/core/styles";
import { CssBaseline } from "@material-ui/core";
import { Container } from "@material-ui/core";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { Toolbar, CircularProgress } from "@material-ui/core";

import { Auth } from "./Auth";
import { TransactionForm } from "./TransactionForm/TransactionForm";
import { Stats } from "./Stats/Stats";
import { Header } from "./Header";
import { SetBalanceForm } from "./SetBalanceForm";
import { Budget } from "./Budget/Budget";

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

  const openForm = (id) => {
    setTransactionForm({ isOpen: true, transactionID: id });
  };

  const Desktop = (
    <>
      <Header userData={userData} openForm={openForm} />
      <Container maxWidth="lg">
        <Stats userData={userData} openForm={openForm} />
      </Container>
    </>
  );

  const Mobile = (
    <Routes>
      <Route
        path="/"
        element={
          <>
            <Link to="/stats">Stats</Link>
            <Budget userData={userData} type="mobile" />
          </>
        }
      />
      <Route
        path="/stats"
        element={
          <>
            <Link to="/">Main</Link>
            <Stats userData={userData} openForm={openForm} />
          </>
        }
      />
    </Routes>
  );

  if (isResponseWaiting === true) {
    // как узнать что БД готова к использованию? Т.е.все данные пришли.
    console.log("App-waiting");
    return (
      <div className={classes.loader}>
        <CircularProgress />
        <span>download</span>
      </div>
    );
  }

  if (isAuth === false) {
    console.log("App-auth");
    return <Auth />;
  }

  if (userData === null) {
    // лучше завести флаг userData.initialized?
    console.log("App-set-balance");
    //TODO: try to put it in Auth
    return <SetBalanceForm />;
  }

  return (
    <div className={classes.app}>
      <CssBaseline />
      {isXS ? Mobile : Desktop}
      <TransactionForm
        isOpen={transactionForm.isOpen}
        onClose={closeForm}
        userData={userData}
        currentTransactionID={transactionForm.transactionID}
      />
    </div>
  );
}
