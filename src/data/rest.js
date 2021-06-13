let UID;
let TOKEN;

export function connectFirebase(userDataCb, authCb) {
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
      UID = user.uid;

      user
        .getIdToken()
        .then(token => (TOKEN = token))
        .then(() => getUserDB())
        .then(data => {
          if (data === null) {
            return initializeUserDB();
          } else {
            return data;
          }
        })
        .then(data => userDataCb(data))
        .catch(error => {
          throw error;
        });
    } else {
      authCb();
    }
  });
}

function initializeUserDB() {
  let userDB = {
    transactions: 0,
    balance: 0,
    categories: {
      outcome: ['Одежда', 'Транспорт', 'Услуги', 'Здоровье', 'Питание', 'Гигиена', 'Другое'],
      income: ['Зарплата', 'Фриланс', 'Подарок', 'Другое'],
    },
  };

  return new Promise((resolve, reject) => {
    fetch(`https://kottans-app-default-rtdb.firebaseio.com/users/${UID}.json?auth=${TOKEN}`, {
      method: 'PUT',
      body: JSON.stringify(userDB),
    })
      .then(response => {
        return response.json();
      })
      .then(data => {
        resolve(data);
      })
      .catch(error => {
        reject(error);
      });
  });
}

export function signout() {
  firebase.auth().signOut();
}

export function signin(email, password, successСb, failureCb) {
  firebase
    .auth()
    .signInWithEmailAndPassword(email, password)
    .then(userCredential => {
      let user = userCredential.user;
      return user;
    })
    .then(user => {
      if (successСb) successСb();
    })
    .catch(error => {
      if (failureCb) failureCb(error);
    });
}

export function register(mail, password, failureCb) {
  firebase
    .auth()
    .createUserWithEmailAndPassword(mail, password)
    .then(userCredential => {
      var user = userCredential.user;
      return user;
    })
    .catch(error => {
      failureCb(error);
    });
}

export function addNewTransaction(transaction) {
  return fetch(
    `https://kottans-app-default-rtdb.firebaseio.com/users/${UID}/transactions.json?auth=${TOKEN}`,
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
    `https://kottans-app-default-rtdb.firebaseio.com/users/${UID}/transactions/${id}.json?auth=${TOKEN}`,
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
    `https://kottans-app-default-rtdb.firebaseio.com/users/${UID}/balance.json?auth=${TOKEN}`,
    {
      method: 'PUT',
      body: JSON.stringify(balance),
    },
  )
    .then(response => response.json())
    .then(() => getUserDB());
}

export function getUserDB() {
  return new Promise((resolve, reject) => {
    fetch(`https://kottans-app-default-rtdb.firebaseio.com/users/${UID}.json?auth=${TOKEN}`)
      .then(response => {
        return response.json();
      })
      .then(data => {
        resolve(data);
      })
      .catch(error => {
        reject(error);
      });
  });
}

export function removeTransaction(id) {
  return fetch(
    `https://kottans-app-default-rtdb.firebaseio.com/users/${UID}/transactions/${id}.json?auth=${TOKEN}`,
    {
      method: 'DELETE',
    },
  ).then(response => {
    response.json();
  });
}
