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
})({"utils.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getHTMLDate = getHTMLDate;
exports.getDateString = getDateString;
exports.isFunction = void 0;

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

const isFunction = func => typeof func === 'function';

exports.isFunction = isFunction;
},{}],"framework/hooks.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createFunctionElement = createFunctionElement;
exports.useState = useState;
exports.useEffect = useEffect;
exports.useContext = exports.current = void 0;

var _utils = require("../utils");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

const current = {
  shouldReRender: true,
  wipComponent: null,
  hookIndex: null
};
exports.current = current;

function createFunctionElement(tag, props, children) {
  current.wipComponent = tag;
  current.hookIndex = 0;
  current.wipComponent.hooks = current.wipComponent.hooks || [];
  return tag(_objectSpread(_objectSpread({}, props), {}, {
    children
  }), children);
} // window.current = current;


function useState(initial) {
  const {
    wipComponent,
    hookIndex
  } = current;
  const oldHook = wipComponent.hooks[hookIndex];
  const hook = {
    state: oldHook ? oldHook.state : initial,
    queue: []
  };
  const actions = oldHook ? oldHook.queue : [];
  actions.forEach(action => {
    // 2. но вот это не срабатывает, массив пустой
    hook.state = (0, _utils.isFunction)(action) ? action(hook.state) : action;
  }); // 1. экшн в hook.queue вроде пушится

  const setState = action => {
    current.shouldReRender = true;
    hook.queue.push(action);
  };

  wipComponent.hooks[hookIndex] = hook;
  current.hookIndex++;
  return [hook.state, setState];
}

function useEffect(effect, deps) {
  const {
    wipComponent,
    hookIndex
  } = current;
  const oldHook = wipComponent.hooks[hookIndex];
  const oldDeps = oldHook ? oldHook.deps : undefined;
  const hasChanged = hasDepsChanged(oldDeps, deps);
  current.hookIndex++;
  if (!hasChanged) return;

  if (oldHook && oldHook.unmount) {
    window.removeEventListener('beforeunload', oldHook.unmount);
  }

  wipComponent.hooks[hookIndex] = {
    unmount: effect(),
    deps
  };
  window.addEventListener('beforeunload', wipComponent.hooks[hookIndex].unmount);
}

const hasDepsChanged = (prevDeps, nextDeps) => !prevDeps || !nextDeps || prevDeps.length !== nextDeps.length || prevDeps.some((dep, index) => dep !== nextDeps[index]);

const useContext = Context => Context.value;

exports.useContext = useContext;
},{"../utils":"utils.js"}],"framework/element.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createFragment = exports.createElement = void 0;

var _hooks = require("./hooks");

var _utils = require("../utils");

/**
 * Creates DOM Node. Implements jsx-parser's createElement API
 * @param {string|Function} tag - HTML tag as string or Component function
 * @param {object} props - element properties as parsed by jsx-parser
 * @param {Node[]} children - child elements
 * @returns {DocumentFragment|Element}
 */
const createElement = (tag, props, ...children) => {
  if ((0, _utils.isFunction)(tag)) {
    /*
       Passing children as the 2nd argument is required as jsx transformer puts component functions
       and regular tags in wrapper functions that expect children as the 2nd param
      */
    return (0, _hooks.createFunctionElement)(tag, props, children); // == tag({ ...props, children }, children)
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
},{"./hooks":"framework/hooks.js","../utils":"utils.js"}],"framework/render.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.render = render;
exports.default = void 0;

var _element = require("./element");

var _hooks = require("./hooks");

/** @jsx createElement */

/*** @jsxFrag createFragment */

/**
 * Renders a component and attaches it to the target DOM element
 * @param Component - function
 * @param target - DOM element to attach component to
 */
let timer;

function render(Component, target) {
  function workLoop() {
    if (_hooks.current.shouldReRender) {
      _hooks.current.shouldReRender = false;
      target.replaceChildren((0, _element.createElement)(Component, null));
    }

    cancelAnimationFrame(timer);
    timer = requestAnimationFrame(workLoop);
  }

  timer = requestAnimationFrame(workLoop);
}

