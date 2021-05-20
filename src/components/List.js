/** @jsx createElement */
/** @jsxFrag createFragment */
import { createElement, createFragment } from '../framework/element';

import styles from '../style';
import renderApp from '../framework/render';
import { getDateString } from '../utils';
import { removeTransaction, setBalance, getUserDB } from '../data/rest';
import dataStore from '../data/dataStore';

export default function List({ transactions }) {
  let totalSum = 0;

  const ListItems = transactions.map(({ id, date, category, comment, sum }) => {
    const categoryGroup = sum < 0 ? 'outcome' : 'income';
    totalSum += sum;

    return (
      <li id={id} class={styles['list-item']}>
        <span style="width:30%">{getDateString(date)}</span>
        <span style="width:15%">{sum}</span>
        <span>{dataStore.userData.categories[categoryGroup][category]}</span>
        <span style="width:25%">{comment}</span>

        <button class={styles['btn-edit']} onclick={loadTransactionInForm}>
          🖉
        </button>

        <button class={styles['btn-delete']} onclick={deleteTransaction}>
          X
        </button>
      </li>
    );
  });

  return (
    <ul class={styles.list}>
      {ListItems}
      <li>sum: {totalSum}</li>
    </ul>
  );
}

function loadTransactionInForm(e) {
  const transactionID = e.target.parentElement.id;
  dataStore.transactionForm.transactionId = transactionID;

  // не нужна деструктуризцаия?
  dataStore.transactionForm.data = {
    ...dataStore.userData.transactions.find(item => item.id === transactionID),
  };

  dataStore.transactionForm.isOpened = true;
  renderApp();
  document.forms[0].sum.focus();
}

function deleteTransaction(e) {
  const id = e.target.parentElement.id;
  const newBalance =
    dataStore.userData.balance - dataStore.userData.transactions.find(item => item.id === id).sum;

  removeTransaction(id)
    .then(() => setBalance(newBalance))
    .then(() => getUserDB())
    .then(data => {
      dataStore.setUserData(data);
      renderApp();
    });
}
