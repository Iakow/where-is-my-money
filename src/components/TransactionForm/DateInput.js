import React, { useState } from 'react';
import { getHTMLDate } from '../../utils';
import styles from '../../style';

export default function DateInput({ value, handler }) {
  const [date, setDate] = useState(value);

  const handleInput = ({ target }) => {
    setDate(new Date(target.value).getTime());
  };

  const upData = () => {
    handler('date', date);
  };

  return (
    <input
      className={styles['transaction-form_input']}
      name="date"
      type="datetime-local"
      placeholder="date"
      value={getHTMLDate(date)}
      onChange={handleInput}
      onBlur={upData}
    />
  );
}
