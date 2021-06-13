import React from 'react';
import { useEffect, useState } from 'react';

import styles from '../style';
import { getDateString } from '../utils';
import Filters from '../components/Filters';

export default function List({ transactions, categories, openForm, deleteTransaction }) {
  const [selectedTransactions, setSelectedTransactions] = useState([]);

  const [filters, setFilters] = useState({
    filterMoneyway: 0,
    sortBySum: 0,
    sortByDate: 1,
    filterDate: {
      firstDate: 0,
      lastDate: Date.now(),
    },
  });

  useEffect(() => {
    setSelectedTransactions(Object.entries({ ...transactions }));
  }, [transactions]);

  let totalSum = 0;

  function handleInputs({ target }) {
    const newFilterState = { ...filters };
    if (target.name == 'sortBySum') {
      newFilterState.sortBySum = +target.value;
      newFilterState.sortByDate = 0;
    } else if (target.name == 'sortByDate') {
      newFilterState.sortByDate = +target.value;
      newFilterState.sortBySum = 0;
    } else if (target.name == 'filterMoneyway') {
      newFilterState.filterMoneyway = +target.value;
    } else if (target.name == 'firstDate' || target.name == 'lastDate') {
      newFilterState.filterDate[target.name] = new Date(target.value).getTime();
    }

    setFilters(newFilterState);
    selectTransactions(newFilterState);
  }

  function selectTransactions(filters) {
    let filteredTransactions = Object.entries({ ...transactions });

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

    setSelectedTransactions(filteredTransactions);
  }

  return (
    <>
      <ul className={styles.list}>
        {selectedTransactions.map(transaction => {
          const { date, category, comment, sum } = transaction[1];
          const id = transaction[0];
          const categoryGroup = sum < 0 ? 'outcome' : 'income';
          totalSum += sum;
          const color = { outcome: 'red', income: 'green' };

          return (
            <li key={id} id={id} className={styles['list_item']}>
              <span className={styles.list_item_date}>{getDateString(date)}</span>
              <span className={`${styles.list_item_sum} ${styles[color[categoryGroup]]}`}>
                {sum}
              </span>
              <span className={styles.list_item_category}>
                {categories[categoryGroup][category]}
              </span>
              <span className={styles.list_item_comment}>{comment}</span>

              <span className={styles.list_item_btns}>
                <button
                  className={styles.list_item_edit}
                  onClick={e => {
                    openForm(e.target.parentElement.parentElement.id);
                  }}
                >
                  🖉
                </button>

                <button
                  className={styles.list_item_delete}
                  onClick={e => deleteTransaction(e.target.parentElement.parentElement.id)}
                >
                  X
                </button>
              </span>
            </li>
          );
        })}
      </ul>

      <Filters value={filters} handler={handleInputs} totalSelectedSum={totalSum} />
    </>
  );
}
