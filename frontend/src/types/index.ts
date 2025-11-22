// src/types/index.ts

export interface OpcionSesion {
  sesiones: number;
  precio: number;
}

export interface RawDisponibilidadDBItem {
  nombreTerapeuta: string;
  terapeutaId: number | null;
  especialidad_servicio: string;
  diasDisponibles: string[];
  horasDisponibles: string[];
  estado: string;
  created_at?: string;
  updated_at?: string;
}

// Interfaz corregida para manejar la disponibilidad por servicio/especialidad
export interface DisponibilidadTerapeuta {
  nombreTerapeuta: string;
  terapeutaId: number | null;
  disponibilidadPorServicio: {
    [servicio: string]: {
      [fecha: string]: string[];
    };
  };
}

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
}

export interface TerapiaItem {
  img: string;
  title: string;
  terapeuta: string;
  terapeuta_id: number;
  description: string;
  precio: number;
  opciones?: OpcionSesion[];
  isDisabled?: boolean;
}
export interface Terapeuta {
  id: number;
  nombre: string;
  email: string;
  servicios: TerapiaItem[];
  imagenPerfil: string;
  callToActionTextCard?: string;
}
