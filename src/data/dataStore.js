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
  filteredTransactions: null,
  sortBySum: 0,
  sortByDate: 0,
  filterMoneyway: 0,
  filterDate: {
    firstDate: 0, // найти бы сразу минимальную дату
    lastDate: Date.now(),
  },
  userDataIsLoaded: false,
  transactionForm: {
    isOpened: false,
    transactionId: null,
    data: null,
  },
  setUserData: setUserData,
  selectTransactions: selectTransactions,
};

function setUserData({ balance, transactions, categories }) {
  if (balance !== undefined) this.userData.balance = balance;
  if (categories !== undefined) this.userData.categories = categories;
  if (transactions !== undefined) {
    this.userData.transactions = Object.entries(transactions).map(([key, value]) => ({
      id: key,
      ...value,
    }));

    this.selectTransactions();
  }
}

function selectTransactions() {
  this.filteredTransactions = [...this.userData.transactions];

  this.filteredTransactions = this.filteredTransactions.filter(
    item =>
      item.date >= dataStore.filterDate.firstDate && item.date <= dataStore.filterDate.lastDate,
  );

  if (this.filterMoneyway != 0) {
    this.filteredTransactions = this.filteredTransactions.filter(
      item => this.filterMoneyway * item.sum < 0,
    );
  }

  if (this.sortByDate != 0) {
    this.filteredTransactions.sort((a, b) => this.sortByDate * (b.date - a.date));
  }
  if (this.sortBySum != 0) {
    this.filteredTransactions.sort((a, b) => this.sortBySum * (a.sum - b.sum));
  }
}

export default dataStore;

window.dataStore = dataStore;
