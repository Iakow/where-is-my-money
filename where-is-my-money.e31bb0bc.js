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
exports.formatDate = formatDate;
exports.getDateString = getDateString;

function formatDate(timestamp) {
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
},{}],"node_modules/parcel-bundler/src/builtins/bundle-url.js":[function(require,module,exports) {
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
},{}],"node_modules/parcel-bundler/src/builtins/css-loader.js":[function(require,module,exports) {
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
},{"./bundle-url":"node_modules/parcel-bundler/src/builtins/bundle-url.js"}],"style.css":[function(require,module,exports) {
var reloadCSS = require('_css_loader');

module.hot.dispose(reloadCSS);
module.hot.accept(reloadCSS);
module.exports = {
  "main": "_main_3789a",
  "app-container": "_app-container_3789a",
  "list": "_list_3789a",
  "list-item": "_list-item_3789a",
  "form": "_form_3789a",
  "btn-edit": "_btn-edit_3789a",
  "btn-add": "_btn-add_3789a"
};
},{"_css_loader":"node_modules/parcel-bundler/src/builtins/css-loader.js"}],"rest.js":[function(require,module,exports) {
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

function connectFirebase() {
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
  firebase.initializeApp(firebaseConfig); // добавляю обзервер

  firebase.auth().onAuthStateChanged(user => {
    if (user) {
      window.UID = user.uid;
      user.getIdToken().then(token => window.TOKEN = token).then(() => getUserDB()).then(data => {
        window.userDataStore.balance = data.balance;
        window.userDataStore.transactions = data.transactions;
        window.userDataStore.categories = data.categories;
      }).then(() => window.renderApp()).catch(error => console.log(error.message));
    } else {
      console.log('need login');
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
  console.log(response);
  let result = await response.json();
  console.log(result);
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
    console.log(errorMessage);
  });
}

function register(mail) {
  firebase.auth().createUserWithEmailAndPassword(mail, '135790').then(userCredential => {
    var user = userCredential.user;
    window.UID = user.uid;
    return user;
  }).then(user => {
    return user.getIdToken();
  }).then(token => {
    window.TOKEN = token;
  }).then(() => {
    initializeUserDB(UID);
  }).catch(error => {
    var errorCode = error.code;
    var errorMessage = error.message;
    console.log(error.message);
  });
}
/* не нужна, т.к. нужен и баланс же */


async function getTransactions() {
  let response = await fetch(`https://kottans-app-default-rtdb.firebaseio.com/users/${window.UID}/transactions.json?auth=${window.TOKEN}`);
  let result = await response.json();
  window.userDataStore.transactions = result;
}

async function addNewTransaction(transaction) {
  let response = await fetch(`https://kottans-app-default-rtdb.firebaseio.com/users/${window.UID}/transactions.json?auth=${window.TOKEN}`, {
    method: 'POST',
    body: JSON.stringify(transaction)
  });
  let result = await response.json();
  console.log(result);
  getTransactions();
}

async function setBalance(balance) {
  let response = await fetch(`https://kottans-app-default-rtdb.firebaseio.com/users/${window.UID}/balance.json?auth=${window.TOKEN}`, {
    method: 'PUT',
    body: JSON.stringify(balance)
  });
  let result = await response.json();
  console.log('balace:', result);
}

async function getBalance() {
  let response = await fetch(`https://kottans-app-default-rtdb.firebaseio.com/users/${window.UID}/balance.json?auth=${window.TOKEN}`); // console.log(response);

  let result = await response.json();
  window.userDataStore.balance = result;
}

async function getCategories() {
  let response = await fetch(`https://kottans-app-default-rtdb.firebaseio.com/users/${window.UID}/categories.json?auth=${window.TOKEN}`);
  let result = await response.json();
  window.userDataStore.categories = result;
}

async function getUserDB() {
  let response = await fetch(`https://kottans-app-default-rtdb.firebaseio.com/users/${window.UID}.json?auth=${window.TOKEN}`);
  let result = await response.json(); // window.userDataStore.balance = result.balance;
  // window.userDataStore.transactions = result.transactions;
  // window.userDataStore.categories = result.categories;

  return result;
}

async function removeTransaction(id) {
  let response = await fetch(`https://kottans-app-default-rtdb.firebaseio.com/users/${UID}/transactions/${id}.json?auth=${window.TOKEN}`, {
    method: 'DELETE'
  });
  console.log(response);
  let result = await response.json();
}

async function editTransaction(id, data) {
  let response = await fetch(`https://kottans-app-default-rtdb.firebaseio.com/users/${window.UID}/transactions/${id}.json?auth=${window.TOKEN}`, {
    method: 'PUT',
    body: JSON.stringify(data)
  });
  let result = await response.json();
  console.log(result);
}
},{}],"index.js":[function(require,module,exports) {
"use strict";

var _utils = require("./utils");

var _style = _interopRequireDefault(require("./style.css"));

var _rest = require("./rest.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

window.userDataStore = {
  categories: null,
  balance: null,
  transactions: null,
  form: {
    isOpened: false,
    transactionId: null,
    data: null
  }
};
(0, _rest.connectFirebase)();
document.querySelector('#app').innerHTML = `Loading...`;

window.renderApp = () => {
  const {
    balance,
    transactions,
    form
  } = userDataStore;
  document.querySelector('#app').innerHTML = `
    <div class=${_style.default['app-container']}>
      ${Main(balance)}
      ${form.isOpened ? TransactionForm(form.data) : ''}
      ${List(transactions)}
    </div>
  `;
};

function Main(balance) {
  return `
    <div class="${_style.default.main}">
      <span>BALANCE: ${balance}</span>

      <button
        class=${_style.default['btn-add']}
        onclick="loadEmptyForm()"
      >
        +
      </button>
    </div>
  `;
}

function List(transactions) {
  let items = ``;

  for (let id in transactions) {
    const {
      sum,
      date,
      category,
      comment
    } = transactions[id];
    const categoryGroup = sum < 0 ? 'outcome' : 'income';
    items += `
      <li id="${id}" class=${_style.default['list-item']}>
        <span style="width:30%">${(0, _utils.getDateString)(date)}</span>
        <span style="width:15%">${sum}</span>
        <span>${userDataStore.categories[categoryGroup][category]}</span>
        <span style="width:25%">${comment}</span>

        <button
          
          class=${_style.default['btn-edit']}
          onclick="loadTransactionInForm(event)"
        >
          🖉
        </button>

        <button
          class=${_style.default['btn-delete']}
          onclick="deleteTransaction(event)"
        >
          X
        </button>
      </li>
    `;
  }

  return `<ul class=${_style.default.list}>${items}</ul>`;
}

function TransactionForm(transaction) {
  const moneyWay = +transaction.sum > 0 ? 'income' : 'outcome';
  const {
    comment,
    category
  } = transaction;
  const sum = transaction.sum ? Math.abs(transaction.sum) : '';
  const date = (0, _utils.formatDate)(transaction.date);
  return `
    <form class=${_style.default.form} onsubmit="addTransactionInDB(event)">
      ${Sum(sum)}
      ${DateInput(date)}
      ${Comment(comment)}
      ${Category(category)}

      <button type="button" class="cancel" onclick="cancel(event)">
        cancel
      </button>

      <input class="add" type="submit" value="add" />
    </form>
  `;

  function Sum(value) {
    return `
      <input
        type="number"
        placeholder="sum"
        name="sum"
        min="1"
        value ="${value}"
        required
      >
    `;
  }

  function Category(chosenCategoryID) {
    const handler = e => {
      document.querySelector('#categories').innerHTML = userDataStore.categories[e.target.value].map((category, i) => `<option value=${i}>${category}</option>`).join('');
    };

    return `
      <div onchange="(${handler})(event)">
        <label>
          <input
            type="radio"
            name="moneyWay"
            value="income"
            ${moneyWay == 'income' ? 'checked' : ''}
          />
          income
        </label>

        <label>
          <input 
            type="radio"
            name="moneyWay" 
            value="outcome" 
            ${moneyWay == 'outcome' ? 'checked' : ''}
          />
          outcome
        </label>
      </div>

      <br>

      <select name="category" id="categories">
        ${userDataStore.categories[moneyWay].map((category, i) => `
              <option ${chosenCategoryID == i ? 'selected' : ''} value=${i}> 
                ${category}
              </option>
            `).join('')}
      </select>
    `;
  }

  function DateInput(dateValue) {
    return `
      <input
        name="date"
        type="datetime-local" 
        placeholder="date"
        value=${dateValue}
      />
    `;
  }

  function Comment(content) {
    return `
      <input 
        type="text"
        placeholder="comment"
        name="comment"
        value="${content}"
      />
    `;
  }
} //////////////////////////////////////////////////////


function storeUserData(data) {
  window.userDataStore.balance = data.balance;
  window.userDataStore.transactions = data.transactions;
  window.userDataStore.categories = data.categories;
} ////////////////////////////////////////


window.cancel = function (e) {
  e.preventDefault();
  hideForm();
  renderApp();
};

window.loadEmptyForm = function () {
  userDataStore.form.data = {
    sum: '',
    date: Date.now(),
    category: 1,
    comment: ''
  };
  showForm();
  renderApp();
  document.forms[0].sum.focus();
};

window.loadTransactionInForm = function (e) {
  const transactionID = e.target.parentElement.id;
  userDataStore.form.transactionId = transactionID;
  userDataStore.form.data = _objectSpread({}, userDataStore.transactions[transactionID]);
  showForm();
  renderApp();
  document.forms[0].sum.focus();
}; ////////////////////////////////////////////////////


window.deleteTransaction = function (e) {
  const id = e.target.parentElement.id;
  const newBalance = userDataStore.balance - userDataStore.transactions[id].sum;
  (0, _rest.removeTransaction)(id).then(() => (0, _rest.setBalance)(newBalance)).then(() => (0, _rest.getUserDB)()).then(result => storeUserData(result)).then(() => renderApp());
};

window.addTransactionInDB = function (e) {
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
  const initialFormSum = +userDataStore.form.data.sum;
  const newBalance = userDataStore.balance + newTransaction.sum - initialFormSum; // вот здесь чет не оч

  if (userDataStore.form.transactionId) {
    (0, _rest.editTransaction)(userDataStore.form.transactionId, newTransaction).then(() => {
      hideForm();
      window.renderApp();
    }).then(() => (0, _rest.setBalance)(newBalance)).then(() => (0, _rest.getUserDB)()).then(result => storeUserData(result)).then(() => window.renderApp());
  } else {
    (0, _rest.addNewTransaction)(newTransaction).then(() => {
      hideForm();
      window.renderApp();
    }).then(() => (0, _rest.setBalance)(newBalance)).then(() => (0, _rest.getUserDB)()).then(result => storeUserData(result)).then(() => window.renderApp());
  }
};

window.showForm = function () {
  userDataStore.form.isOpened = true;
};

window.hideForm = function () {
  userDataStore.form.isOpened = false;
};

window.formatDate = _utils.formatDate;
},{"./utils":"utils.js","./style.css":"style.css","./rest.js":"rest.js"}],"node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
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
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "40199" + '/');

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
},{}]},{},["node_modules/parcel-bundler/src/builtins/hmr-runtime.js","index.js"], null)
//# sourceMappingURL=/where-is-my-money.e31bb0bc.js.map