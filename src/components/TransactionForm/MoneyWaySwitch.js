import React from 'react';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';

export default function MoneyWaySwitch({ handleInput, value, label }) {
  return (
    <FormControlLabel
      control={
        <Switch
          checked={value}
          onChange={handleInput}
          name="moneyWay"
          inputProps={{ 'aria-label': 'secondary checkbox' }}
          label="moneyWay"
        />
      }
      label={label}
    />
  );
}
