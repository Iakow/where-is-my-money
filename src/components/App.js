import React from 'react';
import { useEffect, useState } from 'react';
import { connectFirebase } from '../data/rest.js';

import Main from '../components/Main';
import List from '../components/List';
import Auth from '../components/Auth';

import TransactionForm from './TransactionForm/TransactionForm';
import {
  signout,
  editTransaction,
  setBalance,
  getUserDB,
  addNewTransaction,
  removeTransaction,
} from '../data/rest';

import styles from '../style.css';

export default function App() {
  const [isResponseWaiting, setIsResponceWaiting] = useState(true);
  const [userData, setUserData] = useState({});
  const [formIsOpen, setFormIsOpen] = useState(false);
  const [currentTransactionID, setCurrentTransactionID] = useState(null);
  const [isAuth, setIsAuth] = useState(false);

  useEffect(() => {
    connectFirebase(
      data => {
        setUserData(data);
        setIsAuth(true);
        setIsResponceWaiting(false);
      },
      () => {
        setIsResponceWaiting(false);
        setIsAuth(false);
      },
    );
  }, []);

  function formHandler(data) {
    setFormIsOpen(false);

    if (data) {
      if (currentTransactionID) {
        const newBalance =
          userData.balance - userData.transactions[currentTransactionID].sum + data.sum;

        editTransaction(currentTransactionID, data)
          .then(() => setBalance(newBalance))
          .then(() => getUserDB())
          .then(newData => {
            setCurrentTransactionID(null);
            setUserData(newData);
          });
      } else {
        addNewTransaction(data)
          .then(() => setBalance(userData.balance + data.sum))
          .then(() => getUserDB())
          .then(newData => {
            setUserData(newData);
          });
      }
    } else {
      setCurrentTransactionID(null);
    }
  }

  function deleteTransaction(id) {
    const newBalance = userData.balance - userData.transactions[id].sum;
    removeTransaction(id)
      .then(() => setBalance(newBalance))
      .then(() => getUserDB())
      .then(data => setUserData(data));
  }

  if (isResponseWaiting) return <h1>Loading...</h1>;

  if (isAuth === false) return <Auth setIsAuth={setIsAuth} />;

  if (userData.balance === 0)
    return (
      <form
        className={styles.initialForm}
        onSubmit={e => {
          e.preventDefault();
          setBalance(+e.target.sum.value).then(setUserData);
        }}
      >
        <span>First, set your current balance please</span>
        <br />
        <input type="number" placeholder="sum" autoFocus name="sum" min="1" required />
        <input type="submit" />
      </form>
    );

  return (
    <div className={styles['app-container']}>
      <header>
        <button
          onClick={e => {
            setUserData({});
            signout();
            setIsAuth(false);
          }}
        >
          signout
        </button>
      </header>

      <Main
        balance={userData.balance}
        openForm={() => {
          setFormIsOpen(true);
        }}
      />
      <List
        transactions={userData.transactions}
        categories={userData.categories}
        openForm={id => {
          setCurrentTransactionID(id);
          setFormIsOpen(true);
        }}
        deleteTransaction={deleteTransaction}
        setUserData={setUserData}
      />
      {formIsOpen ? (
        <TransactionForm
          transaction={userData.transactions[currentTransactionID]}
          categories={userData.categories}
          returnData={formHandler}
        />
      ) : null}
    </div>
  );
}

window.App = App;
