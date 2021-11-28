import React from "react";
import { render } from "react-dom";
import { App } from "./components/App";
import { HashRouter } from "react-router-dom";

render(
  <HashRouter basename="/">
    <App />
  </HashRouter>,
  document.getElementById("app")
);
