import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Toolbar, CircularProgress } from '@material-ui/core';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { CssBaseline } from '@material-ui/core';
import { useFirebase } from '../data/firebase';
import Auth from './Auth';
import TransactionForm from './TransactionForm/TransactionForm';
import Stats from './Stats/Stats';
import Header from './Header';
import SetBalanceForm from './SetBalanceForm';
import Container from '@material-ui/core/Container';

const useStyles = makeStyles(theme => {
  console.log('app-theme:', theme);
  return {
    loader: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
    },
    app: {
      [theme.breakpoints.down('lg', 'xl')]: {
        backgroundColor: 'grey',
      },
      [theme.breakpoints.between('md', 'lg')]: {
        backgroundColor: 'green',
      },
      [theme.breakpoints.between('sm', 'md')]: {
        backgroundColor: 'blue',
      },
      [theme.breakpoints.between('xs', 'sm')]: {
        backgroundColor: 'pink',
      },
      [theme.breakpoints.down('xs')]: {
        backgroundColor: theme.palette.secondary.main,
      },
    },
  };
});

export default function App() {
  console.log('App');
  const classes = useStyles();
  const matches = useMediaQuery('(min-width:600px)');
  console.log(matches);

  const { isResponseWaiting, userData, isAuth } = useFirebase();
  const [transactionForm, setTransactionForm] = useState({ isOpen: false, transactionID: null });

  const closeForm = () => {
    setTransactionForm({ isOpen: false, transactionID: null });
  };

  const openForm = id => {
    setTransactionForm({ isOpen: true, transactionID: id });
  };

  const Desktop = (
    <>
      <CssBaseline />

      <Header userData={userData} openForm={openForm} />
      <Container maxWidth="lg">
        <Stats userData={userData} openForm={openForm} />
      </Container>
      <TransactionForm
        isOpen={transactionForm.isOpen}
        onClose={closeForm}
        userData={userData}
        currentTransactionID={transactionForm.transactionID}
      />
    </>
  );

  const Mobile = (
    <>
      <CssBaseline />
      <Stats userData={userData} openForm={openForm} />

      <TransactionForm
        isOpen={transactionForm.isOpen}
        onClose={closeForm}
        userData={userData}
        currentTransactionID={transactionForm.transactionID}
      />
    </>
  );

  if (isResponseWaiting) {
    // как узнать что БД готова к использованию? Т.е.все данные пришли.
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
    // лучше завести флаг userData.initialized?
    console.log('App-set-balance');
    //TODO: try to put it in Auth
    return <SetBalanceForm />;
  }

  if (matches) return Desktop;

  return Mobile;
}
