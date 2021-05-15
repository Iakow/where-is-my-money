/** @jsx createElement */
/** @jsxFrag createFragment */
import { createElement, createFragment } from '../framework/element';

import styles from '../style';
import renderApp from '../framework/render';

window.openTransactionForm = openTransactionForm;

export default function Main(balance) {
  /* return `
    <div class="${styles.main}">
      <span>BALANCE: ${balance}</span>

      <button
        class=${styles['btn-add']}
        onclick="openTransactionForm()"
      >
        +
      </button>
    </div>
  `; */

  return (
    <>
      <div className={styles.main}>
        <span>BALANCE: {balance}</span>

        <button className={styles['btn-add']} onclick={openTransactionForm}>
          +
        </button>
      </div>
    </>
  );
}

function openTransactionForm() {
  window.userDataStore.form.data = {
    sum: '',
    date: Date.now(),
    category: 1,
    comment: '',
  };
  window.userDataStore.form.isOpened = true;

  renderApp();
  document.forms[0].sum.focus();
}