var _default = render;
exports.default = _default;
},{"./element":"framework/element.js","./hooks":"framework/hooks.js"}],"data/dataStore.js":[function(require,module,exports) {
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
  signin('ponomarykov@gmail.com', '135790');
  firebase.auth().onAuthStateChanged(user => {
    if (user) {
      _dataStore.default.auth.UID = user.uid;
      user.getIdToken().then(token => _dataStore.default.auth.TOKEN = token).then(() => getUserDB()).then(data => handleData(data)).catch(error => {
        throw error;
      });
    } else {
      /* acondsole.log('need login'); */
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

function signin(email = 'ponomarykov@gmail.com') {
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

window.signout = signout;
},{"../data/dataStore":"data/dataStore.js"}],"../node_modules/parcel-bundler/src/builtins/bundle-url.js":[function(require,module,exports) {
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
  "btn-add": "_btn-add_4fae1",
  "red": "_red_4fae1",
  "green": "_green_4fae1",
  "btn-delete": "_btn-delete_4fae1"
};
},{"_css_loader":"../node_modules/parcel-bundler/src/builtins/css-loader.js"}],"components/Main.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = Main;

var _element = require("../framework/element");

var _style = _interopRequireDefault(require("../style"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/** @jsx createElement */

/** @jsxFrag createFragment */
function Main({
  balance,
  openForm
}) {
  return (0, _element.createElement)("div", {
    class: _style.default.main
  }, (0, _element.createElement)("span", null, "BALANCE: ", balance), (0, _element.createElement)("button", {
    class: _style.default['btn-add'],
    onClick: openForm
  }, "+"));
}
},{"../framework/element":"framework/element.js","../style":"style.css"}],"components/Filters.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = Filters;

var _element = require("../framework/element");

var _style = _interopRequireDefault(require("../style"));

var _utils = require("../utils");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/** @jsx createElement */

/** @jsxFrag createFragment */
function Filters({
  value,
  setFilters
}) {
  function handler({
    target
  }) {
    if (target.name == 'sortBySum') {
      setFilters(filters => {
        filters.sortBySum = +target.value;
        filters.sortByDate = 0;
        return filters;
      });
    } else if (target.name == 'sortByDate') {
      setFilters(filters => {
        filters.sortByDate = +target.value;
        filters.sortBySum = 0;
        return filters;
      });
    } else if (target.name == 'filterMoneyway') {
      setFilters(filters => {
        filters.filterMoneyway = +target.value;
        return filters;
      });
    } else if (target.name == 'firstDate' || target.name == 'lastDate') {
      setFilters(filters => {
        filters.filterDate[target.name] = new Date(target.value).getTime();
        return filters;
      });
    }
  }

  const SortBySum = ({
    value
  }) => (0, _element.createElement)("div", null, "sortBySum", (0, _element.createElement)("label", null, (0, _element.createElement)("input", {
    type: "radio",
    name: "sortBySum",
    value: "0",
    checked: value === 0
  }), "Off"), (0, _element.createElement)("label", null, (0, _element.createElement)("input", {
    type: "radio",
    name: "sortBySum",
    value: "1",
    checked: value === 1
  }), "Up"), (0, _element.createElement)("label", null, (0, _element.createElement)("input", {
    type: "radio",
    name: "sortBySum",
    value: "-1",
    checked: value === -1
  }), "Down"));

  const SortByDate = ({
    value
  }) => (0, _element.createElement)("div", null, "sortByDate", (0, _element.createElement)("label", null, (0, _element.createElement)("input", {
    type: "radio",
    name: "sortByDate",
    value: "0",
    checked: value === 0
  }), "Off"), (0, _element.createElement)("label", null, (0, _element.createElement)("input", {
    type: "radio",
    name: "sortByDate",
    value: "1",
    checked: value === 1
  }), "Up"), (0, _element.createElement)("label", null, (0, _element.createElement)("input", {
    type: "radio",
    name: "sortByDate",
    value: "-1",
    checked: value === -1
  }), "Down"));

  const FilterMoneyway = ({
    value
  }) => (0, _element.createElement)("div", null, "filterMoneyway", (0, _element.createElement)("label", null, (0, _element.createElement)("input", {
    type: "radio",
    name: "filterMoneyway",
    value: "0",
    checked: value === 0
  }), "All"), (0, _element.createElement)("label", null, (0, _element.createElement)("input", {
    type: "radio",
    name: "filterMoneyway",
    value: "1",
    checked: value === 1
  }), "Income"), (0, _element.createElement)("label", null, (0, _element.createElement)("input", {
    type: "radio",
    name: "filterMoneyway",
    value: "-1",
    checked: value === -1
  }), "Outcome"));

  const DateFilter = ({
    value
  }) => {
    function DateInput({
      value,
      name
    }) {
      return (0, _element.createElement)("input", {
        name: name,
        type: "datetime-local",
        placeholder: "date",
        value: (0, _utils.getHTMLDate)(value)
      });
    }

    return (0, _element.createElement)("div", null, (0, _element.createElement)(DateInput, {
      value: value.firstDate,
      name: "firstDate"
    }), (0, _element.createElement)(DateInput, {
      value: value.lastDate,
      name: "lastDate"
    }));
  };

  return (0, _element.createElement)("div", {
    onchange: handler
  }, (0, _element.createElement)(SortBySum, {
    value: value.sortBySum
  }), (0, _element.createElement)("br", null), (0, _element.createElement)(SortByDate, {
    value: value.sortByDate
  }), (0, _element.createElement)("br", null), (0, _element.createElement)(FilterMoneyway, {
    value: value.filterMoneyway
  }), (0, _element.createElement)("br", null), (0, _element.createElement)(DateFilter, {
    value: value.filterDate
  }));
}
},{"../framework/element":"framework/element.js","../style":"style.css","../utils":"utils.js"}],"components/List.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = List;

var _element = require("../framework/element");

var _hooks = require("../framework/hooks");

var _style = _interopRequireDefault(require("../style"));

var _utils = require("../utils");

var _Filters = _interopRequireDefault(require("../components/Filters"));

var _rest = require("../data/rest");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function List({
  setUserData,
  transactions,
  balance,
  categories,
  openForm
}) {
  //TODO: lastDate конфюзит, когда добавляется новая транзакция.
  const [filters, setFilters] = (0, _hooks.useState)({
    filterMoneyway: 0,
    sortBySum: 0,
    sortByDate: 1,
    filterDate: {
      firstDate: 0,
      lastDate: Date.now()
    }
  });
  let totalSum = 0;

  function getFilteredTransactions(transactions) {
    let filteredTransactions = Object.entries(transactions);
    filteredTransactions = filteredTransactions.filter(transaction => transaction[1].date >= filters.filterDate.firstDate && transaction[1].date <= filters.filterDate.lastDate);

    if (filters.filterMoneyway != 0) {
      filteredTransactions = filteredTransactions.filter(transaction => filters.filterMoneyway * transaction[1].sum > 0);
    }

    if (filters.sortByDate != 0) {
      filteredTransactions.sort((a, b) => filters.sortByDate * (b[1].date - a[1].date));
    }

    if (filters.sortBySum != 0) {
      filteredTransactions.sort((a, b) => filters.sortBySum * (b[1].sum - a[1].sum));
    }

    return filteredTransactions;
  }

  const ListItems = getFilteredTransactions(transactions).map(transaction => {
    const {
      date,
      category,
      comment,
      sum
    } = transaction[1];
    const id = transaction[0];
    const categoryGroup = sum < 0 ? 'outcome' : 'income';
    totalSum += sum;
    const color = {
      outcome: 'red',
      income: 'green'
    };
    return (0, _element.createElement)("li", {
      id: id,
      class: _style.default['list-item']
    }, (0, _element.createElement)("span", {
      style: "width:30%"
    }, (0, _utils.getDateString)(date)), (0, _element.createElement)("span", {
      class: _style.default[color[categoryGroup]],
      style: "width:15%"
    }, sum), (0, _element.createElement)("span", null, categories[categoryGroup][category]), (0, _element.createElement)("span", {
      style: "width:25%"
    }, comment), (0, _element.createElement)("button", {
      class: _style.default['btn-edit'],
      onclick: e => {
        openForm(e.target.parentElement.id);
      }
    }, "\uD83D\uDD89"), (0, _element.createElement)("button", {
      class: _style.default['btn-delete'],
      onclick: deleteTransaction
    }, "X"));
  });
  return (0, _element.createElement)("div", null, (0, _element.createElement)("ul", {
    class: _style.default.list
  }, ListItems, (0, _element.createElement)("li", null, "sum: ", totalSum)), (0, _element.createElement)(_Filters.default, {
    value: filters,
    setFilters: setFilters
  }));

  function deleteTransaction(e) {
    const id = e.target.parentElement.id;
    const newBalance = balance - transactions[id].sum;
    (0, _rest.removeTransaction)(id).then(() => (0, _rest.setBalance)(newBalance)).then(() => (0, _rest.getUserDB)()).then(data => {
      const {
        balance,
        categories
      } = data;
      const transactions = Object.entries(data.transactions).map(([key, value]) => _objectSpread({
        id: key
      }, value));
      setUserData({
        balance,
        categories,
        transactions
      });
    });
  }
}
},{"../framework/element":"framework/element.js","../framework/hooks":"framework/hooks.js","../style":"style.css","../utils":"utils.js","../components/Filters":"components/Filters.js","../data/rest":"data/rest.js"}],"components/TransactionForm/Sum.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = Sum;

