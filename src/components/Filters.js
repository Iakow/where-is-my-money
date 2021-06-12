import React from 'react';
import { useEffect, useState } from 'react';

import styles from '../style';
import { getHTMLDate } from '../utils';

export default function Filters({ value, handler }) {
  const SortBySum = ({ value, handler }) => (
    <div>
      sortBySum
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
    <div>
      sortByDate
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
    <div>
      filterMoneyway
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

  const DateFilter = ({ value, handler }) => {
    return (
      <div>
        <input
          name="firstDate"
          type="datetime-local"
          placeholder="date"
          defaultValue={getHTMLDate(value.firstDate)}
          onChange={handler}
        />
        <input
          name="lastDate"
          type="datetime-local"
          placeholder="date"
          defaultValue={getHTMLDate(value.lastDate)}
          onChange={handler}
        />
      </div>
    );
  };

  return (
    <div>
      <SortBySum value={value.sortBySum} handler={handler} />
      <br />
      <SortByDate value={value.sortByDate} handler={handler} />
      <br />
      <FilterMoneyway value={value.filterMoneyway} handler={handler} />
      <br />
      <DateFilter value={value.filterDate} handler={handler} />
    </div>
  );
}
