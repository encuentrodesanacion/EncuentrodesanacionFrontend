import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { CartProvider } from "./pages/CartContext";
import { I18nextProvider } from "react-i18next";
import i18n from "../src/i18n";
import CartIcon from "./components/CartIcon";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <I18nextProvider i18n={i18n}>
      <CartProvider>
        <App />
      </CartProvider>
    </I18nextProvider>
  </StrictMode>
);
