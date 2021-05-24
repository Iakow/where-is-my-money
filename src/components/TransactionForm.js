/** @jsx createElement */
/*** @jsxFrag createFragment */
import { createElement, createFragment } from '../framework/element';

import styles from '../style';
import { editTransaction, setBalance, getUserDB, addNewTransaction } from '../data/rest';
import { getHTMLDate } from '../utils';
import Sum from './Sum';
import Category from './Category';
import DateInput from './DateInput';
import Comment from './Comment';

export default function TransactionForm({
  balance,
  transaction,
  categories,
  closeForm,
  setUserData,
}) {
  let moneyWay, comment, category, sum, initialSum, date, id;

  if (transaction) {
    moneyWay = +transaction.sum > 0 ? 'income' : 'outcome';
    comment = transaction.comment;
    category = transaction.category;
    sum = Math.abs(transaction.sum); // ???
    initialSum = transaction.sum; // ???
    date = getHTMLDate(transaction.date); // вот это лучше прямо в инпут запилить
    id = transaction.id;
  } else {
    moneyWay = 'outcome';
    comment = '';
    category = 1;
    sum = '';
    initialSum = 0;
    date = getHTMLDate(Date.now());
  }

  return (
    <form class={styles.form} onsubmit={addTransactionInDB}>
      <Sum value={sum} />
      <DateInput value={date} />
      {/* а может категории таки просто передавать и все? */}
      <Category value={category} categories={categories} moneyWay={moneyWay} />
      <Comment value={comment} />

      <button type="button" class="cancel" onclick={closeForm}>
        cancel
      </button>

      <input class="add" type="submit" value="add" />
    </form>
  );

  function addTransactionInDB(e) {
    e.preventDefault();

    const { sum, date, category, comment, moneyWay } = e.target.elements;

    const newTransaction = {
      sum: moneyWay.value == 'income' ? +sum.value : -sum.value,
      date: new Date(date.value).getTime(),
      category: +category.value,
      comment: comment.value,
    };

    const newBalance = balance + newTransaction.sum - initialSum;

    // вот здесь чет не оч
    if (id) {
      editTransaction(id, newTransaction)
        .then(() => {
          // закрыть форму, обнулить данные формы
        })
        .then(() => setBalance(newBalance))
        .then(() => getUserDB())
        .then(data => {
          const { balance, categories } = data;
          const transactions = Object.entries(data.transactions).map(([key, value]) => ({
            id: key,
            ...value,
          }));
          setUserData({ balance, categories, transactions });
          closeForm();
        });
    } else {
      addNewTransaction(newTransaction)
        .then(() => {
          // закрыть форму, обнулить данные формы
        })
        .then(() => setBalance(newBalance))
        .then(() => getUserDB())
        .then(data => {
          const { balance, categories } = data;
          const transactions = Object.entries(data.transactions).map(([key, value]) => ({
            id: key,
            ...value,
          }));
          setUserData({ balance, categories, transactions });
          closeForm();
        });
    }
  }
}
