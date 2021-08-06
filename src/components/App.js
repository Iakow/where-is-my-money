import React, { useEffect, useState } from 'react';

import Main from '../components/Main';
import List from '../components/List';
import Auth from '../components/Auth';

import TransactionForm from './TransactionForm/TransactionForm';
import {
  connectFirebase,
  signout,
  editTransaction,
  setBalance,
  getUserDB,
  addNewTransaction,
  removeTransaction,
} from '../data/firebase';

import styles from '../style.css';

export default function App() {
  const [isResponseWaiting, setIsResponceWaiting] = useState(true);
  const [userData, setUserData] = useState({});
  const [formIsOpen, setFormIsOpen] = useState(false);
  const [currentTransactionID, setCurrentTransactionID] = useState(null);
  const [isAuth, setIsAuth] = useState(false);

  useEffect(() => {
    const dataCb = data => {
      setUserData(data);
      setIsAuth(true);
      setIsResponceWaiting(false);
    };

    const authCb = () => {
      setIsResponceWaiting(false);
      setIsAuth(false);
    };

    connectFirebase(dataCb, authCb);
  }, []);

  function handleTransactionForm(data) {
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
          .then(setUserData);
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
      .then(setUserData);
  }

  if (isResponseWaiting) return <div className={styles.loading}>Loading...</div>;

  if (isAuth === false) return <Auth setIsAuth={setIsAuth} />;

  if (userData.balance === false)
    return (
      <form
        className={styles.initialForm}
        onSubmit={e => {
          e.preventDefault();

          setBalance(+e.target.sum.value)
            .then(() => getUserDB())
            .then(setUserData);
        }}
      >
        <p className={styles['initialForm_auth-message']}>Registration completed successfully!</p>
        <p className={styles['initialForm_input-message']}>Now, set your current balance please</p>
        <input
          className={styles['initialForm_input']}
          type="number"
          placeholder="sum"
          autoFocus
          name="sum"
          min="1"
          required
        />
        <input className={styles['initialForm_submit']} type="submit" value="Send" />
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
          transaction={currentTransactionID ? userData.transactions[currentTransactionID] : null}
          categories={userData.categories}
          returnData={handleTransactionForm}
        />
      ) : null}
    </div>
  );
}
