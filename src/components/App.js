import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Toolbar, CircularProgress } from '@material-ui/core';

import { useFirebase } from '../data/firebase';
import Auth from './Auth';
import TransactionForm from './TransactionForm/TransactionForm';
import Stats from './Stats/Stats';
import Header from './Header';
import SetBalanceForm from './SetBalanceForm';
import Container from '@material-ui/core/Container';

const useStyles = makeStyles(theme => ({
  loader: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
  },
}));

export default function App() {
  /* console.log('App'); */
  const classes = useStyles();

  const { isResponseWaiting, userData, isAuth } = useFirebase();
  const [transactionForm, setTransactionForm] = useState({ isOpen: false, transactionID: null });

  const closeForm = () => {
    setTransactionForm({ isOpen: false, transactionID: null });
  };

  const openForm = id => {
    setTransactionForm({ isOpen: true, transactionID: id });
  };

  if (isResponseWaiting) {
    console.log('App-waiting');
    return (
      <div className={classes.loader}>
        <CircularProgress />
      </div>
    );
  }

  if (isAuth === false) {
    console.log('App-auth');
    return <Auth />;
  }

  if (userData === null) {
    console.log('App-set-balance');
    //TODO: try to put it in Auth
    return <SetBalanceForm />;
  }

  return (
    <Container maxWidth="lg">
      <Header userData={userData} openForm={openForm} />

      <Stats userData={userData} openForm={openForm} />
      <TransactionForm
        isOpen={transactionForm.isOpen}
        onClose={closeForm}
        userData={userData}
        currentTransactionID={transactionForm.transactionID}
      />
    </Container>
  );
}
