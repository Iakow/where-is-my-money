/** @jsx createElement */
/** @jsxFrag createFragment */
import { createElement, createFragment } from '../framework/element';
import { useEffect, useState } from '../framework/hooks';

import styles from '../style';
import { getDateString } from '../utils';
import Filters from '../components/Filters';
import { removeTransaction, setBalance, getUserDB } from '../data/rest';

export default function List({ setUserData, transactions, balance, categories, openForm }) {
  //TODO: lastDate конфюзит, когда добавляется новая транзакция.
  const [filters, setFilters] = useState({
    filterMoneyway: 0,
    sortBySum: 0,
    sortByDate: 1,
    filterDate: {
      firstDate: 0,
      lastDate: Date.now(),
    },
  });

  let totalSum = 0;

  function getFilteredTransactions(transactions) {
    let filteredTransactions = Object.entries(transactions);

    filteredTransactions = filteredTransactions.filter(
      transaction =>
        transaction[1].date >= filters.filterDate.firstDate &&
        transaction[1].date <= filters.filterDate.lastDate,
    );

    if (filters.filterMoneyway != 0) {
      filteredTransactions = filteredTransactions.filter(
        transaction => filters.filterMoneyway * transaction[1].sum > 0,
      );
    }

    if (filters.sortByDate != 0) {
      filteredTransactions.sort((a, b) => filters.sortByDate * (b[1].date - a[1].date));
    }
    if (filters.sortBySum != 0) {
      filteredTransactions.sort((a, b) => filters.sortBySum * (b[1].sum - a[1].sum));
    }

    return filteredTransactions;
  }

  const ListItems = getFilteredTransactions(transactions).map(transaction => {
    const { date, category, comment, sum } = transaction[1];
    const id = transaction[0];
    const categoryGroup = sum < 0 ? 'outcome' : 'income';
    totalSum += sum;
    const color = { outcome: 'red', income: 'green' };

    return (
      <li id={id} class={styles['list-item']}>
        <span style="width:30%">{getDateString(date)}</span>
        <span class={styles[color[categoryGroup]]} style="width:15%">
          {sum}
        </span>
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
  });

  return (
    <div>
      <ul class={styles.list}>
        {ListItems}
        <li>sum: {totalSum}</li>
      </ul>

      <Filters value={filters} setFilters={setFilters} />
    </div>
  );

  function deleteTransaction(e) {
    const id = e.target.parentElement.id;
    const newBalance = balance - transactions[id].sum;

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
