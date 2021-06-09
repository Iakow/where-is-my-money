import React from 'react';
import { useEffect, useState } from 'react';

import styles from '../style';

export default function Main({ balance, openForm }) {
  return (
    <div className={styles.main}>
      <span>BALANCE: {balance}</span>

      <button className={styles['btn-add']} onClick={openForm}>
        +
      </button>
    </div>
  );
}
