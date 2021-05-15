/** @jsx createElement */
/*** @jsxFrag createFragment */
import { createElement, createFragment } from '../framework/element';

import styles from '../style.css';
import Main from '../components/Main';
import List from '../components/List';
import TransactionForm from '../components/TransactionForm';
import dataStore from '../data/dataStore';

/* у меня весь UI строится на основе данных и ререндерится все глобально
   может стоить данные загружать в Арр?
   данные с севера - это ясно.
   плюс транзакция, кот. открывается в форме
   короче все, что нужно именно для компонентов.

   Стоит ли отделять как-то стейт формы? А какой стейт, она же стейтлесс?
*/

export default function App(params) {
  const { balance, transactions } = dataStore.userData;
  const transaction = dataStore.transactionForm.data;

  return (
    <div class={styles['app-container']}>
      <Main balance={balance} />
      <List transactions={transactions} />
      {dataStore.transactionForm.isOpened ? <TransactionForm transaction={transaction} /> : null}
    </div>
  );
}
