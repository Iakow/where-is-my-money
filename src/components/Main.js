/** @jsx createElement */
/** @jsxFrag createFragment */
import { createElement, createFragment } from '../framework/element';

import styles from '../style';

export default function Main({ balance, openForm }) {
  return (
    <div class={styles.main}>
      <span>BALANCE: {balance}</span>

      <button class={styles['btn-add']} onClick={openForm}>
        +
      </button>
    </div>
  );
}
