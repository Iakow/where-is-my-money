import { connectFirebase } from './data/rest.js';
import renderApp from './framework/render';
import dataStore from './data/dataStore';

document.querySelector('#app').innerHTML = `Loading...`;
connectFirebase(refreshUserData);

function refreshUserData(data) {
  dataStore.userData.balance = data.balance;
  dataStore.userData.transactions = data.transactions;
  dataStore.userData.categories = data.categories;
  renderApp();
}
