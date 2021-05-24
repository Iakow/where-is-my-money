/** @jsx createElement */
/** @jsxFrag createFragment */
import { createElement, createFragment } from '../framework/element';

import styles from '../style';
import { getHTMLDate } from '../utils';

export default function Filters({ value, setFilters }) {
  function handler({ target }) {
    if (target.name == 'sortBySum') {
      setFilters(filters => {
        filters.sortBySum = +target.value;
        filters.sortByDate = 0;
        return filters;
      });
    } else if (target.name == 'sortByDate') {
      setFilters(filters => {
        filters.sortByDate = +target.value;
        filters.sortBySum = 0;
        return filters;
      });
    } else if (target.name == 'filterMoneyway') {
      setFilters(filters => {
        filters.filterMoneyway = +target.value;
        return filters;
      });
    } else if (target.name == 'firstDate' || target.name == 'lastDate') {
      setFilters(filters => {
        filters.filterDate[target.name] = new Date(target.value).getTime();
        return filters;
      });
    }
  }

  const SortBySum = ({ value }) => (
    <>
      sortBySum
      <label>
        <input type="radio" name="sortBySum" value="0" checked={value === 0} />
        Off
      </label>
      <label>
        <input type="radio" name="sortBySum" value="1" checked={value === 1} />
        Up
      </label>
      <label>
        <input type="radio" name="sortBySum" value="-1" checked={value === -1} />
        Down
      </label>
    </>
  );

  const SortByDate = ({ value }) => (
    <>
      sortByDate
      <label>
        <input type="radio" name="sortByDate" value="0" checked={value === 0} />
        Off
      </label>
      <label>
        <input type="radio" name="sortByDate" value="1" checked={value === 1} />
        Up
      </label>
      <label>
        <input type="radio" name="sortByDate" value="-1" checked={value === -1} />
        Down
      </label>
    </>
  );

  const FilterMoneyway = ({ value }) => (
    <>
      filterMoneyway
      <label>
        <input type="radio" name="filterMoneyway" value="0" checked={value === 0} />
        All
      </label>
      <label>
        <input type="radio" name="filterMoneyway" value="1" checked={value === 1} />
        Income
      </label>
      <label>
        <input type="radio" name="filterMoneyway" value="-1" checked={value === -1} />
        Outcome
      </label>
    </>
  );

  const DateFilter = ({ value }) => {
    function DateInput({ value, name }) {
      return (
        <input name={name} type="datetime-local" placeholder="date" value={getHTMLDate(value)} />
      );
    }

    return (
      <>
        <DateInput value={value.firstDate} name="firstDate" />
        <DateInput value={value.lastDate} name="lastDate" />
      </>
    );
  };

  return (
    <div onchange={handler}>
      <SortBySum value={value.sortBySum} />
      <br />
      <SortByDate value={value.sortByDate} />
      <br />
      <FilterMoneyway value={value.filterMoneyway} />
      <br />
      <DateFilter value={value.filterDate} />
    </div>
  );
}
