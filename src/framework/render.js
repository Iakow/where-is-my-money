import styles from '../style.css';
import Main from '../components/Main';
import List from '../components/List';
import TransactionForm from '../components/TransactionForm';

export default function renderApp() {
  const { balance, transactions, form } = userDataStore;

  document.querySelector('#app').innerHTML = `
    <div class=${styles['app-container']}>
      ${Main(balance)}
      ${List(transactions)}
      ${form.isOpened ? TransactionForm(form.data) : ''}
    </div>
  `;
}
