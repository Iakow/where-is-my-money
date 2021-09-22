import React from 'react';

import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';

import styles from '../style';
import { getHTMLDate } from '../utils';

export default function Filters({ value, upFilterState, totalSelectedSum }) {
  const upPureValue = ({ target }) => {
    upFilterState(target.name, +target.value);
  };

  const upDateValue = ({ target }) => {
    const newValue = { ...value.filterDate };
    if (target.type === 'checkbox') {
      newValue[target.name].isEnabled = !newValue[target.name].isEnabled;
    } else {
      newValue[target.name].dateValue = new Date(target.value).getTime();
    }

    upFilterState('filterDate', newValue);
  };

  const FilterMoneyway = ({ value }) => (
    <div className={styles.filters_item}>
      <FormControl component="fieldset">
        <FormLabel component="legend">Filter by money way</FormLabel>
        <RadioGroup
          row
          aria-label="gender"
          name="filterMoneyway"
          value={value}
          onChange={upPureValue}
        >
          <FormControlLabel value="0" control={<Radio checked={value === 0} />} label="All" />
          <FormControlLabel value="1" control={<Radio checked={value === 1} />} label="Income" />
          <FormControlLabel value="-1" control={<Radio checked={value === -1} />} label="Outcome" />
        </RadioGroup>
      </FormControl>

      {/* <br />
      <label>
        <input
          type="radio"
          name="filterMoneyway"
          defaultValue="0"
          defaultChecked={value === 0}
          onChange={upPureValue}
        />
        All
      </label>
      <label>
        <input
          type="radio"
          name="filterMoneyway"
          defaultValue="1"
          defaultChecked={value === 1}
          onChange={upPureValue}
        />
        Income
      </label>
      <label>
        <input
          type="radio"
          name="filterMoneyway"
          defaultValue="-1"
          defaultChecked={value === -1}
          onChange={upPureValue}
        />
        Outcome
      </label> */}
    </div>
  );

  const DateFilter = ({ value }) => {
    return (
      <div className={styles.filters_item}>
        Filter by time period
        <br />
        <input
          name="firstDate"
          type="checkbox"
          checked={value.firstDate.isEnabled}
          onChange={upDateValue}
        />
        <input
          name="firstDate"
          type="datetime-local"
          disabled={!value.firstDate.isEnabled}
          placeholder="date"
          defaultValue={getHTMLDate(value.firstDate.dateValue)}
          onChange={upDateValue}
        />
        <br />
        <input
          name="lastDate"
          type="checkbox"
          checked={value.lastDate.isEnabled}
          onChange={upDateValue}
        />
        <input
          name="lastDate"
          type="datetime-local"
          disabled={!value.lastDate.isEnabled}
          placeholder="date"
          defaultValue={getHTMLDate(value.lastDate.dateValue)}
          onChange={upDateValue}
        />
      </div>
    );
  };

  return (
    <div>
      {/* className={styles.filters} */}
      <FilterMoneyway value={value.filterMoneyway} />
      <DateFilter value={value.filterDate} />

      <p className={styles['filters_total-sum']}>Sample sum: {totalSelectedSum}</p>
    </div>
  );
}