var _element = require("../../framework/element");

/** @jsx createElement */

/** @jsxFrag createFragment */
function Sum({
  value,
  handler
}) {
  return (0, _element.createElement)("input", {
    type: "number",
    placeholder: "sum",
    autofocus: true,
    name: "sum",
    min: "1",
    value: value === 0 ? '' : value,
    required: true,
    onChange: e => {
      handler(e.target.name, +e.target.value);
    }
  });
}
},{"../../framework/element":"framework/element.js"}],"components/TransactionForm/Category.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = Category;

var _element = require("../../framework/element");

/** @jsx createElement */

/** @jsxFrag createFragment */
function Category({
  value,
  categories
}) {
  return (0, _element.createElement)("select", {
    name: "category",
    id: "categories"
  }, categories.map((category, i) => value == i ? (0, _element.createElement)("option", {
    selected: true,
    value: i
  }, category) : (0, _element.createElement)("option", {
    value: i
  }, category)));
}
},{"../../framework/element":"framework/element.js"}],"components/TransactionForm/DateInput.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = DateInput;

var _element = require("../../framework/element");

var _utils = require("../../utils");

/** @jsx createElement */

/** @jsxFrag createFragment */
function DateInput({
  value,
  handler
}) {
  return (0, _element.createElement)("input", {
    name: "date",
    type: "datetime-local",
    placeholder: "date",
    value: (0, _utils.getHTMLDate)(value),
    onInput: e => {
      handler(e.target.name, new Date(e.target.value).getTime());
    }
  });
}
},{"../../framework/element":"framework/element.js","../../utils":"utils.js"}],"components/TransactionForm/Comment.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = Comment;

