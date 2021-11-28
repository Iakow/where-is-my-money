import React from 'react';
import {
  // вот этой всей фигни быть не должно по идее
  initializeUserDB,
  email, // а вот это вообще должно быть в userData
} from '../data/firebase';

import styles from '../style.css'; // вот это уйдет тоже

export function SetBalanceForm(params) {
  return (
    <form
      className={styles.initialForm}
      onSubmit={e => {
        e.preventDefault();

        initializeUserDB(+e.target.sum.value);
      }}
    >
      <p className={styles['initialForm_auth-message']}>Wellcome {email}!</p>
      <p className={styles['initialForm_input-message']}>Now, set your current balance please</p>
      <input
        className={styles['initialForm_input']}
        type="number"
        placeholder="sum"
        autoFocus
        name="sum"
        min="1"
        required
      />
      <input className={styles['initialForm_submit']} type="submit" value="Send" />
    </form>
  );
}
