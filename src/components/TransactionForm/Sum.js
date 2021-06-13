import React from 'react';
import styles from '../../style';

export default function Sum({ value, returnData }) {
  const upData = ({ target }) => {
    returnData('sum', +target.value);
  };

  return (
    <input
      className={styles['transaction-form_input']}
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