var _element = require("../../framework/element");

/** @jsx createElement */

/** @jsxFrag createFragment */
function Comment({
  value,
  handler
}) {
  return (0, _element.createElement)("input", {
    type: "text",
    placeholder: "comment",
    name: "comment",
    value: value,
    onChange: e => {
      handler(e.target.name, e.target.value);
    }
  });
}
},{"../../framework/element":"framework/element.js"}],"components/TransactionForm/ToggleMoneyWay.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = ToggleMoneyWay;

var _element = require("../../framework/element");

/** @jsx createElement */

/** @jsxFrag createFragment */
function ToggleMoneyWay({
  value,
  handler
}) {
  return (0, _element.createElement)("div", {
    onchange: ({
      target
    }) => {
      handler(target.value === 'income' ? true : false);
    }
  }, (0, _element.createElement)("label", null, (0, _element.createElement)("input", {
    type: "radio",
    name: "moneyWay",
    value: "income",
    checked: value === true
  }), "income"), (0, _element.createElement)("label", null, (0, _element.createElement)("input", {
    type: "radio",
    name: "moneyWay",
    value: "outcome",
    checked: value === false
  }), "outcome"));
}
},{"../../framework/element":"framework/element.js"}],"components/TransactionForm/TransactionForm.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = TransactionForm;

var _element = require("../../framework/element");

var _style = _interopRequireDefault(require("../../style"));

var _hooks = require("../../framework/hooks");

var _Sum = _interopRequireDefault(require("./Sum"));

var _Category = _interopRequireDefault(require("./Category"));

var _DateInput = _interopRequireDefault(require("./DateInput"));

var _Comment = _interopRequireDefault(require("./Comment"));

var _ToggleMoneyWay = _interopRequireDefault(require("./ToggleMoneyWay"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/** @jsx createElement */

/*** @jsxFrag createFragment */
function TransactionForm({
  transaction,
  categories,
  returnData
}) {
  // TODO don`t show single zero in sum
  // TODO: what about initial category?
  const initialTransactionValues = {
    comment: '',
    category: 0,
    sum: 0,
    date: Date.now()
  };
  const [data, setData] = (0, _hooks.useState)(transaction || initialTransactionValues);
  const [isIncome, setIsIncome] = (0, _hooks.useState)(transaction ? transaction.sum > 0 ? true : false : false);

  const updateData = (name, value) => {
    setData(data => {
      if (name == 'sum') value = isIncome ? +value : -value;
      data[name] = value;
      return data;
    });
  };

  return (0, _element.createElement)("form", {
    class: _style.default.form,
    onsubmit: e => {
      e.preventDefault();
      returnData(data); // TransactionForm.hooks = [];
    }
  }, (0, _element.createElement)(_Sum.default, {
    value: Math.abs(data.sum),
    handler: updateData
  }), (0, _element.createElement)(_DateInput.default, {
    value: data.date,
    handler: updateData
  }), (0, _element.createElement)(_ToggleMoneyWay.default, {
    value: isIncome,
    handler: value => {
      setIsIncome(value);
      setData(data => {
        data.sum *= -1;
        data.category = 0;
        return data;
      });
    }
  }), (0, _element.createElement)(_Category.default, {
    value: data.category,
    categories: isIncome ? categories.income : categories.outcome,
    handler: updateData
  }), (0, _element.createElement)(_Comment.default, {
    value: data.comment,
    handler: updateData
  }), (0, _element.createElement)("button", {
    type: "button",
    class: "cancel",
    onclick: () => {
      // TransactionForm.hooks = [];
      returnData();
    }
  }, "cancel"), (0, _element.createElement)("input", {
    class: "add",
    type: "submit",
    value: "add"
  }));
}
},{"../../framework/element":"framework/element.js","../../style":"style.css","../../framework/hooks":"framework/hooks.js","./Sum":"components/TransactionForm/Sum.js","./Category":"components/TransactionForm/Category.js","./DateInput":"components/TransactionForm/DateInput.js","./Comment":"components/TransactionForm/Comment.js","./ToggleMoneyWay":"components/TransactionForm/ToggleMoneyWay.js"}],"components/App.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = App;

