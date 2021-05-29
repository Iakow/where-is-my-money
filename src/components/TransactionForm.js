/** @jsx createElement */
/*** @jsxFrag createFragment */
import { createElement, createFragment } from '../framework/element';

import styles from '../style';
import { editTransaction, setBalance, getUserDB, addNewTransaction } from '../data/rest';
import { useEffect, useState, useRef } from '../framework/hooks';

import Sum from './Sum';
import Category from './Category';
import DateInput from './DateInput';
import Comment from './Comment';

export default function TransactionForm({ transaction, closeForm }) {
  const initialDataValue = {
    comment: '',
    category: 1,
    sum: '',
    date: Date.now(),
  };

  const [data, setData] = useState(transaction || initialDataValue);

  useEffect(() => {
    setData(transaction);
  });

  return (
    <form class={styles.form}>
      <Sum value={data.sum} />
      <DateInput value={data.date} />
      <Comment value={data.comment} />

      <button
        type="button"
        class="cancel"
        onclick={() => {
          // TransactionForm.hooks=[];
          closeForm();
        }}
      >
        cancel
      </button>
    </form>
  );
}
