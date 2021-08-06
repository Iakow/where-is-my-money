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
  return userDBRef
    .collection('transactions')
    .add({ ...transaction })
    .then(docRef => {
      console.log('Document written with ID: ', docRef.id);
    })
    .catch(error => {
      console.error('Error adding document: ', error);
    });
}

// надо бы PATH
export function editTransaction(id, data) {
  return userDBRef
    .collection('transactions')
    .doc(id)
    .set({ ...data })
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
