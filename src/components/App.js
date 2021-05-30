/** @jsx createElement */
/*** @jsxFrag createFragment */
import { createElement, createFragment } from '../framework/element';
import { useEffect, useState, useRef, current } from '../framework/hooks';
import { connectFirebase } from '../data/rest.js';

import Main from '../components/Main';
import List from '../components/List';

import TransactionForm from './TransactionForm/TransactionForm';
import { editTransaction, setBalance, getUserDB, addNewTransaction } from '../data/rest';
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

    if (!data) {
      //just close
    } else {
      if (currentTransactionID) {
        //update
        setCurrentTransactionID(null);
      } else {
        //add new'
      }
    }

    /* const { sum, date, category, comment, moneyWay } = data;

    const newTransaction = {
      sum: moneyWay.value == 'income' ? +sum : -sum,
      date: new Date(date.value).getTime(),
      category: +category.value,
      comment: comment.value,
    };

    const newBalance = balance + newTransaction.sum - initialSum;

    if (data) {
      if (id) {
        editTransaction(id, newTransaction)
          .then(() => setBalance(newBalance))
          .then(() => getUserDB())
          .then(data => {
            setUserData(data);
          });
      } else {
        addNewTransaction(newTransaction)
          .then(() => setBalance(newBalance))
          .then(() => getUserDB())
          .then(data => {
            setUserData(data);
          });
      }
    } */
  }

  if (!userDataIsLoaded) {
    return <h1>Loading...</h1>;
  } else {
    return (
      <div class={styles['app-container']}>
        <Main
          balance={userData.balance}
          openForm={() => {
            setFormIsOpen(true);
          }}
        />

        <List
          transactions={userData.transactions}
          // TODO can i not use whole categories here?
          categories={userData.categories}
          openForm={id => {
            setCurrentTransactionID(id);
            setFormIsOpen(true);
          }}
          setUserData={setUserData}
        />

        {formIsOpen ? (
          <TransactionForm
            // TODO what if currentTransactionID == null?
            transaction={userData.transactions[currentTransactionID]} // initialData!
            categories={userData.categories}
            returnData={formHandler}
          />
        ) : null}
      </div>
    );
  }
}
