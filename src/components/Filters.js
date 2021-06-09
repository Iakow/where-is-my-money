import React from 'react';
import { useEffect, useState } from 'react';

import styles from '../style';
import { getHTMLDate } from '../utils';

export default function Filters({ value, handler }) {
  /* function handler({ target }) {
    if (target.name == 'sortBySum') {
      returnValue(filters => {
        filters.sortBySum = +target.value;
        filters.sortByDate = 0;
        return filters;
      });
      console.log(value)
    } else if (target.name == 'sortByDate') {
      returnValue(filters => {
        filters.sortByDate = +target.value;
        filters.sortBySum = 0;
        return filters;
      });
    } else if (target.name == 'filterMoneyway') {
      returnValue(filters => {
        filters.filterMoneyway = +target.value;
        return filters;
      });
    } else if (target.name == 'firstDate' || target.name == 'lastDate') {
      returnValue(filters => {
        filters.filterDate[target.name] = new Date(target.value).getTime();
        return filters;
      });
    }
  } */

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

  const SortByDate = ({ value }) => (
    <div>
      sortByDate
      <label>
        <input type="radio" name="sortByDate" defaultValue="0" defaultChecked={value === 0} />
        Off
      </label>
      <label>
        <input type="radio" name="sortByDate" defaultValue="1" defaultChecked={value === 1} />
        Up
      </label>
      <label>
        <input type="radio" name="sortByDate" defaultValue="-1" defaultChecked={value === -1} />
        Down
      </label>
    </div>
  );

  const FilterMoneyway = ({ value }) => (
    <div>
      filterMoneyway
      <label>
        <input type="radio" name="filterMoneyway" defaultValue="0" defaultChecked={value === 0} />
        All
      </label>
      <label>
        <input type="radio" name="filterMoneyway" defaultValue="1" defaultChecked={value === 1} />
        Income
      </label>
      <label>
        <input type="radio" name="filterMoneyway" defaultValue="-1" defaultChecked={value === -1} />
        Outcome
      </label>
    </div>
  );

  const DateFilter = ({ value }) => {
    function DateInput({ value, name }) {
      return (
        <input
          name={name}
          type="datetime-local"
          placeholder="date"
          defaultValue={getHTMLDate(value)}
        />
      );
    }

    return (
      <div>
        <DateInput value={value.firstDate} name="firstDate" />
        <DateInput value={value.lastDate} name="lastDate" />
      </div>
    );
  };

  return (
    <div>
      <div>
        sortBySum
        <label>
          <input
            type="radio"
            name="sortBySum"
            value="0"
            defaultChecked={value.sortBySum === 0}
            onChange={handler}
          />
          Off
        </label>
        <label>
          <input
            type="radio"
            name="sortBySum"
            value="1"
            defaultChecked={value === 1}
            onChange={handler}
          />
          Up
        </label>
        <label>
          <input
            type="radio"
            name="sortBySum"
            value="-1"
            defaultChecked={value === -1}
            onChange={handler}
          />
          Down
        </label>
      </div>

      <br />
      <div>
        sortByDate
        <label>
          <input
            type="radio"
            name="sortByDate"
            value="0"
            defaultChecked={value.sortByDate === 0}
            onChange={handler}
          />
          Off
        </label>
        <label>
          <input
            type="radio"
            name="sortByDate"
            value="1"
            defaultChecked={value.sortByDate === 1}
            onChange={handler}
          />
          Up
        </label>
        <label>
          <input
            type="radio"
            name="sortByDate"
            value="-1"
            defaultChecked={value.sortByDate === -1}
            onChange={handler}
          />
          Down
        </label>
      </div>
      {/* <SortByDate value={value.sortByDate} /> */}
      <br />
      <div>
        filterMoneyway
        <label>
          <input
            type="radio"
            name="filterMoneyway"
            value="0"
            defaultChecked={value.filterMoneyway === 0}
            onChange={handler}
          />
          All
        </label>
        <label>
          <input
            type="radio"
            name="filterMoneyway"
            value="1"
            defaultChecked={value.filterMoneyway === 1}
            onChange={handler}
          />
          Income
        </label>
        <label>
          <input
            type="radio"
            name="filterMoneyway"
            value="-1"
            defaultChecked={value.filterMoneyway === -1}
            onChange={handler}
          />
          Outcome
        </label>
      </div>
      {/* <FilterMoneyway value={value.filterMoneyway} /> */}
      <br />
      <input
        name="firstDate"
        type="datetime-local"
        placeholder="date"
        defaultValue={getHTMLDate(value.filterDate.firstDate)}
        onChange={handler}
      />
      <input
        name="lastDate"
        type="datetime-local"
        placeholder="date"
        defaultValue={getHTMLDate(value.filterDate.lastDate)}
        onChange={handler}
      />
      {/* <DateFilter value={value.filterDate} /> */}
    </div>
  );
}
