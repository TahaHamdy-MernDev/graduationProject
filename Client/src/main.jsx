import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { CookiesProvider } from "react-cookie";
import { Provider } from "react-redux";
import Store from "./Redux/Store.jsx";
import { ToastContainer } from "react-toastify";
import { BrowserRouter } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import "primereact/resources/themes/saga-blue/theme.css";
// import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";

// import "primereact/resources/themes/lara-light-cyan/theme.css";
import { I18nextProvider } from "react-i18next";
import i18n from "./i18n.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <CookiesProvider defaultSetOptions={{ path: "/" }}>
        <Provider store={Store}>
        <I18nextProvider i18n={i18n}>
        <App />
          <ToastContainer position="top-right" autoClose={5000} />
      </I18nextProvider>
        </Provider>
      </CookiesProvider>
    </BrowserRouter>
  </React.StrictMode>
);
