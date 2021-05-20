// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"data/dataStore.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

const dataStore = {
  auth: {
    TOKEN: null,
    UID: null
  },
  userData: {
    categories: null,
    balance: null,
    transactions: null
  },
  filteredTransactions: null,
  sortBySum: 0,
  sortByDate: 0,
  filterMoneyway: 0,
  filterDate: {
    firstDate: 0,
    // найти бы сразу минимальную дату
    lastDate: Date.now()
  },
  userDataIsLoaded: false,
  transactionForm: {
    isOpened: false,
    transactionId: null,
    data: null
  },
  setUserData: setUserData,
  selectTransactions: selectTransactions
};

function setUserData({
  balance,
  transactions,
  categories
}) {
  if (balance !== undefined) this.userData.balance = balance;
  if (categories !== undefined) this.userData.categories = categories;

  if (transactions !== undefined) {
    this.userData.transactions = Object.entries(transactions).map(([key, value]) => _objectSpread({
      id: key
    }, value));
    this.selectTransactions();
  }
}

function selectTransactions() {
  this.filteredTransactions = [...this.userData.transactions];
  this.filteredTransactions = this.filteredTransactions.filter(item => item.date >= dataStore.filterDate.firstDate && item.date <= dataStore.filterDate.lastDate);

  if (this.filterMoneyway != 0) {
    this.filteredTransactions = this.filteredTransactions.filter(item => this.filterMoneyway * item.sum < 0);
  }

  if (this.sortByDate != 0) {
    this.filteredTransactions.sort((a, b) => this.sortByDate * (b.date - a.date));
  }

  if (this.sortBySum != 0) {
    this.filteredTransactions.sort((a, b) => this.sortBySum * (a.sum - b.sum));
  }
}

var _default = dataStore;
exports.default = _default;
window.dataStore = dataStore;
},{}],"data/rest.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.connectFirebase = connectFirebase;
exports.register = register;
exports.getTransactions = getTransactions;
exports.addNewTransaction = addNewTransaction;
exports.setBalance = setBalance;
exports.getBalance = getBalance;
exports.getCategories = getCategories;
exports.getUserDB = getUserDB;
exports.removeTransaction = removeTransaction;
exports.editTransaction = editTransaction;

