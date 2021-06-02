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

  // временный флаг, чтобы проще отслеживать примитив в стейте вместо userData
  const [flag, setFlag] = useState('');

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
      const newBalance = userData.balance + data.sum;

      if (currentTransactionID) {
        editTransaction(currentTransactionID, data)
          .then(() => setBalance(newBalance))
          .then(() => getUserDB())
          .then(data => {
            setUserData(data);
            setCurrentTransactionID(null);
          });
      } else {
        setFlag('loading');

        addNewTransaction(data)
          .then(() => setBalance(newBalance))
          .then(() => getUserDB())
          .then(() => {
            setFlag('ok');
            setUserData(data);
          });
      }
    }
  }

  if (!userDataIsLoaded) {
    return <h1>Loading...</h1>;
  } else {
    return (
      <div class={styles['app-container']}>
        <p>{flag}</p>
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
}

window.App = App;
