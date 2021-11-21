import React from 'react';
import TextField from '@material-ui/core/TextField';

export default function CommentInput({ value, handleInput }) {
  return (
    <TextField
      id="date"
      label="Comment"
      fullWidth
      variant="outlined"
      name="comment"
      multiline
      maxRows={4}
      value={value}
      onChange={({ target }) => {
        handleInput(target.name, target.value);
      }}
      /* 
  InputLabelProps={{
    shrink: true,
  }} */
    />
  );
}