var _dataStore = _interopRequireDefault(require("../data/dataStore"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function connectFirebase(handleData) {
  const firebaseConfig = {
    apiKey: 'AIzaSyBwtSg-c3xYVJkNSDA49afwTxu6rA2JBDI',
    authDomain: 'kottans-app.firebaseapp.com',
    databaseURL: 'https://kottans-app-default-rtdb.firebaseio.com',
    projectId: 'kottans-app',
    storageBucket: 'kottans-app.appspot.com',
    messagingSenderId: '558738104058',
    appId: '1:558738104058:web:096c34066c87562a5df343',
    measurementId: 'G-MDSKRH794G'
  };
  firebase.initializeApp(firebaseConfig);
  firebase.auth().onAuthStateChanged(user => {
    if (user) {
      _dataStore.default.auth.UID = user.uid;
      user.getIdToken().then(token => _dataStore.default.auth.TOKEN = token).then(() => getUserDB()).then(data => handleData(data)).catch();
    } else
      /* error => fconsole.log(error.message) */
      {//jconsole.log('need login');
      }
  });
}

async function initializeUserDB(uid) {
  let userDB = {
    transactions: '',
    balance: '',
    categories: {
      outcome: ['Одежда', 'Транспорт', 'Услуги', 'Здоровье', 'Питание', 'Гигиена', 'Другое'],
      income: ['Зарплата', 'Фриланс', 'Подарок', 'Другое']
    }
  };
  let response = await fetch(`https://kottans-app-default-rtdb.firebaseio.com/users/${uid}.json?auth=${TOKEN}`, {
    method: 'PUT',
    body: JSON.stringify(userDB)
  });
  let result = await response.json();
}

function signout() {
  firebase.auth().signOut();
}

function signin(email) {
  firebase.auth().signInWithEmailAndPassword(email, '135790').then(userCredential => {
    var user = userCredential.user;
  }).catch(error => {
    var errorCode = error.code;
    var errorMessage = error.message;
  });
}

function register(mail) {
  firebase.auth().createUserWithEmailAndPassword(mail, '135790').then(userCredential => {
    var user = userCredential.user;
    _dataStore.default.auth.UID = user.uid;
    return user;
  }).then(user => {
    return user.getIdToken();
  }).then(token => {
    _dataStore.default.auth.TOKEN = token;
  }).then(() => {
    initializeUserDB(_dataStore.default.auth.UID);
  }).catch(error => {
    var errorCode = error.code;
    var errorMessage = error.message;
  });
}
/* не нужна, т.к. нужен и баланс же */


async function getTransactions() {
  let response = await fetch(`https://kottans-app-default-rtdb.firebaseio.com/users/${_dataStore.default.auth.UID}/transactions.json?auth=${_dataStore.default.auth.TOKEN}`);
  let result = await response.json();
  _dataStore.default.userData.transactions = result;
}

async function addNewTransaction(transaction) {
  let response = await fetch(`https://kottans-app-default-rtdb.firebaseio.com/users/${_dataStore.default.auth.UID}/transactions.json?auth=${_dataStore.default.auth.TOKEN}`, {
    method: 'POST',
    body: JSON.stringify(transaction)
  });
  let result = await response.json();
  getTransactions();
}

async function setBalance(balance) {
  let response = await fetch(`https://kottans-app-default-rtdb.firebaseio.com/users/${_dataStore.default.auth.UID}/balance.json?auth=${_dataStore.default.auth.TOKEN}`, {
    method: 'PUT',
    body: JSON.stringify(balance)
  });
  let result = await response.json();
}

async function getBalance() {
  let response = await fetch(`https://kottans-app-default-rtdb.firebaseio.com/users/${_dataStore.default.auth.UID}/balance.json?auth=${_dataStore.default.auth.TOKEN}`);
  let result = await response.json();
  _dataStore.default.userData.balance = result;
}

async function getCategories() {
  let response = await fetch(`https://kottans-app-default-rtdb.firebaseio.com/users/${_dataStore.default.auth.UID}/categories.json?auth=${_dataStore.default.auth.TOKEN}`);
  let result = await response.json();
  _dataStore.default.userData.categories = result;
}

async function getUserDB() {
  let response = await fetch(`https://kottans-app-default-rtdb.firebaseio.com/users/${_dataStore.default.auth.UID}.json?auth=${_dataStore.default.auth.TOKEN}`);
  let result = await response.json();
  return result;
}

async function removeTransaction(id) {
  let response = await fetch(`https://kottans-app-default-rtdb.firebaseio.com/users/${_dataStore.default.auth.UID}/transactions/${id}.json?auth=${_dataStore.default.auth.TOKEN}`, {
    method: 'DELETE'
  });
  let result = await response.json();
} // надо бы PATH


async function editTransaction(id, data) {
  let response = await fetch(`https://kottans-app-default-rtdb.firebaseio.com/users/${_dataStore.default.auth.UID}/transactions/${id}.json?auth=${_dataStore.default.auth.TOKEN}`, {
    method: 'PUT',
    body: JSON.stringify(data)
  });
  let result = await response.json();
}
},{"../data/dataStore":"data/dataStore.js"}],"framework/element.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createFragment = exports.createElement = void 0;

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/**
 * Creates DOM Node. Implements jsx-parser's createElement API
 * @param {string|Function} tag - HTML tag as string or Component function
 * @param {object} props - element properties as parsed by jsx-parser
 * @param {Node[]} children - child elements
 * @returns {DocumentFragment|Element}
 */
