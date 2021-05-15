/** @jsx createElement */
/** @jsxFrag createFragment */
import { createElement, createFragment } from '../framework/element';

import styles from '../style';
import renderApp from '../framework/render';
import dataStore from '../data/dataStore';

export default function Main(props) {
  return (
    <>
      <div class={styles.main}>
        <span>BALANCE: {props.balance}</span>

        <button class={styles['btn-add']} onClick={openTransactionForm}>
          +
        </button>
      </div>
    </>
  );
}

function openTransactionForm() {
  dataStore.transactionForm.data = {
    sum: '',
    date: Date.now(),
    category: 1,
    comment: '',
  };
  dataStore.transactionForm.isOpened = true;

  renderApp();
  document.forms[0].sum.focus();
}
