/** @jsx createElement */
/** @jsxFrag createFragment */
import { createElement, createFragment } from '../framework/element';
import { useEffect, useState } from '../framework/hooks';

import styles from '../style';
import { getDateString } from '../utils';
import Filters from '../components/Filters';
import { removeTransaction, setBalance, getUserDB } from '../data/rest';

export default function List({ setUserData, transactions, balance, categories, openForm }) {
  //lastDate ебет, когда добавляется новая транзакция.
  const [filters, setFilters] = useState({
    filterMoneyway: 0,
    sortBySum: 0,
    sortByDate: 0,
    filterDate: {
      firstDate: 0,
      lastDate: Date.now(),
    },
  });

  let totalSum = 0;

  function getFilteredTransactions(transactions) {
    let filteredTransactions = [...transactions];

    filteredTransactions = filteredTransactions.filter(
      transaction =>
        transaction.date >= filters.filterDate.firstDate &&
        transaction.date <= filters.filterDate.lastDate,
    );

    if (filters.filterMoneyway != 0) {
      filteredTransactions = filteredTransactions.filter(
        transaction => filters.filterMoneyway * transaction.sum < 0,
      );
    }

    if (filters.sortByDate != 0) {
      filteredTransactions.sort((a, b) => filters.sortByDate * (b.date - a.date));
    }
    if (filters.sortBySum != 0) {
      filteredTransactions.sort((a, b) => filters.sortBySum * (a.sum - b.sum));
    }

    return filteredTransactions;
  }

  const ListItems = getFilteredTransactions(transactions).map(
    ({ id, date, category, comment, sum }) => {
      const categoryGroup = sum < 0 ? 'outcome' : 'income';
      totalSum += sum;

      return (
        <li id={id} class={styles['list-item']}>
          <span style="width:30%">{getDateString(date)}</span>
          <span style="width:15%">{sum}</span>
          <span>{categories[categoryGroup][category]}</span>
          <span style="width:25%">{comment}</span>

          <button
            class={styles['btn-edit']}
            onclick={e => {
              openForm(e.target.parentElement.id);
            }}
          >
            🖉
          </button>

          <button class={styles['btn-delete']} onclick={deleteTransaction}>
            X
          </button>
        </li>
      );
    },
  );

  return (
    <>
      <ul class={styles.list}>
        {ListItems}
        <li>sum: {totalSum}</li>
      </ul>

      <Filters value={filters} setFilters={setFilters} />
    </>
  );

  function deleteTransaction(e) {
    const id = e.target.parentElement.id;
    const newBalance = balance - transactions.find(item => item.id === id).sum;

    removeTransaction(id)
      .then(() => setBalance(newBalance))
      .then(() => getUserDB())
      .then(data => {
        const { balance, categories } = data;
        const transactions = Object.entries(data.transactions).map(([key, value]) => ({
          id: key,
          ...value,
        }));
        setUserData({ balance, categories, transactions });
      });
  }
}