const createElement = (tag, props, ...children) => {
  if (typeof tag === 'function') {
    /*
      Passing children as the 2nd argument is required as jsx transformer puts component functions
      and regular tags in wrapper functions that expect children as the 2nd param
     */
    return tag(_objectSpread(_objectSpread({}, props), {}, {
      children
    }), children);
  }

  const element = tag === '' ? new DocumentFragment() : document.createElement(tag);
  Object.entries(props || {}).forEach(([name, value]) => {
    if (name.startsWith('on') && name.toLowerCase() in window) {
      element.addEventListener(name.toLowerCase().substr(2),
      /** @type {Function} */
      value);
    } else {
      try {
        if (!(element instanceof DocumentFragment)) {
          // Boolean attributes are considered to be true if they're present on the element at all, regardless of their actual value
          // https://developer.mozilla.org/en-US/docs/Web/API/Element/setAttribute#example
          if (['disabled', 'checked'].includes(name) && !value) {
            element.removeAttribute(name);
          } else {
            element.setAttribute(name, value);
          }
        }
      } catch (e) {
        console.error('createElement caught', e, 'on', element);
      }
    }
  });
  children.forEach(child => appendChild(element, child));
  return element;
};
/**
 * Appends child elements from an unbound array of children, recursively
 * @param {Node} parent
 * @param {Node|[Node]} child
 */


exports.createElement = createElement;

const appendChild = (parent, child) => {
  if (Array.isArray(child)) {
    child.forEach(subChild => appendChild(parent, subChild));
  } else {
    // Skip null and undefined
    if (child != null) {
      parent.appendChild(child.nodeType ? child : document.createTextNode(child.toString()));
    }
  }
};
/**
 * Creates Fragment. Implements jsx-parser's createFragment API
 * @param {object} props - effectively a placeholder, fragment never has any properties
 * @param {Node[]} children - child elements
 * @returns {DocumentFragment}
 */


const createFragment = (props, ...children) => createElement('', props, ...children);

exports.createFragment = createFragment;
},{}],"../node_modules/parcel-bundler/src/builtins/bundle-url.js":[function(require,module,exports) {
var bundleURL = null;

function getBundleURLCached() {
  if (!bundleURL) {
    bundleURL = getBundleURL();
  }

  return bundleURL;
}

function getBundleURL() {
  // Attempt to find the URL of the current script and use that as the base URL
  try {
    throw new Error();
  } catch (err) {
    var matches = ('' + err.stack).match(/(https?|file|ftp|chrome-extension|moz-extension):\/\/[^)\n]+/g);

    if (matches) {
      return getBaseURL(matches[0]);
    }
  }

  return '/';
}

function getBaseURL(url) {
  return ('' + url).replace(/^((?:https?|file|ftp|chrome-extension|moz-extension):\/\/.+)\/[^/]+$/, '$1') + '/';
}

exports.getBundleURL = getBundleURLCached;
exports.getBaseURL = getBaseURL;
},{}],"../node_modules/parcel-bundler/src/builtins/css-loader.js":[function(require,module,exports) {
var bundle = require('./bundle-url');

function updateLink(link) {
  var newLink = link.cloneNode();

  newLink.onload = function () {
    link.remove();
  };

  newLink.href = link.href.split('?')[0] + '?' + Date.now();
  link.parentNode.insertBefore(newLink, link.nextSibling);
}

var cssTimeout = null;

function reloadCSS() {
  if (cssTimeout) {
    return;
  }

  cssTimeout = setTimeout(function () {
    var links = document.querySelectorAll('link[rel="stylesheet"]');

    for (var i = 0; i < links.length; i++) {
      if (bundle.getBaseURL(links[i].href) === bundle.getBundleURL()) {
        updateLink(links[i]);
      }
    }

    cssTimeout = null;
  }, 50);
}

module.exports = reloadCSS;
},{"./bundle-url":"../node_modules/parcel-bundler/src/builtins/bundle-url.js"}],"style.css":[function(require,module,exports) {
var reloadCSS = require('_css_loader');

module.hot.dispose(reloadCSS);
module.hot.accept(reloadCSS);
module.exports = {
  "main": "_main_4fae1",
  "app-container": "_app-container_4fae1",
  "list": "_list_4fae1",
  "list-item": "_list-item_4fae1",
  "form": "_form_4fae1",
  "btn-edit": "_btn-edit_4fae1",
  "btn-add": "_btn-add_4fae1"
};
},{"_css_loader":"../node_modules/parcel-bundler/src/builtins/css-loader.js"}],"components/Main.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = Main;

