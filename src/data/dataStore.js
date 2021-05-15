const dataStore = {
  auth: {
    TOKEN: null,
    UID: null,
  },
  userData: {
    categories: null,
    balance: null,
    transactions: null,
  },
  transactionForm: {
    isOpened: false,
    transactionId: null,
    data: null,
  },
};

export default dataStore;
