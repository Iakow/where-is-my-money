import React from 'react';

import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import styles from '../../style.css';
import { getHTMLDate } from '../../utils';

export default function Filters({ value, upFilterState }) {
  const handleSelectFilter = ({ target }) => {
    upFilterState(target.name, +target.value);
  };

  return (
    <FormControl component="fieldset">
      <FormLabel component="legend">Filter by money way</FormLabel>
      <RadioGroup
        row
        aria-label="gender"
        name="filterMoneyway"
        value={value.filterMoneyway}
        onChange={handleSelectFilter}
      >
        <FormControlLabel
          value="0"
          control={<Radio checked={value.filterMoneyway === 0} />}
          label="All"
        />
        <FormControlLabel
          value="1"
          control={<Radio checked={value.filterMoneyway === 1} />}
          label="Income"
        />
        <FormControlLabel
          value="-1"
          control={<Radio checked={value.filterMoneyway === -1} />}
          label="Outcome"
        />
      </RadioGroup>
    </FormControl>
  );
}
