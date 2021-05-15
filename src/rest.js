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

  firebase.auth().onAuthStateChanged(user => {
    if (user) {
      window.UID = user.uid;

      user
        .getIdToken()
        .then(token => (window.TOKEN = token))
        .then(() => getUserDB())
        .then(data => handleData(data))
        .catch(/* error => fconsole.log(error.message) */);
    } else {
      //jconsole.log('need login');
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

function signin(email) {
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
      window.UID = user.uid;

      return user;
    })
    .then(user => {
      return user.getIdToken();
    })
    .then(token => {
      window.TOKEN = token;
    })
    .then(() => {
      initializeUserDB(UID);
    })
    .catch(error => {
      var errorCode = error.code;
      var errorMessage = error.message;
    });
}

/* не нужна, т.к. нужен и баланс же */
export async function getTransactions() {
  let response = await fetch(
    `https://kottans-app-default-rtdb.firebaseio.com/users/${window.UID}/transactions.json?auth=${window.TOKEN}`,
  );

  let result = await response.json();
  window.userDataStore.transactions = result;
}

export async function addNewTransaction(transaction) {
  let response = await fetch(
    `https://kottans-app-default-rtdb.firebaseio.com/users/${window.UID}/transactions.json?auth=${window.TOKEN}`,
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
    `https://kottans-app-default-rtdb.firebaseio.com/users/${window.UID}/balance.json?auth=${window.TOKEN}`,
    {
      method: 'PUT',
      body: JSON.stringify(balance),
    },
  );

  let result = await response.json();
}

export async function getBalance() {
  let response = await fetch(
    `https://kottans-app-default-rtdb.firebaseio.com/users/${window.UID}/balance.json?auth=${window.TOKEN}`,
  );

  let result = await response.json();

  window.userDataStore.balance = result;
}

export async function getCategories() {
  let response = await fetch(
    `https://kottans-app-default-rtdb.firebaseio.com/users/${window.UID}/categories.json?auth=${window.TOKEN}`,
  );

  let result = await response.json();

  window.userDataStore.categories = result;
}

export async function getUserDB() {
  let response = await fetch(
    `https://kottans-app-default-rtdb.firebaseio.com/users/${window.UID}.json?auth=${window.TOKEN}`,
  );

  let result = await response.json();

  return result;
}

export async function removeTransaction(id) {
  let response = await fetch(
    `https://kottans-app-default-rtdb.firebaseio.com/users/${UID}/transactions/${id}.json?auth=${window.TOKEN}`,
    {
      method: 'DELETE',
    },
  );

  let result = await response.json();
}

// надо бы PATH
export async function editTransaction(id, data) {
  let response = await fetch(
    `https://kottans-app-default-rtdb.firebaseio.com/users/${window.UID}/transactions/${id}.json?auth=${window.TOKEN}`,
    {
      method: 'PUT',
      body: JSON.stringify(data),
    },
  );

  let result = await response.json();
}
