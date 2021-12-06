import React from 'react';
import TextField from '@material-ui/core/TextField';

export default function AmountInput({ value, handleInput, error }) {
  return (
    <TextField
      error={error}
      helperText={error && 'The amount must be greater than zero'}
      required
      inputProps={{ min: 1 }}
      /* autoFocus */
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
