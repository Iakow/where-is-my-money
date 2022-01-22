import React from "react";
import { render } from "react-dom";
import { App } from "./components/App/App";
import { HashRouter } from "react-router-dom";

/* window.addEventListener("resize", () => {
  let vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty("--vh", `${vh}px`);
}); */

render(
  <HashRouter basename="/">
    <App />
  </HashRouter>,
  document.getElementById("root")
);
