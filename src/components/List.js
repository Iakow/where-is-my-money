import styles from '../style';
import renderApp from '../framework/render';
import { getDateString } from '../utils';
import { removeTransaction, setBalance, getUserDB } from '../rest';

window.loadTransactionInForm = loadTransactionInForm;
window.deleteTransaction = deleteTransaction;

export default function List(transactions) {
  let items = ``;

  for (let id in transactions) {
    const { sum, date, category, comment } = transactions[id];
    const categoryGroup = sum < 0 ? 'outcome' : 'income';

    items += `
      <li id="${id}" class=${styles['list-item']}>
        <span style="width:30%">${getDateString(date)}</span>
        <span style="width:15%">${sum}</span>
        <span>${window.userDataStore.categories[categoryGroup][category]}</span>
        <span style="width:25%">${comment}</span>

        <button
          class=${styles['btn-edit']}
          onclick="loadTransactionInForm(event)"
        >
          🖉
        </button>

        <button
          class=${styles['btn-delete']}
          onclick="deleteTransaction(event)"
        >
          X
        </button>
      </li>
    `;
  }

  return `<ul class=${styles.list}>${items}</ul>`;
}

function loadTransactionInForm(e) {
  const transactionID = e.target.parentElement.id;
  userDataStore.form.transactionId = transactionID;

  userDataStore.form.data = { ...userDataStore.transactions[transactionID] };

  userDataStore.form.isOpened = true;
  renderApp();
  document.forms[0].sum.focus();
}

function deleteTransaction(e) {
  const id = e.target.parentElement.id;
  const newBalance = window.userDataStore.balance - window.userDataStore.transactions[id].sum;

  removeTransaction(id)
    .then(() => setBalance(newBalance))
    .then(() => getUserDB())
    .then(data => {
      window.userDataStore.balance = data.balance;
      window.userDataStore.transactions = data.transactions;
      window.userDataStore.categories = data.categories;

      renderApp();
    });
}
