/** @jsx createElement */
/*** @jsxFrag createFragment */
import { createElement, createFragment } from '../framework/element';

import dataStore from '../data/dataStore';
import Main from '../components/Main';
import List from '../components/List';
import Filters from '../components/Filters';
import TransactionForm from '../components/TransactionForm';
import styles from '../style.css';

export default function App() {
  const { balance, transactions } = dataStore.userData;
  const transaction = dataStore.transactionForm.data;
  const showForm = dataStore.transactionForm.isOpened;

  if (!dataStore.userDataIsLoaded) {
    return <h1>Loading...</h1>;
  } else {
    return (
      <div class={styles['app-container']}>
        <Main balance={balance} />
        <List transactions={dataStore.filteredTransactions} />
        <Filters />
        {showForm ? <TransactionForm transaction={transaction} /> : null}
      </div>
    );
  }
}
