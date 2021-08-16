import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.apiKey,
  authDomain: process.env.authDomain,
  projectId: process.env.projectId,
};

let userDBRef;
export let email;

export function connectFirebase(userDataCb, authCb) {
  firebase.initializeApp(firebaseConfig);

  firebase
    .firestore()
    .enablePersistence()
    .catch(err => {
      console.error(err);
    });

  firebase.auth().onAuthStateChanged(user => {
    const addDataListeners = () => {
      userDBRef.onSnapshot(userData => {
        if (userData.data()) {
          userDataCb({ ...userData.data() });
        } else {
          userDataCb(null);
        }
      });

      userDBRef.collection('transactions').onSnapshot(transactionsSnapshot => {
        const transactions = {};
        let balance = null;

        transactionsSnapshot.forEach(transaction => {
          if (transaction.id !== 'balance') {
            transactions[transaction.id] = transaction.data();
          } else {
            balance = transaction.data().value;
          }
        });

        if (balance !== null) {
          userDataCb({ balance, transactions });
        } else {
          userDataCb(null);
        }
      });
    };

    if (user) {
      email = user.email;
      userDBRef = firebase.firestore().collection('users').doc(user.uid);

      addDataListeners();
    } else {
      authCb();
    }
  });
}

export function register(email, password) {
  return firebase.auth().createUserWithEmailAndPassword(email, password);
}

export function initializeUserDB(balance) {
  const settings = {
    categories: {
      outcome: ['Одежда', 'Транспорт', 'Услуги', 'Здоровье', 'Питание', 'Гигиена', 'Другое'],
      income: ['Зарплата', 'Фриланс', 'Подарок', 'Другое'],
    },
    tags: {
      income: [],
      outcome: [],
    },
  };

  function setBalance(balance) {
    return userDBRef
      .collection('transactions')
      .doc('balance')
      .set({ value: balance })
      .catch(error => console.error('Error updating document: ', error));
  }

  Promise.all([userDBRef.set({ ...settings }), setBalance(balance)]).catch(error =>
    console.error(error),
  );
}

export function signout() {
  firebase.auth().signOut();
}

export function signin(email, password) {
  return firebase.auth().signInWithEmailAndPassword(email, password);
}

export function addNewTransaction(transaction) {
  const batch = firebase.firestore().batch();

  const newTransactionRef = userDBRef.collection('transactions').doc();
  const balanceRef = userDBRef.collection('transactions').doc('balance');

  batch.set(newTransactionRef, { ...transaction });
  batch.update(balanceRef, {
    value: firebase.firestore.FieldValue.increment(transaction.sum),
  });

  return batch.commit().catch(error => {
    console.error('Error adding document: ', error);
  });
}

export function editTransaction(id, newData) {
  const batch = firebase.firestore().batch();

  const currentTransactionRef = userDBRef.collection('transactions').doc(id);
  const balanceRef = userDBRef.collection('transactions').doc('balance');

  return currentTransactionRef
    .get({ source: 'cache' })
    .then(currentData => {
      batch.update(currentTransactionRef, { ...newData });
      batch.update(balanceRef, {
        value: firebase.firestore.FieldValue.increment(newData.sum - currentData.data().sum),
      });

      return batch.commit();
    })
    .catch(error => {
      console.error('Error writing document: ', error);
    });
}

export function removeTransaction(id) {
  const batch = firebase.firestore().batch();

  const currentTransactionRef = userDBRef.collection('transactions').doc(id);
  const balanceRef = userDBRef.collection('transactions').doc('balance');

  return currentTransactionRef
    .get({ source: 'cache' })
    .then(currentTransaction => {
      batch.delete(currentTransactionRef);
      batch.update(balanceRef, {
        value: firebase.firestore.FieldValue.increment(-currentTransaction.data().sum),
      });

      return batch.commit();
    })
    .catch(error => {
      console.error('Error removing document: ', error);
    });
}
