/** @jsx createElement */
/*** @jsxFrag createFragment */
import { createElement, createFragment } from '../../framework/element';

import styles from '../../style';
import { useState } from '../../framework/hooks';

import Sum from './Sum';
import Category from './Category';
import DateInput from './DateInput';
import Comment from './Comment';
import ToogleMoneyWay from './ToggleMoneyWay';

export default function TransactionForm({ transaction, categories, returnData }) {
  // TODO don`t show single zero in sum
  // TODO: what about initial category?

  const initialTransactionValues = {
    comment: '',
    category: 0,
    sum: 0,
    date: Date.now(),
  };

  const [data, setData] = useState(transaction || initialTransactionValues);
  const [isIncome, setIsIncome] = useState(
    transaction ? (transaction.sum > 0 ? true : false) : false,
  );

  const updateData = (name, value) => {
    setData(data => {
      if (name == 'sum') value = isIncome ? +value : -value;
      data[name] = value;
      return data;
    });
  };

  return (
    <form
      class={styles.form}
      onsubmit={e => {
        e.preventDefault();
        returnData(data);
        // TransactionForm.hooks = [];
      }}
    >
      <Sum value={Math.abs(data.sum)} handler={updateData} />

      <DateInput value={data.date} handler={updateData} />

      <ToogleMoneyWay
        value={isIncome}
        handler={value => {
          setIsIncome(value);
          setData(data => {
            data.sum *= -1;
            data.category = 0;
            return data;
          });
        }}
      />

      <Category
        value={data.category}
        categories={isIncome ? categories.income : categories.outcome}
        handler={updateData}
      />

      <Comment value={data.comment} handler={updateData} />

      <button
        type="button"
        class="cancel"
        onclick={() => {
          // TransactionForm.hooks = [];
          returnData();
        }}
      >
        cancel
      </button>

      <input class="add" type="submit" value="add" />
    </form>
  );
}
