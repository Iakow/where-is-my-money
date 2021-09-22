import React from 'react';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
  formControl: {
    // margin: theme.spacing(1),
    minWidth: '100%',
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
}));

export default function CategorySelect({ value, handleInput, categories }) {
  const classes = useStyles();

  return (
    <FormControl className={classes.formControl}>
      <InputLabel id="demo-simple-select-label">Category</InputLabel>
      <Select
        value={0}
        fullWidth
        variant="outlined"
        labelId="demo-simple-select-label"
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
      </Select>
    </FormControl>
  );
}
