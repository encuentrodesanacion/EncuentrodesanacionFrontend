import React, { createContext, useContext, useState, ReactNode } from "react";

export interface Reserva {
  id?: number;
  clientBookingId?: string; // Hacemos 'id' obligatorio, ya que siempre se genera
  terapeuta: string;
  servicio: string;
  especialidad: string; // Hacemos 'especialidad' obligatoria
  fecha: string; // Hacemos 'fecha' obligatoria tras la selección
  hora: string; // Hacemos 'hora' obligatoria tras la selección
  precio: number;
  nombreCliente: string;
  telefonoCliente: string;
  sesiones: number; // Asumimos que siempre será 1 sesión, pero es explícito
  cantidad: number; // Asumimos que siempre será 1 en el carrito
  categoria?: string; // Opcional si no siempre se usa
  terapeutaId?: number;
}

interface CartContextType {
  cart: Reserva[];
  addToCart: (item: Reserva) => void;
  removeFromCart: (index: number) => void;
  clearCart: () => void;
}

export const CartContext = createContext<CartContextType>({
  cart: [],
  addToCart: () => {},
  removeFromCart: () => {},
  clearCart: () => {},
});

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider = ({ children }: CartProviderProps) => {
  const [cart, setCart] = useState<Reserva[]>([]);

  const addToCart = (item: Reserva) => {
    // Validaciones básicas antes de añadir al carrito
    if (!item.especialidad || item.servicio.trim() === "") {
      console.error(
        "Error: El 'servicio' del ítem debe ser una cadena de texto no vacía."
      );
      return;
    }
    if (
      typeof item.precio !== "number" ||
      isNaN(item.precio) ||
      item.precio <= 0
    ) {
      console.error(
        "Error: El 'precio' del ítem debe ser un número válido y positivo."
      );
      return;
    }
    if (!item.nombreCliente || item.nombreCliente.trim() === "") {
      console.error("Error: 'nombreCliente' es requerido.");
      return;
    }
    if (!item.telefonoCliente || item.telefonoCliente.trim() === "") {
      console.error("Error: 'telefonoCliente' es requerido.");
      return;
    }

    setCart((prev) => [...prev, item]);
  };

  const removeFromCart = (index: number) =>
    setCart((prev) => prev.filter((_, i) => i !== index));
  const clearCart = () => setCart([]);

  return (
    <CartContext.Provider
      value={{ cart, addToCart, removeFromCart, clearCart }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within a CartProvider");
  return context;
};