var _element = require("../framework/element");

var _style = _interopRequireDefault(require("../style"));

var _render = _interopRequireDefault(require("../framework/render"));

var _dataStore = _interopRequireDefault(require("../data/dataStore"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/** @jsx createElement */

/** @jsxFrag createFragment */
function Main({
  balance
}) {
  return (0, _element.createElement)(_element.createFragment, null, (0, _element.createElement)("div", {
    class: _style.default.main
  }, (0, _element.createElement)("span", null, "BALANCE: ", balance), (0, _element.createElement)("button", {
    class: _style.default['btn-add'],
    onClick: openTransactionForm
  }, "+")));
}

function openTransactionForm() {
  _dataStore.default.transactionForm.data = {
    sum: '',
    date: Date.now(),
    category: 1,
    comment: ''
  };
  _dataStore.default.transactionForm.isOpened = true;
  (0, _render.default)();
  document.forms[0].sum.focus();
}
},{"../framework/element":"framework/element.js","../style":"style.css","../framework/render":"framework/render.js","../data/dataStore":"data/dataStore.js"}],"utils.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getHTMLDate = getHTMLDate;
exports.getDateString = getDateString;

function getHTMLDate(timestamp) {
  const d = new Date(timestamp);
  const DD = d.getDate() > 9 ? d.getDate() : `0${d.getDate()}`;
  const MM = d.getMonth() + 1 > 9 ? d.getMonth() + 1 : `0${d.getMonth() + 1}`;
  const YYYY = d.getFullYear();
  const HH = d.getHours() > 9 ? d.getHours() : `0${d.getHours()}`;
  const MI = d.getMinutes() > 9 ? d.getMinutes() : `0${d.getMinutes()}`;
  return `${YYYY}-${MM}-${DD}T${HH}:${MI}`;
}

function getDateString(timestamp) {
  const d = new Date(timestamp);
  const DD = d.getDate() > 9 ? d.getDate() : `0${d.getDate()}`;
  const MM = d.getMonth() + 1 > 9 ? d.getMonth() + 1 : `0${d.getMonth() + 1}`;
  const YYYY = d.getFullYear();
  const HH = d.getHours() > 9 ? d.getHours() : `0${d.getHours()}`;
  const MI = d.getMinutes() > 9 ? d.getMinutes() : `0${d.getMinutes()}`;
  return `${DD}.${MM}.${YYYY} - ${HH}:${MI}`;
}
},{}],"components/List.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = List;

var _element = require("../framework/element");

var _style = _interopRequireDefault(require("../style"));

var _render = _interopRequireDefault(require("../framework/render"));

var _utils = require("../utils");

var _rest = require("../data/rest");

