import React from 'react';
import { getHTMLDate } from '../../utils';
import TextField from '@material-ui/core/TextField';

export default function DateInput({ value, handleInput }) {
  return (
    <TextField
      id="date"
      label="Date"
      name="date"
      type="datetime-local"
      value={getHTMLDate(value)}
      onChange={({ target }) => {
        handleInput(target.name, new Date(target.value).getTime());
      }}
      fullWidth
      variant="outlined"
    />
  );
}
