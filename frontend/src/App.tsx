import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import React from "react"; // Importa React si no lo tienes
import Terapias from "./pages/Terapiasdeluz";
import Home from "./pages/Home";
import ScrollToTop from "./components/ScrollToTop";
import { CartProvider } from "./pages/CartContext";
import WebpayReturnPage from "./pages/WebpayReturnPage"; // The intermediary page
import SuccessPage from "./pages/SuccessPage";

import CartIcon from "./components/CartIcon";
import TratamientoHolistico from "./pages/TratamientoIntegral";
// import Findetalleres from "./pages/Findetalleres";

import TallerMensual from "./pages/TalleresMensuales";
import QuienesSomosPage from "./pages/QuienesSomos";
import TerapeutasPage from "./pages/Staff";
import ComunidadYLeadsPage from "./pages/ComunidadyLeads";
import SpaPrincipal from "./pages/SpaPrincipal";
import FinDeTalleres from "./pages/Findetalleres";

// --- Importaciones de las nuevas páginas de pago ---
import PaymentSuccessPage from "./pages/PaymentSuccessPage";
import PaymentFailurePage from "./pages/PaymentFailurePage";
// --- Fin de importaciones de páginas de pago ---

// Asegúrate de que este import apunte a tu archivo CSS global.
// Por ejemplo, './styles/index.css' si está en src/styles/
import "./index.css"; // Asegúrate de que esta línea esté presente y correcta

export default function App() {
  return (
    <CartProvider>
      <Router>
        <CartIcon />

        {/* Asegúrate de que quieres mostrar siempre esta barra */}
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/terapeutasdeluz" element={<Terapias />} />
          <Route
            path="/tratamientointegral"
            element={<TratamientoHolistico />}
          />
          {/* <Route path="/Findetalleres" element={<Findetalleres />} /> */}
          <Route path="/tallermensual" element={<TallerMensual />} />
          <Route path="/quienes-somos" element={<QuienesSomosPage />} />
          <Route path="/staff-terapéutico" element={<TerapeutasPage />} />
          <Route path="/pago-confirmacion-exito" element={<SuccessPage />} />
          <Route path="/spaprincipal" element={<SpaPrincipal />} />
          <Route path="/findetalleres" element={<FinDeTalleres />} />
          <Route path="/nuestra-comunidad" element={<ComunidadYLeadsPage />} />

          {/* --- Rutas de pago --- */}
          {/* Ruta para el éxito del pago */}
          <Route
            path="/pago-confirmacion-exito"
            element={<PaymentSuccessPage />}
          />
          <Route path="/webpay-return" element={<WebpayReturnPage />} />
          {/* Ruta para el fallo del pago */}
          <Route path="/pago-fallido" element={<PaymentFailurePage />} />
          {/* --- Fin de rutas de pago --- */}

          {/* Ruta que redirige a la página principal si no hay coincidencias */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </CartProvider>
  );
}
