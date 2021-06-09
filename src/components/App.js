import React from 'react';
import { useEffect, useState } from 'react';
import { connectFirebase } from '../data/rest.js';

import Main from '../components/Main';
import List from '../components/List';

import TransactionForm from './TransactionForm/TransactionForm';
import {
  editTransaction,
  setBalance,
  getUserDB,
  addNewTransaction,
  removeTransaction,
} from '../data/rest';
import styles from '../style.css';

export default function App() {
  const [userDataIsLoaded, setIsLoaded] = useState(false);
  const [userData, setUserData] = useState({});
  const [formIsOpen, setFormIsOpen] = useState(false);
  const [currentTransactionID, setCurrentTransactionID] = useState(null);

  useEffect(
    () => {
      connectFirebase(data => {
        setUserData(data);
        setIsLoaded(!userDataIsLoaded);
      });
    },
    [
      /* а что если юзер выйдет? */
    ],
  );

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
            console.log(newData);
            setUserData(newData);
          });
      } else {
        addNewTransaction(data)
          .then(() => setBalance(userData.balance + data.sum))
          .then(() => getUserDB())
          .then(newData => {
            console.log(newData);
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

  if (!userDataIsLoaded) {
    return <h1>Loading...</h1>;
  } else {
    return (
      <div className={styles['app-container']}>
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

        {/* {Object.values(userData.transactions).map(item => <p>{item.sum}</p>)} */}

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
}

window.App = App;
