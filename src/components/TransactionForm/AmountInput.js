import React from 'react';
import TextField from '@material-ui/core/TextField';

export default function AmountInput({ value, handleInput }) {
  return (
    <TextField
      autoFocus
      type="number"
      name="sum"
      margin="normal"
      label="Amount"
      value={value === 0 ? '' : Math.abs(value)}
      onChange={({ target }) => {
        handleInput(target.name, target.value);
      }}
      /* InputProps={{ name: 'first' }}
       */
      fullWidth
      variant="outlined"
    />
  );
}
