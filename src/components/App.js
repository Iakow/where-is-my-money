/** @jsx createElement */
/*** @jsxFrag createFragment */
import { createElement, createFragment } from '../framework/element';
import { useEffect, useState } from '../framework/hooks';
import { connectFirebase } from '../data/rest.js';

import Main from '../components/Main';
import List from '../components/List';

import TransactionForm from '../components/TransactionForm';
import styles from '../style.css';

export default function App() {
  const [userDataIsLoaded, setIsLoaded] = useState(false);
  const [userData, setUserData] = useState({});
  const [formIsOpen, setFormIsOpen] = useState(false);
  const [formData, setFormData] = useState(null);

  useEffect(() => {
    if (!userDataIsLoaded) {
      connectFirebase(data => {
        setUserData(data);
        setIsLoaded(!userDataIsLoaded);
      });
    }
  });

  if (!userDataIsLoaded) {
    return <h1>Loading...</h1>;
  } else {
    return (
      <div class={styles['app-container']}>
        <Main
          balance={userData.balance}
          openForm={() => {
            setFormData(null);
            setFormIsOpen(true);
          }}
        />

        <List
          balance={userData.balance}
          transactions={userData.transactions}
          categories={userData.categories}
          openForm={id => {
            setFormData(userData.transactions[id]);
            setFormIsOpen(true);
          }}
          setUserData={setUserData}
        />

        {formIsOpen ? (
          <TransactionForm
            balance={userData.balance} // why?
            transaction={formData}
            categories={userData.categories}
            closeForm={() => {
              setFormIsOpen(false);
            }}
            setUserData={setUserData}
          />
        ) : null}
      </div>
    );
  }
}
