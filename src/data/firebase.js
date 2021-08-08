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

let userDBRef;

export function connectFirebase(userDataCb, authCb) {
  firebase.initializeApp(firebaseConfig);

  firebase
    .firestore()
    .enablePersistence()
    .catch(err => {
      console.error(err);
      if (err.code == 'failed-precondition') {
        // Multiple tabs open, persistence can only be enabled
        // in one tab at a a time.
        // ...
      } else if (err.code == 'unimplemented') {
        console.error(err);
        // The current browser does not support all of the
        // features required to enable persistence
        // ...
      }
    });

  firebase.auth().onAuthStateChanged(user => {
    if (user) {
      userDBRef = firebase.firestore().collection('users').doc(user.uid);

      //listner on transactions collection
      userDBRef.collection('transactions').onSnapshot(transactionsSnapshot => {
        const transactions = [];

        transactionsSnapshot.forEach(doc => {
          transactions.push({ [doc.id]: doc.data() });
        });

        // а могу я узнать разницу по балансу?

        transactionsSnapshot.docChanges().forEach(change => {
          console.warn('transactionsSnapshotDiff: ', change.doc.data());
        });

        console.log('transactionsSnapshot: ', transactions);
      });

      getUserDB()
        .then(userDataCb)
        .catch(error => {
          alert(error.message);
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
    .catch(error => {
      alert(error.message);
    });
}

export function getUserDB() {
  function initializeUserDB() {
    const initialUserData = {
      balance: null,
      categories: {
        outcome: ['Одежда', 'Транспорт', 'Услуги', 'Здоровье', 'Питание', 'Гигиена', 'Другое'],
        income: ['Зарплата', 'Фриланс', 'Подарок', 'Другое'],
      },
      tags: {
        income: [],
        outcome: [],
      },
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
        console.log('getTransactions:', transactionsObj);
        return transactionsObj;
      });
  };

  const getAllDB = () => {
    return userDBRef
      .get()
      .then(doc => {
        if (doc.exists) {
          return { ...doc.data() }; //?
        } else {
          return initializeUserDB();
        }
      })
      .catch(error => {
        alert('Error getting document:', error);
      });
  };

  return Promise.all([getAllDB(), getTransactions()]).then(results => ({
    ...results[0],
    ...{ transactions: results[1] },
  }));
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
  // здесь можно тупо из транзакции получить прирощение баланса
  const batch = firebase.firestore().batch();

  const newTransactionRef = userDBRef.collection('transactions').doc();
  batch.set(newTransactionRef, { ...transaction });

  const balanceRef = userDBRef;
  const balanceDiff = transaction.sum;

  batch.update(balanceRef, {
    balance: firebase.firestore.FieldValue.increment(balanceDiff),
  });

  return batch
    .commit()
    .then(() => {
      console.log('batch added transaction and updated balance');
    })
    .catch(error => {
      console.error('Error adding document: ', error);
    });

  /* return userDBRef
    .collection('transactions')
    .add({ ...transaction })
    .then(docRef => {
      console.log('Document written with ID: ', docRef.id);
    })
    .catch(error => {
      console.error('Error adding document: ', error);
    }); */
}

export function editTransaction(id, data) {
  // а вот здесь вопрос по поводу прирощения.
  // как узнать какой была сумма до редактирования??? Это может знать только форма!
  // либо мы можем узнать по id до перезаписи. Что отвязывает нас от формы.
  // но тогда нужен доступ к базе. Возможно, он будет, если раотать через контекст.
  // эти функции ж будут методами одного объекта.

  //const oldSum = userDB.transactions[id].sum;
  //const newSum = data.sum;

  return userDBRef
    .collection('transactions')
    .doc(id)
    .update({ ...data })
    .then(() => {
      console.log('Document successfully written!');
    })
    .catch(error => {
      console.error('Error writing document: ', error);
    });
}

export function setBalance(balance) {
  return userDBRef
    .update({
      balance: balance,
    })
    .then(() => {
      console.log('Document successfully updated!');
    })
    .catch(error => {
      // The document probably doesn't exist.
      console.error('Error updating document: ', error);
    });
}

export function removeTransaction(id) {
  // здесь можно тупо из транзакции получить прирощение баланса
  return userDBRef
    .collection('transactions')
    .doc(id)
    .delete()
    .then(() => {
      console.log('Document successfully deleted!');
    })
    .catch(error => {
      console.error('Error removing document: ', error);
    });
}
