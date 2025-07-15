// src/types/index.ts

export interface OpcionSesion {
  sesiones: number;
  precio: number;
}

// ESTA ES LA INTERFAZ DE CÓMO VIENEN LOS DATOS CRUDOS DE TU BACKEND POR CADA FILA DE DISPONIBILIDAD
// (Basado en la salida de tu consola rawData: nombreTerapeuta, diasDisponibles, horasDisponibles directos)
export interface RawDisponibilidadDBItem {
  nombreTerapeuta: string;
  terapeutaId: number | null;
  diasDisponibles: string[]; // <-- Viene como Array(1) con el string "YYYY-MM-DD"
  horasDisponibles: string[]; // <-- Viene como Array(1) con el string JSON "[\"HH:MM\"]"
  estado: string; // Puede que venga o no, lo hacemos opcional
  // Puede que venga o no, lo hacemos opcional
  created_at?: string;
  updated_at?: string;
}

// ESTA ES LA INTERFAFA PARA LA DISPONIBILIDAD PROCESADA Y AGREGADA EN EL FRONTEND
// (La que tu componente ReservaConFecha espera ahora)
export interface DisponibilidadTerapeuta {
  nombreTerapeuta: string;
  terapeutaId: number | null;
  disponibilidadPorFecha: {
    [dateString: string]: string[]; // Ejemplo: { "2025-07-01": ["16:00", "18:00"], ... }
  };
}

// Asegúrate de que esta interfaz Reserva también esté aquí si la usas en CartContext o similar
export interface Reserva {
  id: number;
  servicio: string;
  especialidad: string;
  fecha: string;
  hora: string;
  precio: number;
  nombreCliente: string;
  telefonoCliente: string;
  terapeuta: string;
  terapeutaId: number;
  sesiones: number;
  cantidad: number;
}

export interface ReservaPendiente {
  terapia: string;
  precio: number;
  terapeutaNombre: string;
  terapeutaId: number;
  especialidad: string;
}

export interface TerapiaItem {
  img: string;
  title: string;
  terapeuta: string;
  terapeuta_id: number; // Coincide con la base de datos
  description: string;
  precio: number;
  opciones?: OpcionSesion[];
  isDisabled?: boolean;
  especialidad: string;
}
