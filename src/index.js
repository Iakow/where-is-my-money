import { formatDate } from './utils';
import styles from './style.css';
import Main from './components/Main';
import List from './components/List';
import TransactionForm from './components/TransactionForm';
import { connectFirebase } from './rest.js';

window.userDataStore = {
  categories: null,
  balance: null,
  transactions: null,
  form: {
    isOpened: false,
    transactionId: null,
    data: null,
  },
};

connectFirebase(refreshUserData);

document.querySelector('#app').innerHTML = `Loading...`;

/* window.renderApp = () => {
  const { balance, transactions, form } = userDataStore;

  document.querySelector('#app').innerHTML = `
    <div class=${styles['app-container']}>
      ${Main(balance)}
      ${List(transactions)}
      ${form.isOpened ? TransactionForm(form.data) : ''}
    </div>
  `;
}; */

window.showForm = function () {
  userDataStore.form.isOpened = true;
};

window.hideForm = function () {
  userDataStore.form.isOpened = false;
};

window.formatDate = formatDate;
