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

export function addNewTransaction(transaction) {
  return fetch(
    `https://kottans-app-default-rtdb.firebaseio.com/users/${dataStore.auth.UID}/transactions.json?auth=${dataStore.auth.TOKEN}`,
    {
      method: 'POST',
      body: JSON.stringify(transaction),
    },
  ).then(response => {
    return response.json();
  });
}

// надо бы PATH
export function editTransaction(id, data) {
  return fetch(
    `https://kottans-app-default-rtdb.firebaseio.com/users/${dataStore.auth.UID}/transactions/${id}.json?auth=${dataStore.auth.TOKEN}`,
    {
      method: 'PUT',
      body: JSON.stringify(data),
    },
  ).then(response => {
    return response.json();
  });
}

export function setBalance(balance) {
  return fetch(
    `https://kottans-app-default-rtdb.firebaseio.com/users/${dataStore.auth.UID}/balance.json?auth=${dataStore.auth.TOKEN}`,
    {
      method: 'PUT',
      body: JSON.stringify(balance),
    },
  ).then(response => response.json());
}

window.setBalance = setBalance;

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

export function getUserDB() {
  return fetch(
    `https://kottans-app-default-rtdb.firebaseio.com/users/${dataStore.auth.UID}.json?auth=${dataStore.auth.TOKEN}`,
  )
    .then(response => {
      return response.json();
    })
    .then(data => {
      return data;
    })
    .catch(error => console.warn(error));
}

export function removeTransaction(id) {
  return fetch(
    `https://kottans-app-default-rtdb.firebaseio.com/users/${dataStore.auth.UID}/transactions/${id}.json?auth=${dataStore.auth.TOKEN}`,
    {
      method: 'DELETE',
    },
  ).then(response => {
    response.json();
  });
}

window.signout = signout;
