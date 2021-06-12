import React from 'react';
import { useEffect, useState } from 'react';

import styles from '../../style';

import Sum from './Sum';
import Category from './Category';
import DateInput from './DateInput';
import Comment from './Comment';
import ToogleMoneyWay from './ToggleMoneyWay';

export default function TransactionForm({ transaction, categories, returnData }) {
  // TODO don`t show single zero in sum
  // TODO: what about initial category?

  // TODO: переписать как-то изящнее?
  const initialTransactionValues = transaction
    ? { ...transaction }
    : {
        comment: '',
        category: 0,
        sum: 0,
        date: Date.now(),
      };

  const [data, setData] = useState(initialTransactionValues);
  const [isIncome, setIsIncome] = useState(
    transaction ? (transaction.sum > 0 ? true : false) : false,
  );

  const updateData = (name, value) => {
    setData(data => {
      if (name == 'sum') value = isIncome === true ? +value : -value; // а если ноль?

      data[name] = value;
      return data;
    });
  };

  const toggleMoneyWay = ({ target }) => {
    setIsIncome(target.value === 'income' ? true : false);

    if (data.sum !== 0) {
      setData(data => {
        data.sum *= -1;
        data.category = 0;
        return data;
      });
    }
  };

  return (
    <form
      className={styles.form}
      onSubmit={e => {
        e.preventDefault();
        returnData(data);
      }}
    >
      <Sum value={Math.abs(data.sum)} returnData={updateData} />

      <DateInput value={data.date} handler={updateData} />

      <div>
        <label>
          <input
            type="radio"
            name="moneyWay"
            value="income"
            checked={isIncome}
            onChange={toggleMoneyWay}
          />
          income
        </label>

        <label>
          <input
            type="radio"
            name="moneyWay"
            value="outcome"
            checked={!isIncome}
            onChange={toggleMoneyWay}
          />
          outcome
        </label>
      </div>

      <Category
        value={data.category}
        categories={isIncome ? categories.income : categories.outcome}
        handler={updateData}
      />

      <Comment value={data.comment} handler={updateData} />

      <button
        type="button"
        className="cancel"
        onClick={() => {
          returnData();
        }}
      >
        cancel
      </button>

      <input className="add" type="submit" value="add" />
    </form>
  );
}
