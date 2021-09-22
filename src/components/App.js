import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Toolbar, CircularProgress } from '@material-ui/core';

import { useFirebase } from '../data/firebase';
import Auth from './Auth';
import TransactionForm from './TransactionForm/TransactionForm';
import Main from './Main';
import Header from './Header';
import SetBalanceForm from './SetBalanceForm';

const useStyles = makeStyles(theme => ({
  loader: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
  },
}));

export default function App() {
  const classes = useStyles();

  const { isResponseWaiting, userData, isAuth } = useFirebase();
  const [transactionForm, setTransactionForm] = useState({ isOpen: false, transactionID: null });

  const closeForm = () => {
    setTransactionForm({ isOpen: false, transactionID: null });
  };

  const openForm = id => {
    setTransactionForm({ isOpen: true, transactionID: id });
  };

  if (isResponseWaiting)
    return (
      <div className={classes.loader}>
        <CircularProgress />
      </div>
    );

  if (isAuth === false) return <Auth />;

  if (userData === null) {
    //TODO: try to put it in Auth
    return <SetBalanceForm />;
  }

  return (
    <>
      <Header balance={userData.balance} openForm={openForm} />
      <Toolbar /> {/* //? */}
      <Main userData={userData} openForm={openForm} />
      <TransactionForm
        isOpen={transactionForm.isOpen}
        onClose={closeForm}
        userData={userData}
        currentTransactionID={transactionForm.transactionID}
      />
    </>
  );
}