var _dataStore = _interopRequireDefault(require("../data/dataStore"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function List({
  transactions
}) {
  let totalSum = 0;
  const ListItems = transactions.map(({
    id,
    date,
    category,
    comment,
    sum
  }) => {
    const categoryGroup = sum < 0 ? 'outcome' : 'income';
    totalSum += sum;
    return (0, _element.createElement)("li", {
      id: id,
      class: _style.default['list-item']
    }, (0, _element.createElement)("span", {
      style: "width:30%"
    }, (0, _utils.getDateString)(date)), (0, _element.createElement)("span", {
      style: "width:15%"
    }, sum), (0, _element.createElement)("span", null, _dataStore.default.userData.categories[categoryGroup][category]), (0, _element.createElement)("span", {
      style: "width:25%"
    }, comment), (0, _element.createElement)("button", {
      class: _style.default['btn-edit'],
      onclick: loadTransactionInForm
    }, "\uD83D\uDD89"), (0, _element.createElement)("button", {
      class: _style.default['btn-delete'],
      onclick: deleteTransaction
    }, "X"));
  });
  return (0, _element.createElement)("ul", {
    class: _style.default.list
  }, ListItems, (0, _element.createElement)("li", null, "sum: ", totalSum));
}

function loadTransactionInForm(e) {
  const transactionID = e.target.parentElement.id;
  _dataStore.default.transactionForm.transactionId = transactionID; // не нужна деструктуризцаия?

  _dataStore.default.transactionForm.data = _objectSpread({}, _dataStore.default.userData.transactions.find(item => item.id === transactionID));
  _dataStore.default.transactionForm.isOpened = true;
  (0, _render.default)();
  document.forms[0].sum.focus();
}

function deleteTransaction(e) {
  const id = e.target.parentElement.id;

  const newBalance = _dataStore.default.userData.balance - _dataStore.default.userData.transactions.find(item => item.id === id).sum;

  (0, _rest.removeTransaction)(id).then(() => (0, _rest.setBalance)(newBalance)).then(() => (0, _rest.getUserDB)()).then(data => {
    _dataStore.default.setUserData(data);

    (0, _render.default)();
  });
}
},{"../framework/element":"framework/element.js","../style":"style.css","../framework/render":"framework/render.js","../utils":"utils.js","../data/rest":"data/rest.js","../data/dataStore":"data/dataStore.js"}],"components/Filters.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = Filters;

var _element = require("../framework/element");

var _style = _interopRequireDefault(require("../style"));

var _render = _interopRequireDefault(require("../framework/render"));

var _dataStore = _interopRequireDefault(require("../data/dataStore"));

var _utils = require("../utils");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/** @jsx createElement */

