// src/components/Navigation.tsx
import { Link } from "react-router-dom";

const Navigation = () => {
  return (
    <nav className="bg-gray-800 text-white p-4">
      <ul className="flex justify-start gap-6 pl-8">
        <li>
          <Link to="/" className="hover:text-yellow-300">
            Reserva tu Hora
          </Link>
        </li>
        <li>
          <Link to="/carrito" className="hover:text-yellow-300">
            Carrito
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navigation;
