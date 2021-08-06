import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.apiKey,
  authDomain: process.env.authDomain,
  // databaseURL: process.env.databaseURL,
  projectId: process.env.projectId,
  // storageBucket: process.env.storageBucket,
  // messagingSenderId: process.env.messagingSenderId,
  // appId: process.env.appId,
  // measurementId: process.env.measurementId,
};

let db;
let userDBRef;

export function connectFirebase(userDataCb, authCb) {
  firebase.initializeApp(firebaseConfig);
  db = firebase.firestore();

  firebase.auth().onAuthStateChanged(user => {
    if (user) {
      userDBRef = db.collection('users').doc(user.uid);
      // console.log('user:', user.email);

      getUserDB()
        .then(userDataCb)
        .catch(error => {
          alert(error);
        });
    } else {
      authCb();
    }
  });
}

export function register(mail, password) {
  firebase
    .auth()
    .createUserWithEmailAndPassword(mail, password)
    .then(userCredential => {
      UID = userCredential.user.uid;
    })
    .catch(error => {
      alert(error.message);
    });
}

export function getUserDB() {
  function initializeUserDB() {
    // незачем создавать transactions заранее
    const initialUserData = {
      balance: 0,
      categories: 'categories',
      tags: 'tags',
    };

    return userDBRef
      .set({ ...initialUserData })
      .then(() => initialUserData)
      .catch(error => {
        console.error('Error adding document: ', error);
      });
  }

  const getTransactions = () => {
    return userDBRef
      .collection('transactions')
      .get()
      .then(querySnapshot => {
        const transactionsObj = {};

        querySnapshot.forEach(doc => {
          transactionsObj[doc.id] = doc.data();
        });
        console.log(transactionsObj);
        return transactionsObj;
      });
  };

  const getAllDB = () => {
    return userDBRef
      .get()
      .then(doc => {
        if (doc.exists) {
          console.log({ ...doc.data() });
          return { ...doc.data() };
        } else {
          return initializeUserDB();
        }
      })
      .catch(error => {
        alert('Error getting document:', error);
      });
  };

  return Promise.all([getAllDB(), getTransactions()]).then(results => {
    console.log({ ...results[0], ...{ transactions: results[1] } });
    return { ...results[0], ...{ transactions: results[1] } };
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
  ).then(response => response.json());
}

export function removeTransaction(id) {
  return fetch(
    `https://kottans-app-default-rtdb.firebaseio.com/users/${UID}/transactions/${id}.json?auth=${TOKEN}`,
    {
      method: 'DELETE',
    },
  ).then(response => response.json());
}
