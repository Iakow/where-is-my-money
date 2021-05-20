import { connectFirebase } from './data/rest.js';
import renderApp from './framework/render';
import dataStore from './data/dataStore';

renderApp();

// коллбэк можно запихнуть в rest, а может и вообще сделать для ФБ отдельный
connectFirebase(data => {
  dataStore.setUserData(data);

  // это неверно для разлогина!!!
  // вообще это должно показываться когда юзер вошел, иначе ж будет форма логина
  dataStore.userDataIsLoaded = true;
  renderApp();
});