/** @jsxFrag createFragment */
function Filters() {
  /* 
    Меняем флаги - это состояние фльтров (в частности радиобаттонов), во-первых
    При этом нужно получить новый массив для рендеринга
    1. Это может делать сам рендерящийся компонент при каждом рендеринге, на основе флагов
    2. Отфильтрованный массив можно хранить в стейте
       Вопрос в том, кто будет это делать.
       Этот массив должен формироваться при каждом событии из двух групп:
        1. При изменении состояния фильтров
        2. При изменении оригинального массива (добавление, удаление, редактирование)
         Вот, кстати, интересна первая группа. Выходит, каждый раз при обновлении оригинального массива должна вызываться некая функция, которая на основании флагов сформирует второй массив. Эта функция должна вызываться в хендлерах добавления, удаления, редактирования. Т.е. ее надо будет откуда-то импортировать в каждый из этих файлов. 
        И ее надо будет импортировать, очевидно, в Filters.
        Она явно не должна быть расположена в Filters. 
        ТОГДА ГДЕ???
         Странно, наверное, держать в utils функцию, которая должна полагаться на стейт.
        Странно что-то такое утилитарное импортировать из компонента в другой компонент.
         И еще, setUserData и selectTransactions в чем-то же схожи. Первая формирует что-то в стейте на основе входных данных, вторая делает то же самое. 
        Тогда может они стоят отдельного модуля?
        Ну, или же лучше оставить их там, где они есть...
  */
  function handler({
    target
  }) {
    if (target.name == 'sortBySum') {
      _dataStore.default.sortByDate = 0;
      _dataStore.default.sortBySum = +target.value;

      _dataStore.default.selectTransactions();

      (0, _render.default)();
    } else if (target.name == 'sortByDate') {
      _dataStore.default.sortBySum = 0;
      _dataStore.default.sortByDate = +target.value;

      _dataStore.default.selectTransactions();

      (0, _render.default)();
    } else if (target.name == 'filterMoneyway') {
      _dataStore.default.filterMoneyway = +target.value;

      _dataStore.default.selectTransactions();

      (0, _render.default)();
    }
  }

  const SortBySum = (0, _element.createElement)(_element.createFragment, null, "sortBySum", (0, _element.createElement)("label", null, (0, _element.createElement)("input", {
    type: "radio",
    name: "sortBySum",
    value: "0",
    checked: _dataStore.default.sortBySum === 0
  }), "Off"), (0, _element.createElement)("label", null, (0, _element.createElement)("input", {
    type: "radio",
    name: "sortBySum",
    value: "1",
    checked: _dataStore.default.sortBySum === 1
  }), "Up"), (0, _element.createElement)("label", null, (0, _element.createElement)("input", {
    type: "radio",
    name: "sortBySum",
    value: "-1",
    checked: _dataStore.default.sortBySum === -1
  }), "Down"));
  const SortByDate = (0, _element.createElement)(_element.createFragment, null, "sortByDate", (0, _element.createElement)("label", null, (0, _element.createElement)("input", {
    type: "radio",
    name: "sortByDate",
    value: "0",
    checked: _dataStore.default.sortByDate === 0
  }), "Off"), (0, _element.createElement)("label", null, (0, _element.createElement)("input", {
    type: "radio",
    name: "sortByDate",
    value: "1",
    checked: _dataStore.default.sortByDate === 1
  }), "Up"), (0, _element.createElement)("label", null, (0, _element.createElement)("input", {
    type: "radio",
    name: "sortByDate",
    value: "-1",
    checked: _dataStore.default.sortByDate === -1
  }), "Down"));
  const filterMoneyway = (0, _element.createElement)(_element.createFragment, null, "filterMoneyway", (0, _element.createElement)("label", null, (0, _element.createElement)("input", {
    type: "radio",
    name: "filterMoneyway",
    value: "0",
    checked: _dataStore.default.filterMoneyway === 0
  }), "All"), (0, _element.createElement)("label", null, (0, _element.createElement)("input", {
    type: "radio",
    name: "filterMoneyway",
    value: "1",
    checked: _dataStore.default.filterMoneyway === 1
  }), "Income"), (0, _element.createElement)("label", null, (0, _element.createElement)("input", {
    type: "radio",
    name: "filterMoneyway",
    value: "-1",
    checked: _dataStore.default.filterMoneyway === -1
  }), "Outcome"));

  const DateFilter = ({
    value
  }) => {
    // Явно нужен DateInput который можно переиспользовать.
    // собираюсь писать хендлеры...
    function DateInput({
      value,
      name,
      handler
    }) {
      return (0, _element.createElement)("input", {
        name: name,
        type: "datetime-local",
        placeholder: "date",
        value: (0, _utils.getHTMLDate)(value),
        onchange: handler
      });
    }

    function setDateFilter({
      target
    }) {
      _dataStore.default.filterDate[target.name] = new Date(target.value).getTime();

      _dataStore.default.selectTransactions();

      (0, _render.default)();
    }

    return (0, _element.createElement)(_element.createFragment, null, (0, _element.createElement)(DateInput, {
      value: value.start,
      name: "firstDate",
      handler: setDateFilter
    }), (0, _element.createElement)(DateInput, {
      value: value.end,
      name: "lastDate",
      handler: setDateFilter
    }));
  };

  return (0, _element.createElement)("div", {
    onchange: handler
  }, SortBySum, (0, _element.createElement)("br", null), SortByDate, (0, _element.createElement)("br", null), filterMoneyway, (0, _element.createElement)("br", null), (0, _element.createElement)(DateFilter, {
    value: {
      start: _dataStore.default.filterDate.firstDate,
      end: _dataStore.default.filterDate.lastDate
    }
  }));
}
},{"../framework/element":"framework/element.js","../style":"style.css","../framework/render":"framework/render.js","../data/dataStore":"data/dataStore.js","../utils":"utils.js"}],"components/TransactionForm.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = TransactionForm;

var _element = require("../framework/element");

var _style = _interopRequireDefault(require("../style"));

var _render = _interopRequireDefault(require("../framework/render"));

var _rest = require("../data/rest");

