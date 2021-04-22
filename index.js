const categories = ['Одежда', 'Транспорт', 'Услуги', 'Здоровье', 'Питание', 'Гигиена', 'Другое'];

const transactions = [];

window.userDataStore = {
  categories: {
    outcome: ['', 'Одежда', 'Транспорт', 'Услуги', 'Здоровье', 'Питание', 'Гигиена', 'Другое'],
    income: ['Зарплата', 'Фриланс', 'Подарок', 'Другое'],
  },
  balance: 1234,
  transactions: {
    1619114621421: { sum: '500', date: '', category: 'Одежда', comment: '' },
  },
  moneyWay: 'income',
};

window.render = () => {
  document.querySelector('#app').innerHTML = `
    ${moneyWay()}
    ${form()}
    ${list()}
  `;
};

render();

function list() {
  let content = ``;
  const { transactions } = window.userDataStore;
  for (let x in transactions) {
    const { sum, date, category, comment } = transactions[x];
    content += `
      <li style="display:flex; justify-content: space-between">
        <span>${sum}</span>
        <span>${date}</span>
        <span>${category}</span>
        <span>${comment}</span>
      </li>`;
  }
  return `<ul>${content}</ul>`;
}
function form() {
  const handler = function (e) {
    e.preventDefault();

    const data = new FormData(e.target);

    const transaction = {};

    for (let [name, value] of data) {
      transaction[name] = value;
    }

    window.userDataStore.transactions[Date.now()] = transaction;
    // console.clear();
    // console.log(window.userDataStore.transactions);
    e.target.reset();
  };

  return `
    <form 
      onsubmit="((event) => {
        event.preventDefault();
    
        const data = new FormData(event.target);

        const transaction = {}
    
        for(let [name, value] of data) {
          transaction[name] = value
        }

        window.userDataStore.transactions[Date.now()] = transaction
       
        console.log(window.userDataStore.transactions);
        event.target.reset();
        window.render();
      })(event)"
    >
      ${sum() + date() + catInput() + comment()}
      <input type="submit" value="add"/>
    </form>
  `;
}

function moneyWay() {
  const handler = function (e) {
    userDataStore.moneyWay = e.target.value;
    render();
  };

  return `
    <label>
      <input 
        name="moneyWay" 
        value="income"
        type="radio"
        ${userDataStore.moneyWay == 'income' ? 'checked' : ''}
        onchange="(${handler})(event)"
      />
      income
    </label>
    <label>
      <input 
        name="moneyWay" 
        value="outcome" 
        type="radio"
        ${userDataStore.moneyWay == 'income' ? '' : 'checked'}
        onchange="(${handler})(event)"
      />
      outcome
    </label>
    <br>

  `;
}

function catInput() {
  return `
    <select name="category">
      ${window.userDataStore.categories[window.userDataStore.moneyWay].map(
        (category, i) => `<option>&#128512; ${category}</option>`,
      )}
    </select>
  `;
}

function sum() {
  return `
    <input type="number" placeholder="sum" name="sum" required/>
  `;
}

function date() {
  return `
    <input
      name="date"
      type="datetime-local" 
      placeholder="date"
      value=${formatDate(Date.now())}
    />
  `;
}

function comment() {
  return `
    <input 
      type="text" 
      placeholder="comment"
      name="comment"
    />
  `;
}

function formatDate(timestamp) {
  const d = new Date(timestamp);

  const DD = d.getDate() > 9 ? d.getDate() : `0${d.getDate()}`;
  const MM = d.getMonth() + 1 > 9 ? d.getMonth() + 1 : `0${d.getMonth() + 1}`;
  const YYYY = d.getFullYear();

  const HH = d.getHours() > 9 ? d.getHours() : `0${d.getHours()}`;
  const MI = d.getMinutes() > 9 ? d.getMinutes() : `0${d.getMinutes()}`;

  return `${YYYY}-${MM}-${DD}T${HH}:${MI}`;
}
