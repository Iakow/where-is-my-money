import React, { useEffect, useState } from 'react';

import Main from '../components/Main';
import List from '../components/List';
import Auth from '../components/Auth';

import TransactionForm from './TransactionForm/TransactionForm';
import {
  connectFirebase,
  signout,
  editTransaction,
  initializeUserDB,
  addNewTransaction,
  removeTransaction,
  email,
} from '../data/firebase';

import styles from '../style.css';

export default function App() {
  const [isResponseWaiting, setIsResponceWaiting] = useState(true); // не нравится
  const [userData, setUserData] = useState(null);
  const [formIsOpen, setFormIsOpen] = useState(false);
  const [currentTransactionID, setCurrentTransactionID] = useState(null);
  const [isAuth, setIsAuth] = useState(false); // что это вообще?

  useEffect(() => {
    const dataCb = data => {
      if (data) setUserData(userData => ({ ...userData, ...data }));
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
        editTransaction(currentTransactionID, data).then(() => {
          setCurrentTransactionID(null);
        });
      } else {
        addNewTransaction(data);
      }
    } else {
      setCurrentTransactionID(null);
    }
  }

  function deleteTransaction(id) {
    removeTransaction(id);
  }

  if (isResponseWaiting) return <div className={styles.loading}>Loading...</div>;

  if (isAuth === false) return <Auth setIsAuth={setIsAuth} />;

  if (userData === null) {
    return (
      <form
        className={styles.initialForm}
        onSubmit={e => {
          e.preventDefault();

          initializeUserDB(+e.target.sum.value);
        }}
      >
        <p className={styles['initialForm_auth-message']}>Wellcome {email}!</p>
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
  }

  return (
    <div className={styles['app-container']}>
      <header>
        <button
          onClick={e => {
            setUserData(null);
            signout();
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