var _utils = require("../utils");

var _dataStore = _interopRequireDefault(require("../data/dataStore"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/** @jsx createElement */

/*** @jsxFrag createFragment */
let moneyWay;

function TransactionForm({
  transaction
}) {
  moneyWay = +transaction.sum > 0 ? 'income' : 'outcome';
  const {
    comment,
    category
  } = transaction;
  const sum = transaction.sum ? Math.abs(transaction.sum) : '';
  const date = (0, _utils.getHTMLDate)(transaction.date);
  return (0, _element.createElement)("form", {
    class: _style.default.form,
    onsubmit: addTransactionInDB
  }, (0, _element.createElement)(Sum, {
    value: sum
  }), (0, _element.createElement)(DateInput, {
    value: date
  }), (0, _element.createElement)(Category, {
    value: category
  }), (0, _element.createElement)(Comment, {
    value: comment
  }), (0, _element.createElement)("button", {
    type: "button",
    class: "cancel",
    onclick: cancel
  }, "cancel"), (0, _element.createElement)("input", {
    class: "add",
    type: "submit",
    value: "add"
  }));
}

function Sum({
  value
}) {
  return (0, _element.createElement)("input", {
    type: "number",
    placeholder: "sum",
    name: "sum",
    min: "1",
    value: value,
    required: true
  });
}

function Category({
  value
}) {
  const handler = e => {
    document.querySelector('#categories').innerHTML = _dataStore.default.userData.categories[e.target.value].map((category, i) => `<option value=${i}>${category}</option>`).join('');
  };

  return (0, _element.createElement)(_element.createFragment, null, (0, _element.createElement)("div", {
    onchange: handler
  }, (0, _element.createElement)("label", null, (0, _element.createElement)("input", {
    type: "radio",
    name: "moneyWay",
    value: "income",
    checked: moneyWay == 'income'
  }), "income"), (0, _element.createElement)("label", null, (0, _element.createElement)("input", {
    type: "radio",
    name: "moneyWay",
    value: "outcome",
    checked: moneyWay == 'outcome'
  }), "outcome")), (0, _element.createElement)("br", null), (0, _element.createElement)("select", {
    name: "category",
    id: "categories"
  }, _dataStore.default.userData.categories[moneyWay].map((category, i) => (0, _element.createElement)("option", {
    selected: value == i,
    value: i
  }, category))));
}

function DateInput({
  value
}) {
  return (0, _element.createElement)("input", {
    name: "date",
    type: "datetime-local",
    placeholder: "date",
    value: value
  });
}

function Comment({
  value
}) {
  return (0, _element.createElement)("input", {
    type: "text",
    placeholder: "comment",
    name: "comment",
    value: value
  });
}

function addTransactionInDB(e) {
  e.preventDefault();
  const {
    sum,
    date,
    category,
    comment,
    moneyWay
  } = e.target.elements;
  const newTransaction = {
    sum: moneyWay.value == 'income' ? +sum.value : -sum.value,
    date: new Date(date.value).getTime(),
    category: +category.value,
    comment: comment.value
  };
  const initialFormSum = +_dataStore.default.transactionForm.data.sum;
  const newBalance = _dataStore.default.userData.balance + newTransaction.sum - initialFormSum; // вот здесь чет не очт

  if (_dataStore.default.transactionForm.transactionId) {
    (0, _rest.editTransaction)(_dataStore.default.transactionForm.transactionId, newTransaction).then(() => {
      _dataStore.default.transactionForm.isOpened = false;
      (0, _render.default)();
    }).then(() => (0, _rest.setBalance)(newBalance)).then(() => (0, _rest.getUserDB)()).then(data => {
      _dataStore.default.setUserData(data);

      _dataStore.default.selectTransactions();

      (0, _render.default)();
    });
  } else {
    (0, _rest.addNewTransaction)(newTransaction).then(() => {
      _dataStore.default.transactionForm.isOpened = false;
      (0, _render.default)();
    }).then(() => (0, _rest.setBalance)(newBalance)).then(() => (0, _rest.getUserDB)()).then(data => {
      _dataStore.default.setUserData(data);

      (0, _render.default)();
    });
  }
}

function cancel(e) {
  e.preventDefault();
  _dataStore.default.transactionForm.isOpened = false;
  (0, _render.default)();
}
/* function setUserData(data) {
  dataStore.userData.balance = data.balance;
  dataStore.userData.transactions = data.transactions;
  dataStore.userData.categories = data.categories;
  renderApp();
} */
},{"../framework/element":"framework/element.js","../style":"style.css","../framework/render":"framework/render.js","../data/rest":"data/rest.js","../utils":"utils.js","../data/dataStore":"data/dataStore.js"}],"components/App.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = App;

