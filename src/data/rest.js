import dataStore from '../data/dataStore';

export function connectFirebase(handleData) {
  const firebaseConfig = {
    apiKey: 'AIzaSyBwtSg-c3xYVJkNSDA49afwTxu6rA2JBDI',
    authDomain: 'kottans-app.firebaseapp.com',
    databaseURL: 'https://kottans-app-default-rtdb.firebaseio.com',
    projectId: 'kottans-app',
    storageBucket: 'kottans-app.appspot.com',
    messagingSenderId: '558738104058',
    appId: '1:558738104058:web:096c34066c87562a5df343',
    measurementId: 'G-MDSKRH794G',
  };

  firebase.initializeApp(firebaseConfig);
  signin('ponomarykov@gmail.com', '135790');

  firebase.auth().onAuthStateChanged(user => {
    if (user) {
      dataStore.auth.UID = user.uid;

      user
        .getIdToken()
        .then(token => (dataStore.auth.TOKEN = token))
        .then(() => getUserDB())
        .then(data => handleData(data))
        .catch(error => {
          throw error;
        });
    } else {
      /* acondsole.log('need login'); */
    }
  });
}

async function initializeUserDB(uid) {
  let userDB = {
    transactions: '',
    balance: '',
    categories: {
      outcome: ['Одежда', 'Транспорт', 'Услуги', 'Здоровье', 'Питание', 'Гигиена', 'Другое'],
      income: ['Зарплата', 'Фриланс', 'Подарок', 'Другое'],
    },
  };

  let response = await fetch(
    `https://kottans-app-default-rtdb.firebaseio.com/users/${uid}.json?auth=${TOKEN}`,
    {
      method: 'PUT',
      body: JSON.stringify(userDB),
    },
  );

  let result = await response.json();
}

function signout() {
  firebase.auth().signOut();
}

function signin(email = 'ponomarykov@gmail.com') {
  firebase
    .auth()
    .signInWithEmailAndPassword(email, '135790')
    .then(userCredential => {
      var user = userCredential.user;
    })
    .catch(error => {
      var errorCode = error.code;
      var errorMessage = error.message;
    });
}

export function register(mail) {
  firebase
    .auth()
    .createUserWithEmailAndPassword(mail, '135790')
    .then(userCredential => {
      var user = userCredential.user;
      dataStore.auth.UID = user.uid;

      return user;
    })
    .then(user => {
      return user.getIdToken();
    })
    .then(token => {
      dataStore.auth.TOKEN = token;
    })
    .then(() => {
      initializeUserDB(dataStore.auth.UID);
    })
    .catch(error => {
      var errorCode = error.code;
      var errorMessage = error.message;
    });
}

/* не нужна, т.к. нужен и баланс же */
export async function getTransactions() {
  let response = await fetch(
    `https://kottans-app-default-rtdb.firebaseio.com/users/${dataStore.auth.UID}/transactions.json?auth=${dataStore.auth.TOKEN}`,
  );

  let result = await response.json();
  dataStore.userData.transactions = result;
}

export async function addNewTransaction(transaction) {
  let response = await fetch(
    `https://kottans-app-default-rtdb.firebaseio.com/users/${dataStore.auth.UID}/transactions.json?auth=${dataStore.auth.TOKEN}`,
    {
      method: 'POST',
      body: JSON.stringify(transaction),
    },
  );

  let result = await response.json();

  getTransactions();
}

export async function setBalance(balance) {
  let response = await fetch(
    `https://kottans-app-default-rtdb.firebaseio.com/users/${dataStore.auth.UID}/balance.json?auth=${dataStore.auth.TOKEN}`,
    {
      method: 'PUT',
      body: JSON.stringify(balance),
    },
  );

  let result = await response.json();
}

export async function getBalance() {
  let response = await fetch(
    `https://kottans-app-default-rtdb.firebaseio.com/users/${dataStore.auth.UID}/balance.json?auth=${dataStore.auth.TOKEN}`,
  );

  let result = await response.json();

  dataStore.userData.balance = result;
}

export async function getCategories() {
  let response = await fetch(
    `https://kottans-app-default-rtdb.firebaseio.com/users/${dataStore.auth.UID}/categories.json?auth=${dataStore.auth.TOKEN}`,
  );

  let result = await response.json();

  dataStore.userData.categories = result;
}

export async function getUserDB() {
  let response = await fetch(
    `https://kottans-app-default-rtdb.firebaseio.com/users/${dataStore.auth.UID}.json?auth=${dataStore.auth.TOKEN}`,
  );

  let result = await response.json();

  return result;
}

export async function removeTransaction(id) {
  let response = await fetch(
    `https://kottans-app-default-rtdb.firebaseio.com/users/${dataStore.auth.UID}/transactions/${id}.json?auth=${dataStore.auth.TOKEN}`,
    {
      method: 'DELETE',
    },
  );

  let result = await response.json();
}

// надо бы PATH
export async function editTransaction(id, data) {
  let response = await fetch(
    `https://kottans-app-default-rtdb.firebaseio.com/users/${dataStore.auth.UID}/transactions/${id}.json?auth=${dataStore.auth.TOKEN}`,
    {
      method: 'PUT',
      body: JSON.stringify(data),
    },
  );

  let result = await response.json();
}

window.signout = signout;