var _element = require("../framework/element");

var _hooks = require("../framework/hooks");

var _rest = require("../data/rest.js");

var _Main = _interopRequireDefault(require("../components/Main"));

var _List = _interopRequireDefault(require("../components/List"));

var _TransactionForm = _interopRequireDefault(require("./TransactionForm/TransactionForm"));

var _rest2 = require("../data/rest");

var _style = _interopRequireDefault(require("../style.css"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/** @jsx createElement */

/*** @jsxFrag createFragment */
function App() {
  const [userDataIsLoaded, setIsLoaded] = (0, _hooks.useState)(false);
  const [userData, setUserData] = (0, _hooks.useState)({});
  const [formIsOpen, setFormIsOpen] = (0, _hooks.useState)(false);
  const [currentTransactionID, setCurrentTransactionID] = (0, _hooks.useState)(null); // временный флаг, чтобы проще отслеживать примитив в стейте вместо userData

  const [flag, setFlag] = (0, _hooks.useState)('');
  (0, _hooks.useEffect)(() => {
    (0, _rest.connectFirebase)(data => {
      setUserData(data);
      setIsLoaded(!userDataIsLoaded);
    });
  }, [
    /* а что если юзер выйдет? */
  ]);

  function formHandler(data) {
    setFormIsOpen(false);

    if (data) {
      const newBalance = userData.balance + data.sum;

      if (currentTransactionID) {
        (0, _rest2.editTransaction)(currentTransactionID, data).then(() => (0, _rest2.setBalance)(newBalance)).then(() => (0, _rest2.getUserDB)()).then(data => {
          setUserData(data);
          setCurrentTransactionID(null);
        });
      } else {
        setFlag('loading');
        (0, _rest2.addNewTransaction)(data).then(() => (0, _rest2.setBalance)(newBalance)).then(() => (0, _rest2.getUserDB)()).then(() => {
          setFlag('ok');
          setUserData(data);
        });
      }
    }
  }

  if (!userDataIsLoaded) {
    return (0, _element.createElement)("h1", null, "Loading...");
  } else {
    return (0, _element.createElement)("div", {
      class: _style.default['app-container']
    }, (0, _element.createElement)("p", null, flag), (0, _element.createElement)(_Main.default, {
      balance: userData.balance,
      openForm: () => {
        setFormIsOpen(true);
      }
    }), (0, _element.createElement)(_List.default, {
      transactions: userData.transactions,
      categories: userData.categories,
      openForm: id => {
        setCurrentTransactionID(id);
        setFormIsOpen(true);
      },
      setUserData: setUserData
    }), formIsOpen ? (0, _element.createElement)(_TransactionForm.default, {
      transaction: userData.transactions[currentTransactionID],
      categories: userData.categories,
      returnData: formHandler
    }) : null);
  }
}

window.App = App;
},{"../framework/element":"framework/element.js","../framework/hooks":"framework/hooks.js","../data/rest.js":"data/rest.js","../components/Main":"components/Main.js","../components/List":"components/List.js","./TransactionForm/TransactionForm":"components/TransactionForm/TransactionForm.js","../data/rest":"data/rest.js","../style.css":"style.css"}],"index.js":[function(require,module,exports) {
"use strict";

var _render = _interopRequireDefault(require("./framework/render"));

var _App = _interopRequireDefault(require("./components/App"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

(0, _render.default)(_App.default, document.getElementById('app'));
},{"./framework/render":"framework/render.js","./components/App":"components/App.js"}],"../node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
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
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "45795" + '/');

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