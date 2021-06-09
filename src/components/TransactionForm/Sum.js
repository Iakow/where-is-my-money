import React, { useState } from 'react';

export default function Sum({ value, returnData }) {
  const upData = ({ target }) => {
    returnData('sum', +target.value);
  };

  return (
    <input
      type="number"
      placeholder="sum"
      autoFocus
      name="sum"
      min="1"
      defaultValue={value === 0 ? '' : value}
      required
      onChange={upData}
    />
  );
}
