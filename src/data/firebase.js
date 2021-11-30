import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import { useState, useEffect } from "react";

const firebaseConfig = {
  apiKey: process.env.apiKey,
  authDomain: process.env.authDomain,
  projectId: process.env.projectId,
};

let userDBRef;
export let email;

function setupFirebase() {
  if (firebase.apps.length === 0) {
    firebase.initializeApp(firebaseConfig);

    firebase
      .firestore()
      .enablePersistence()
      .catch((err) => {
        console.error(err);
      });
  }
}

function watchUserData(handleData) {
  /* тут транзакции отдельно, юзердок отдельно. Как совместить? */

  userDBRef.onSnapshot((userData) => {
    if (userData.data()) {
      console.log(userData.data());
      handleData({ ...userData.data() });
    }
  });

  userDBRef.collection("transactions").onSnapshot((transactionsSnapshot) => {
    const transactions = {};
    let balance = null;

    transactionsSnapshot.forEach((transaction) => {
      // а нельзя без перебора?
      if (transaction.id !== "balance") {
        transactions[transaction.id] = transaction.data();
      } else {
        balance = transaction.data().value;
      }
    });

    if (balance !== null) {
      // если после срабатывания второго листнера баланса нету - новый юзер. Но его еще можно просто прочесть.
      handleData({ balance, transactions });
    } else {
      handleData(null); // ????????????????????????????????????
    }
  });
}

const emptyUserData = {
  transactions: {},
  /* balance: null, */
  tags: [],
  categories: {
    income: [],
    outcome: [],
  },
};

export function useFirebase() {
  //TODO userData не должен обновляться, пока не приобретет заданную форму?

  const [isResponseWaiting, setIsResponceWaiting] = useState(true); // можно ли рендерить что-нибудь?
  const [userData, setUserData] = useState(emptyUserData);
  const [isAuth, setIsAuth] = useState(false);

  function onUserDataChanges(data) {
    // TODO новый юзер - no data

    if (data) {
      console.log("%c   setUserData()", "background: #222; color: #bada55");

      setUserData((userData) => {
        return { ...userData, ...data };
      });

      console.log("%c   setIsAuth()", "background: #222; color: #bada55");

      setIsAuth(true);

      console.log(
        "%c   setIsResponceWaiting()",
        "background: #222; color: #bada55"
      );

      if (data.transactions) setIsResponceWaiting(false);
    } else {
      console.log("NO-DATA");
      // создать док, потом задать баланс
      initializeUserDB();
    }
  }

  function onNoAuth() {
    setUserData(emptyUserData); // потереть данные прошлой сессии
    setIsResponceWaiting(false); // это если нет авторизации и onUserDataChanges не срабатывал
    setIsAuth(false);
  }

  useEffect(() => {
    console.log("FB-useEffect");
    setupFirebase();

    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        email = user.email;
        userDBRef = firebase.firestore().collection("users").doc(user.uid);

        // 1. Получаем юзердок
        // 2. Если его не существует - вот здесь и нужно задавать баланс и сразу инициализировать все остальное❗️❗️❗️
        // 3. По итогам - навешивать листнеры.
        // Вопрос - как мне прерваться на установку баланса и инициализацию, а потом навесить листнеры ❓❓❓

        // Два useEffect. Первый - один раз. Читаем док, если ок - initialized = true. И стработает второй с листнерами.
        // Если не ок? Нужен флаг, который переведет UI на баланс. ...

        watchUserData(onUserDataChanges);
      } else {
        onNoAuth();
      }
    });
  }, []);

  return { isResponseWaiting, userData, isAuth };
}

export function register(email, password) {
  return firebase.auth().createUserWithEmailAndPassword(email, password);
}

export function initializeUserDB() {
  const settings = {
    categories: {
      outcome: [
        "Одежда",
        "Транспорт",
        "Услуги",
        "Здоровье",
        "Питание",
        "Гигиена",
        "Другое",
      ],
      income: ["Зарплата", "Фриланс", "Подарок", "Другое"],
    },
    tags: {
      income: [],
      outcome: [],
    },
    initialized: false,
  };

  Promise.all([userDBRef.set({ ...settings }), setBalance(null)]).catch(
    (error) => console.error(error)
  );
}

export function setBalance(balance) {
  return userDBRef
    .collection("transactions")
    .doc("balance")
    .set({ value: balance })
    .catch((error) => console.error("Error updating document: ", error));
}

export function addBudget(data) {
  return userDBRef
    .set({ budget: data }, { merge: true })
    .then(() => {
      console.log("budget added");
    })
    .catch((error) => console.error("Error updating document: ", error));
}

export function signout() {
  firebase.auth().signOut();
}

export function signin(email, password) {
  return firebase.auth().signInWithEmailAndPassword(email, password);
}

export function addNewTransaction(transaction) {
  const batch = firebase.firestore().batch();

  const newTransactionRef = userDBRef.collection("transactions").doc();
  const balanceRef = userDBRef.collection("transactions").doc("balance");

  batch.set(newTransactionRef, { ...transaction });
  batch.update(balanceRef, {
    value: firebase.firestore.FieldValue.increment(transaction.sum),
  });

  return batch.commit().catch((error) => {
    console.error("Error adding document: ", error);
  });
}

export function addNewTag(tagValue) {
  const generateRandomKey = () => {
    const source = new Uint32Array(4);
    crypto.getRandomValues(source);
    return source.reduce((acc, decimal) => acc + decimal.toString(16), "");
  };

  userDBRef
    .set(
      {
        tags: {
          [generateRandomKey()]: tagValue,
        },
      },
      { merge: true }
    )
    .then(() => {
      console.log("Looks like ok");
    })
    .catch((error) => {
      console.error("Error writing document: ", error);
    });
}

export function editTag(tagKay, tagValue) {
  const path = `tags.${tagKay}`;
  userDBRef
    .update({
      [path]: tagValue,
    })
    .then(() => {
      console.log("Looks like ok");
    })
    .catch((error) => {
      console.error("Error writing document: ", error);
    });
}

export function removeTag(tagKay) {
  const path = `tags.${tagKay}`;
  userDBRef
    .update({
      [path]: firebase.firestore.FieldValue.delete(),
    })
    .then(() => {
      console.log("Looks like ok");
    })
    .catch((error) => {
      console.error("Error writing document: ", error);
    });
}

export function editTransaction(id, newData) {
  const batch = firebase.firestore().batch();

  const currentTransactionRef = userDBRef.collection("transactions").doc(id);
  const balanceRef = userDBRef.collection("transactions").doc("balance");

  return currentTransactionRef
    .get({ source: "cache" })
    .then((currentData) => {
      batch.update(currentTransactionRef, { ...newData });
      batch.update(balanceRef, {
        value: firebase.firestore.FieldValue.increment(
          newData.sum - currentData.data().sum
        ),
      });

      return batch.commit();
    })
    .catch((error) => {
      console.error("Error writing document: ", error);
    });
}

export function removeTransaction(id) {
  const batch = firebase.firestore().batch();

  const currentTransactionRef = userDBRef.collection("transactions").doc(id);
  const balanceRef = userDBRef.collection("transactions").doc("balance");

  return currentTransactionRef
    .get({ source: "cache" })
    .then((currentTransaction) => {
      batch.delete(currentTransactionRef);
      batch.update(balanceRef, {
        value: firebase.firestore.FieldValue.increment(
          -currentTransaction.data().sum
        ),
      });

      return batch.commit();
    })
    .catch((error) => {
      console.error("Error removing document: ", error);
    });
}
