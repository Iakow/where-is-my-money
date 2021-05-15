import styles from '../style';
import renderApp from '../framework/render';
import { editTransaction, setBalance, getUserDB, addNewTransaction } from '../rest';

window.refreshUserData = refreshUserData;

export default function TransactionForm(transaction) {
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
        renderApp();
      })
      .then(() => setBalance(newBalance))
      .then(() => getUserDB())
      .then(data => refreshUserData(data));
  } else {
    addNewTransaction(newTransaction)
      .then(() => {
        hideForm();
        renderApp();
      })
      .then(() => setBalance(newBalance))
      .then(() => getUserDB())
      .then(data => refreshUserData(data));
  }
};

window.cancel = function (e) {
  e.preventDefault();
  hideForm();
  renderApp();
};

function refreshUserData(data) {
  window.userDataStore.balance = data.balance;
  window.userDataStore.transactions = data.transactions;
  window.userDataStore.categories = data.categories;
  renderApp();
}
