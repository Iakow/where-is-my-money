/** @jsx createElement */
/** @jsxFrag createFragment */
import { createElement, createFragment } from '../framework/element';

import styles from '../style';
import renderApp from '../framework/render';
import { getDateString } from '../utils';
import { removeTransaction, setBalance, getUserDB } from '../data/rest';
import dataStore from '../data/dataStore';

export default function List({ transactions }) {
  let items = [];

  for (let id in transactions) {
    const { sum, date, category, comment } = transactions[id];
    const categoryGroup = sum < 0 ? 'outcome' : 'income';

    items.push(
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
      </li>,
    );
  }

  return (
    <>
      <ul class={styles.list}>{items}</ul>
    </>
  );
}

function loadTransactionInForm(e) {
  const transactionID = e.target.parentElement.id;
  dataStore.transactionForm.transactionId = transactionID;

  dataStore.transactionForm.data = { ...dataStore.userData.transactions[transactionID] };

  dataStore.transactionForm.isOpened = true;
  renderApp();
  document.forms[0].sum.focus();
}

function deleteTransaction(e) {
  const id = e.target.parentElement.id;
  const newBalance = dataStore.userData.balance - dataStore.userData.transactions[id].sum;

  removeTransaction(id)
    .then(() => setBalance(newBalance))
    .then(() => getUserDB())
    .then(data => {
      dataStore.userData.balance = data.balance;
      dataStore.userData.transactions = data.transactions;
      dataStore.userData.categories = data.categories;

      renderApp();
    });
}