var _element = require("../framework/element");

var _dataStore = _interopRequireDefault(require("../data/dataStore"));

var _Main = _interopRequireDefault(require("../components/Main"));

var _List = _interopRequireDefault(require("../components/List"));

var _Filters = _interopRequireDefault(require("../components/Filters"));

var _TransactionForm = _interopRequireDefault(require("../components/TransactionForm"));

var _style = _interopRequireDefault(require("../style.css"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/** @jsx createElement */

/*** @jsxFrag createFragment */
function App() {
  const {
    balance,
    transactions
  } = _dataStore.default.userData;
  const transaction = _dataStore.default.transactionForm.data;
  const showForm = _dataStore.default.transactionForm.isOpened;

  if (!_dataStore.default.userDataIsLoaded) {
    return (0, _element.createElement)("h1", null, "Loading...");
  } else {
    return (0, _element.createElement)("div", {
      class: _style.default['app-container']
    }, (0, _element.createElement)(_Main.default, {
      balance: balance
    }), (0, _element.createElement)(_List.default, {
      transactions: _dataStore.default.filteredTransactions
    }), (0, _element.createElement)(_Filters.default, null), showForm ? (0, _element.createElement)(_TransactionForm.default, {
      transaction: transaction
    }) : null);
  }
}
},{"../framework/element":"framework/element.js","../data/dataStore":"data/dataStore.js","../components/Main":"components/Main.js","../components/List":"components/List.js","../components/Filters":"components/Filters.js","../components/TransactionForm":"components/TransactionForm.js","../style.css":"style.css"}],"framework/render.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = renderApp;

var _element = require("./element");

var _App = _interopRequireDefault(require("../components/App"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/** @jsx createElement */

/*** @jsxFrag createFragment */
function renderApp() {
  const app = document.querySelector('#app');
  app.innerHTML = '';
  app.appendChild((0, _element.createElement)(_App.default, null));
}
},{"./element":"framework/element.js","../components/App":"components/App.js"}],"index.js":[function(require,module,exports) {
"use strict";

var _rest = require("./data/rest.js");

var _render = _interopRequireDefault(require("./framework/render"));

var _dataStore = _interopRequireDefault(require("./data/dataStore"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

(0, _render.default)(); // коллбэк можно запихнуть в rest, а может и вообще сделать для ФБ отдельный

(0, _rest.connectFirebase)(data => {
  _dataStore.default.setUserData(data); // это неверно для разлогина!!! 
  // вообще это должно показываться когда юзер вошел, иначе ж будет форма логина


  _dataStore.default.userDataIsLoaded = true;
  (0, _render.default)();
});
},{"./data/rest.js":"data/rest.js","./framework/render":"framework/render.js","./data/dataStore":"data/dataStore.js"}],"../node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "33661" + '/');

  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);

          if (didAccept) {
            handled = true;
          }
        }
      }); // Enable HMR for CSS by default.

      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });

      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else {
        window.location.reload();
      }
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }

  if (checkedAssets[id]) {
    return;
  }

  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}

function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }
}
},{}]},{},["../node_modules/parcel-bundler/src/builtins/hmr-runtime.js","index.js"], null)
//# sourceMappingURL=/src.e31bb0bc.js.map