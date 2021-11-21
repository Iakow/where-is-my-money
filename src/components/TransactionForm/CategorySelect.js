import React from 'react';
import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';

export default function CategorySelect({ value, handleInput, categories, error }) {
  return (
    <TextField
      select
      required
      error={error}
      fullWidth
      label="Category"
      helperText={error && 'you must select a category'}
      variant="outlined"
      id="demo-simple-select-helper"
      name="category"
      value={value}
      onChange={({ target }) => {
        handleInput(target.name, target.value);
      }}
    >
      {categories.map((cat, i) => (
        <MenuItem value={i} key={cat}>
          {cat}
        </MenuItem>
      ))}
    </TextField>
  );
}
