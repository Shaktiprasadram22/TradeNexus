// TradeNexus/Client/src/index.js

import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css"; // You might not need this if using only Tailwind, or it can be empty
import App from "./App";
import reportWebVitals from "./reportWebVitals"; // For performance monitoring

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
