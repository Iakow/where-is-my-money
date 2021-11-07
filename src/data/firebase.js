import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import { useState, useEffect } from 'react';

const firebaseConfig = {
  apiKey: process.env.apiKey,
  authDomain: process.env.authDomain,
  projectId: process.env.projectId,
};

let userDBRef;
export let email;

export function useFirebase() {
  // BUG App грузится вместо лоадера, когда еще нельзя получить баланс, в шапке undefined
  //TODO userData не должен обновляться, пока не будут готовы все нужные данные.
  const [isResponseWaiting, setIsResponceWaiting] = useState(true); // должно быть здесь?
  const [userData, setUserData] = useState(null);
  const [isAuth, setIsAuth] = useState(false);

  useEffect(() => {
    console.log('FB-useEffect');
    // а надо?
    const dataCb = data => {
      if (data) {
        console.log('%c   setUserData()', 'background: #222; color: #bada55');
        setUserData(userData => ({ ...userData, ...data }));
        console.log('%c   setIsAuth()', 'background: #222; color: #bada55');
        setIsAuth(true);
        console.log('%c   setIsResponceWaiting()', 'background: #222; color: #bada55');
        if (data.transactions) setIsResponceWaiting(false);
      }
    };

    const authCb = () => {
      setUserData(null); // ???
      setIsResponceWaiting(false);
      setIsAuth(false);
    };

    connectFirebase(dataCb, authCb); // вот что оно делает по сути
  }, []);

  return { isResponseWaiting, userData, isAuth };
}

function connectFirebase(userDataHandler, authCb) {
  if (firebase.apps.length === 0) {
    firebase.initializeApp(firebaseConfig);

    firebase
      .firestore()
      .enablePersistence()
      .catch(err => {
        console.error(err);
      });
  }

  //TODO: нельзя навешивать листнеры на данные, не убедившись, что контракт соблюден.
  // сперва запросить БД, проверить, если не ок - задать баланс и остальные поля.
  firebase.auth().onAuthStateChanged(user => {
    const addDataListeners = () => {
      console.log('       ADDING LISTENERS');

      userDBRef.onSnapshot(userData => {
        // для категорий и т.д.
        if (userData.data()) {
          console.log(
            '%conUserDoc',
            'background: #222; color: #bada55; text-decoration: underline;',
          );
          // а когда кейс, когда вот это не выполняется???
          userDataHandler({ ...userData.data() });
        } /* else {
          userDataHandler(null);
        } */
      });

      userDBRef.collection('transactions').onSnapshot(transactionsSnapshot => {
        console.log(
          '%conTransactions',
          'background: #222; color: #bada55; text-decoration: underline;',
        );
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
          userDataHandler({ balance, transactions });
        } else {
          userDataHandler(null);
        }
      });
    };

    if (user) {
      email = user.email;
      userDBRef = firebase.firestore().collection('users').doc(user.uid);
      // по сути мы неявно создадим этот док, при первом использовании рефа!
      // мож это можно использовать?
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

export function addBudget(data) {
  return userDBRef
    .set({ budget: data }, { merge: true })
    .then(() => {
      console.log('budget added');
    })
    .catch(error => console.error('Error updating document: ', error));
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

export function addNewTag(tagValue) {
  const generateRandomKey = () => {
    const source = new Uint32Array(4);
    crypto.getRandomValues(source);
    return source.reduce((acc, decimal) => acc + decimal.toString(16), '');
  };

  userDBRef
    .set(
      {
        tags: {
          [generateRandomKey()]: tagValue,
        },
      },
      { merge: true },
    )
    .then(() => {
      console.log('Looks like ok');
    })
    .catch(error => {
      console.error('Error writing document: ', error);
    });
}

export function editTag(tagKay, tagValue) {
  const path = `tags.${tagKay}`;
  userDBRef
    .update({
      [path]: tagValue,
    })
    .then(() => {
      console.log('Looks like ok');
    })
    .catch(error => {
      console.error('Error writing document: ', error);
    });
}

export function removeTag(tagKay) {
  const path = `tags.${tagKay}`;
  userDBRef
    .update({
      [path]: firebase.firestore.FieldValue.delete(),
    })
    .then(() => {
      console.log('Looks like ok');
    })
    .catch(error => {
      console.error('Error writing document: ', error);
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
