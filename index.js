import { formatDate, getDateString } from './utils';
import styles from './style.css';
import { func } from 'prop-types';

window.userDataStore = {
  categories: {
    outcome: ['Одежда', 'Транспорт', 'Услуги', 'Здоровье', 'Питание', 'Гигиена', 'Другое'],
    income: ['Зарплата', 'Фриланс', 'Подарок', 'Другое'],
  },
  balance: 0,
  transactions: {
    1619114621421: {
      sum: 500,
      moneyWay: '',
      date: 1619114621421,
      category: 1,
      comment: 'Какая-то фигня',
    },
    1619208263117: {
      sum: 10000,
      date: 1619208263117,
      category: 0,
      comment: '',
    },
    1619208282263: {
      sum: -1000,
      date: 1619208282263,
      category: 0,
      comment: 'Педали',
    },
    1619208293067: {
      sum: -245,
      date: 1619208293067,
      category: 4,
      comment: '',
    },
    1619208307065: {
      sum: -50,
      date: 1619208307065,
      category: 4,
      comment: '',
    },
  },
  form: {
    isOpened: false,
    transactionId: null,
    cachedBalance: 0,
    data: null,
  },
};

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

renderApp();

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

window.cancel = function (e) {
  e.preventDefault();
  hideForm();
  renderApp();
};

window.loadEmptyForm = function () {
  userDataStore.form.transactionId = Date.now();

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

  userDataStore.form.cachedBalance =
    userDataStore.balance - +userDataStore.transactions[transactionID].sum;

  showForm();
  renderApp();
  document.forms[0].sum.focus();
};

window.deleteTransaction = function (e) {
  userDataStore.balance -= userDataStore.transactions[e.target.parentElement.id].sum;
  delete userDataStore.transactions[e.target.parentElement.id];
  renderApp();
};

window.addTransactionInDB = function (e) {
  //вот здесь обратная конвертация
  e.preventDefault();

  const id = userDataStore.form.transactionId;
  const { sum, date, category, comment, moneyWay } = e.target.elements;

  userDataStore.transactions[id] = {
    sum: moneyWay.value == 'income' ? +sum.value : -sum.value,
    date: new Date(date.value).getTime(),
    category: +category.value,
    comment: comment.value,
  };

  userDataStore.balance += userDataStore.transactions[id].sum - userDataStore.form.data.sum;

  hideForm();
  window.renderApp();
};

window.showForm = function () {
  userDataStore.form.isOpened = true;
};

window.hideForm = function () {
  userDataStore.form.isOpened = false;
};

window.formatDate = formatDate;
