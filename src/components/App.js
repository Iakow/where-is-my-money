/** @jsx createElement */
/*** @jsxFrag createFragment */
import { createElement, createFragment } from '../framework/element';
import { useEffect, useState, useRef, current } from '../framework/hooks';
import { connectFirebase } from '../data/rest.js';

import Main from '../components/Main';
import List from '../components/List';

import TransactionForm from '../components/TransactionForm';
import { editTransaction, setBalance, getUserDB, addNewTransaction } from '../data/rest';
import styles from '../style.css';

export default function App() {
  const [userDataIsLoaded, setIsLoaded] = useState(false);
  const [userData, setUserData] = useState({});
  const [formIsOpen, setFormIsOpen] = useState(false);
  // const [formData, setFormData] = useState(null);
  const [currentTransactionID, setCurrentTransactionID] = useState(null);

  useEffect(() => {
    connectFirebase(data => {
      setUserData(data);
      setIsLoaded(!userDataIsLoaded);
    });
  }, []);

  function formHandler(data) {
    setFormIsOpen(false);
  }

  if (!userDataIsLoaded) {
    return <h1>Loading...</h1>;
  } else {
    return (
      <div class={styles['app-container']}>
        {/* <Main
          balance={userData.balance}
          openForm={() => {
            setFormData(null);
            setFormIsOpen(true);
          }}
        /> */}

        <List
          balance={userData.balance}
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
            closeForm={() => {
              setFormIsOpen(false);
              setCurrentTransactionID(null);
            }}
          />
        ) : null}
      </div>
    );
  }
}
