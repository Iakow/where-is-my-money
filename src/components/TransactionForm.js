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

export default function TransactionForm({
  balance,
  transaction,
  categories,
  closeForm,
  setUserData,
  handler,
}) {
  //что-то сделать с initialSum, хотя, она нужна для подсчета balance
  const initialDataValue = {
    comment: '',
    category: 1,
    sum: '',
    date: Date.now(),
  };

  const [data, setData] = useState(transaction || initialDataValue);
  const [focus, setFocus] = useState('sum'); //must be node?
  const [isIncome, setIsIncome] = useState(false);

  // нужно представить, что форма рендерится просто всегда, кнопкой туда просто отправляются данные
  useEffect(() => {
    setData(transaction);
  }, [transaction]);

  const updateData = (name, value) => {
    setData(data => {
      data[name] = value;
      return data;
    });
  };

  return (
    <form
      class={styles.form}
      onsubmit={e => {
        e.preventDefault();
        handler(data);
        setData(null);
      }}
    >
      <Sum value={data.sum} handler={updateData} />
      <DateInput value={data.date} handler={updateData} />
      {/* <Category value={data.category} categories={categories} moneyWay={moneyWay} />*/}
      <Comment value={data.comment} handler={updateData} />

      <button
        type="button"
        class="cancel"
        onclick={() => {
          // TransactionForm.hooks=[];
          closeForm();
          /* setData({
            comment: '',
            category: 1,
            sum: '',
            date: Date.now(),
          }); */
        }}
      >
        cancel
      </button>

      <input class="add" type="submit" value="add" />
    </form>
  );
}
