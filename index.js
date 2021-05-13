import { formatDate, getDateString } from './utils';
import styles from './style.css';
import {
  connectFirebase,
  register,
  removeTransaction,
  setBalance,
  getUserDB,
  getTransactions,
  addNewTransaction,
  getBalance,
  getCategories,
  editTransaction,
} from './rest.js';

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

connectFirebase();

document.querySelector('#app').innerHTML = `Loading...`;

window.renderApp = () => {
  const { balance, transactions, form } = userDataStore;

  document.querySelector('#app').innerHTML = `
    <div class=${styles['app-container']}>
      ${Main(balance)}
      ${form.isOpened ? TransactionForm(form.data) : ''}
      ${List(transactions)}
    </div>
  `;
};

function Main(balance) {
  return `
    <div class="${styles.main}">
      <span>BALANCE: ${balance}</span>

      <button
        class=${styles['btn-add']}
        onclick="loadEmptyForm()"
      >
        +
      </button>
    </div>
  `;
}

function List(transactions) {
  let items = ``;

  for (let id in transactions) {
    const { sum, date, category, comment } = transactions[id];
    const categoryGroup = sum < 0 ? 'outcome' : 'income';

    items += `
      <li id="${id}" class=${styles['list-item']}>
        <span style="width:30%">${getDateString(date)}</span>
        <span style="width:15%">${sum}</span>
        <span>${userDataStore.categories[categoryGroup][category]}</span>
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

function TransactionForm(transaction) {
  const moneyWay = +transaction.sum > 0 ? 'income' : 'outcome';
  const { comment, category } = transaction;
  const sum = transaction.sum ? Math.abs(transaction.sum) : '';
  const date = formatDate(transaction.date);

  return `
    <form class=${styles.form} onsubmit="addTransactionInDB(event)">
      ${Sum(sum)}
      ${DateInput(date)}
      ${Comment(comment)}
      ${Category(category)}

      <button type="button" class="cancel" onclick="cancel(event)">
        cancel
      </button>

      <input class="add" type="submit" value="add" />
    </form>
  `;

  function Sum(value) {
    return `
      <input
        type="number"
        placeholder="sum"
        name="sum"
        min="1"
        value ="${value}"
        required
      >
    `;
  }

  function Category(chosenCategoryID) {
    const handler = e => {
      document.querySelector('#categories').innerHTML = userDataStore.categories[e.target.value]
        .map((category, i) => `<option value=${i}>${category}</option>`)
        .join('');
    };

    return `
      <div onchange="(${handler})(event)">
        <label>
          <input
            type="radio"
            name="moneyWay"
            value="income"
            ${moneyWay == 'income' ? 'checked' : ''}
          />
          income
        </label>

        <label>
          <input 
            type="radio"
            name="moneyWay" 
            value="outcome" 
            ${moneyWay == 'outcome' ? 'checked' : ''}
          />
          outcome
        </label>
      </div>

      <br>

      <select name="category" id="categories">
        ${userDataStore.categories[moneyWay]
          .map(
            (category, i) => `
              <option ${chosenCategoryID == i ? 'selected' : ''} value=${i}> 
                ${category}
              </option>
            `,
          )
          .join('')}
      </select>
    `;
  }

  function DateInput(dateValue) {
    return `
      <input
        name="date"
        type="datetime-local" 
        placeholder="date"
        value=${dateValue}
      />
    `;
  }

  function Comment(content) {
    return `
      <input 
        type="text"
        placeholder="comment"
        name="comment"
        value="${content}"
      />
    `;
  }
}

//////////////////////////////////////////////////////

function storeUserData(data) {
  window.userDataStore.balance = data.balance;
  window.userDataStore.transactions = data.transactions;
  window.userDataStore.categories = data.categories;
}

////////////////////////////////////////
window.cancel = function (e) {
  e.preventDefault();
  hideForm();
  renderApp();
};

window.loadEmptyForm = function () {
  userDataStore.form.data = {
    sum: '',
    date: Date.now(),
    category: 1,
    comment: '',
  };

  showForm();
  renderApp();
  document.forms[0].sum.focus();
};

window.loadTransactionInForm = function (e) {
  const transactionID = e.target.parentElement.id;
  userDataStore.form.transactionId = transactionID;

  userDataStore.form.data = { ...userDataStore.transactions[transactionID] };

  showForm();
  renderApp();
  document.forms[0].sum.focus();
};

////////////////////////////////////////////////////

window.deleteTransaction = function (e) {
  const id = e.target.parentElement.id;
  const newBalance = userDataStore.balance - userDataStore.transactions[id].sum;

  removeTransaction(id)
    .then(() => setBalance(newBalance))
    .then(() => getUserDB())
    .then(result => storeUserData(result))
    .then(() => renderApp());
};

window.addTransactionInDB = function (e) {
  e.preventDefault();

  const { sum, date, category, comment, moneyWay } = e.target.elements;

  const newTransaction = {
    sum: moneyWay.value == 'income' ? +sum.value : -sum.value,
    date: new Date(date.value).getTime(),
    category: +category.value,
    comment: comment.value,
  };

  const initialFormSum = +userDataStore.form.data.sum;
  const newBalance = userDataStore.balance + newTransaction.sum - initialFormSum;

  // вот здесь чет не очт
  if (userDataStore.form.transactionId) {
    editTransaction(userDataStore.form.transactionId, newTransaction)
      .then(() => {
        hideForm();
        window.renderApp();
      })
      .then(() => setBalance(newBalance))
      .then(() => getUserDB())
      .then(result => storeUserData(result))
      .then(() => window.renderApp());
  } else {
    addNewTransaction(newTransaction)
      .then(() => {
        hideForm();
        window.renderApp();
      })
      .then(() => setBalance(newBalance))
      .then(() => getUserDB())
      .then(result => storeUserData(result))
      .then(() => window.renderApp());
  }
};

window.showForm = function () {
  userDataStore.form.isOpened = true;
};

window.hideForm = function () {
  userDataStore.form.isOpened = false;
};

window.formatDate = formatDate;
