/** @jsx createElement */
/*** @jsxFrag createFragment */
import { createElement, createFragment } from '../framework/element';

import styles from '../style';
import renderApp from '../framework/render';
import { editTransaction, setBalance, getUserDB, addNewTransaction } from '../data/rest';
import { getHTMLDate } from '../utils';
import dataStore from '../data/dataStore';

let moneyWay;

export default function TransactionForm({ transaction }) {
  moneyWay = +transaction.sum > 0 ? 'income' : 'outcome';
  const { comment, category } = transaction;
  const sum = transaction.sum ? Math.abs(transaction.sum) : '';
  const date = getHTMLDate(transaction.date);

  return (
    <form class={styles.form} onsubmit={addTransactionInDB}>
      <Sum value={sum} />
      <DateInput value={date} />
      <Category value={category} />
      <Comment value={comment} />

      <button type="button" class="cancel" onclick={cancel}>
        cancel
      </button>
      <input class="add" type="submit" value="add" />
    </form>
  );
}

function Sum({ value }) {
  return <input type="number" placeholder="sum" name="sum" min="1" value={value} required />;
}

function Category({ value }) {
  const handler = e => {
    document.querySelector('#categories').innerHTML = dataStore.userData.categories[e.target.value]
      .map((category, i) => `<option value=${i}>${category}</option>`)
      .join('');
  };

  return (
    <>
      <div onchange={handler}>
        <label>
          <input type="radio" name="moneyWay" value="income" checked={moneyWay == 'income'} />
          income
        </label>

        <label>
          <input type="radio" name="moneyWay" value="outcome" checked={moneyWay == 'outcome'} />
          outcome
        </label>
      </div>

      <br />

      <select name="category" id="categories">
        {dataStore.userData.categories[moneyWay].map((category, i) => (
          <option selected={value == i} value={i}>
            {category}
          </option>
        ))}
      </select>
    </>
  );
}

function DateInput({ value }) {
  return <input name="date" type="datetime-local" placeholder="date" value={value} />;
}

function Comment({ value }) {
  return <input type="text" placeholder="comment" name="comment" value={value} />;
}

function addTransactionInDB(e) {
  e.preventDefault();

  const { sum, date, category, comment, moneyWay } = e.target.elements;

  const newTransaction = {
    sum: moneyWay.value == 'income' ? +sum.value : -sum.value,
    date: new Date(date.value).getTime(),
    category: +category.value,
    comment: comment.value,
  };

  const initialFormSum = +dataStore.transactionForm.data.sum;
  const newBalance = dataStore.userData.balance + newTransaction.sum - initialFormSum;

  // вот здесь чет не очт
  if (dataStore.transactionForm.transactionId) {
    editTransaction(dataStore.transactionForm.transactionId, newTransaction)
      .then(() => {
        dataStore.transactionForm.isOpened = false;
        renderApp();
      })
      .then(() => setBalance(newBalance))
      .then(() => getUserDB())
      .then(data => refreshUserData(data));
  } else {
    addNewTransaction(newTransaction)
      .then(() => {
        dataStore.transactionForm.isOpened = false;
        renderApp();
      })
      .then(() => setBalance(newBalance))
      .then(() => getUserDB())
      .then(data => refreshUserData(data));
  }
}

function cancel(e) {
  e.preventDefault();
  dataStore.transactionForm.isOpened = false;
  renderApp();
}

function refreshUserData(data) {
  dataStore.userData.balance = data.balance;
  dataStore.userData.transactions = data.transactions;
  dataStore.userData.categories = data.categories;
  renderApp();
}
