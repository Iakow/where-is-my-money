import React, { useState } from 'react';

import styles from '../style';
import { getHTMLDate } from '../utils';

export default function Filters({ value, handler, totalSelectedSum }) {
  const upPureValue = ({ target }) => {
    handler(target.name, +target.value);
  };

  const upDateValue = ({ target }) => {
    handler(target.name, new Date(target.value).getTime());
  };

  const SortBySum = ({ value, handler }) => (
    <div className={styles.filters_item}>
      Sort by sum
      <br />
      <label>
        <input type="radio" name="sortBySum" value="0" checked={value === 0} onChange={handler} />
        Off
      </label>
      <label>
        <input type="radio" name="sortBySum" value="1" checked={value === 1} onChange={handler} />
        Up
      </label>
      <label>
        <input type="radio" name="sortBySum" value="-1" checked={value === -1} onChange={handler} />
        Down
      </label>
    </div>
  );

  const SortByDate = ({ value, handler }) => (
    <div className={styles.filters_item}>
      Sort by date
      <br />
      <label>
        <input
          type="radio"
          name="sortByDate"
          defaultValue="0"
          defaultChecked={value === 0}
          onChange={handler}
        />
        Off
      </label>
      <label>
        <input
          type="radio"
          name="sortByDate"
          defaultValue="1"
          defaultChecked={value === 1}
          onChange={handler}
        />
        Up
      </label>
      <label>
        <input
          type="radio"
          name="sortByDate"
          defaultValue="-1"
          defaultChecked={value === -1}
          onChange={handler}
        />
        Down
      </label>
    </div>
  );

  const FilterMoneyway = ({ value, handler }) => (
    <div className={styles.filters_item}>
      Filter by money way
      <br />
      <label>
        <input
          type="radio"
          name="filterMoneyway"
          defaultValue="0"
          defaultChecked={value === 0}
          onChange={handler}
        />
        All
      </label>
      <label>
        <input
          type="radio"
          name="filterMoneyway"
          defaultValue="1"
          defaultChecked={value === 1}
          onChange={handler}
        />
        Income
      </label>
      <label>
        <input
          type="radio"
          name="filterMoneyway"
          defaultValue="-1"
          defaultChecked={value === -1}
          onChange={handler}
        />
        Outcome
      </label>
    </div>
  );

  const DateFilter = ({ value }) => {
    const handle = ({ target }) => {
      const newValue = { ...value };
      if (target.type === 'checkbox') {
        newValue[target.name].isEnabled = !newValue[target.name].isEnabled;
        handler('filterDate', newValue);
      } else {
        newValue[target.name].dateValue = new Date(target.value).getTime();
        handler('filterDate', newValue);
      }
    };

    return (
      <div className={styles.filters_item}>
        Filter by time period
        <br />
        <input
          name="firstDate"
          type="checkbox"
          checked={value.firstDate.isEnabled}
          onChange={handle}
        />
        <input
          name="firstDate"
          type="datetime-local"
          disabled={!value.firstDate.isEnabled}
          placeholder="date"
          defaultValue={getHTMLDate(value.firstDate.dateValue)}
          onChange={handle}
        />
        <br />
        <input
          name="lastDate"
          type="checkbox"
          checked={value.lastDate.isEnabled}
          onChange={handle}
        />
        <input
          name="lastDate"
          type="datetime-local"
          disabled={!value.lastDate.isEnabled}
          placeholder="date"
          defaultValue={getHTMLDate(value.lastDate.dateValue)}
          onChange={handle}
        />
      </div>
    );
  };

  return (
    <div className={styles.filters}>
      <SortBySum value={value.sortBySum} handler={upPureValue} />
      <SortByDate value={value.sortByDate} handler={upPureValue} />
      <FilterMoneyway value={value.filterMoneyway} handler={upPureValue} />
      <DateFilter value={value.filterDate} handler={upPureValue} />

      <p className={styles['filters_total-sum']}>Sample sum: {totalSelectedSum}</p>
    </div>
  );
}
