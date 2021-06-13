import React from 'react';
import styles from '../../style';

export default function Category({ value, categories, handler }) {
  const upData = e => {
    handler('category', +e.target.value);
  };

  return (
    <select
      className={styles['transaction-form_input']}
      id="categories"
      defaultValue={value}
      onChange={upData}
    >
      {categories.map((category, i) => (
        <option key={i} value={i}>
          {category}
        </option>
      ))}
    </select>
  );
}
