/** @jsx createElement */
/*** @jsxFrag createFragment */
import { createElement, createFragment } from './element';
import App from '../components/App';

export default function renderApp() {
  const app = document.querySelector('#app');
  app.innerHTML = '';
  app.appendChild(<App />);
}
