// Importaciones de imágenes
import TerapeutaPlaceholder from "../assets/ASTRONAUTA3.png";
import creadordigital from "../assets/creadorvirtual.jpg";
// Puedes importar otras imágenes específicas de terapeutas aquí

import { TerapiaItem } from "../types/index";
import terapeuta11 from "../assets/Terapeuta11.jpeg";
import sentido from "../assets/Sentido.jpg";
import sanando from "../assets/Sanando.jpg";
export interface Terapeuta {
  id: number;
  nombre: string;
  email: string;
  servicios: TerapiaItem[];
  // Puedes añadir una propiedad para la imagen del perfil aquí
  imagenPerfil: string;
}

export const terapeutasData: Terapeuta[] = [
  {
    id: 2,
    nombre: "Paulina Villablanca",
    email: "paulina@email.com",
    imagenPerfil: terapeuta11, // Reemplaza con la imagen real
    servicios: [
      {
        img: sentido,
        title: "Dime cómo naciste, y te diré quién eres",
        terapeuta: "Paulina Villablanca",
        terapeuta_id: 2,
        description: "Descubramos tu proyecto Sentido...",
        precio: 10000,
        isDisabled: false,
        opciones: [{ sesiones: 1, precio: 10000 }],
      },
      {
        img: sanando,
        title: "Sanando mis heridas de infancia",
        terapeuta: "Paulina Villablanca",
        terapeuta_id: 2,
        description: "Sientes que tuviste una infancia difícil...",
        precio: 10000,
        isDisabled: false,
        opciones: [{ sesiones: 1, precio: 10000 }],
      },
    ],
  },
  {
    id: 12,
    nombre: "Rosa Santimone",
    email: "rosa@email.com",
    imagenPerfil: TerapeutaPlaceholder,
    servicios: [
      {
        img: TerapeutaPlaceholder,
        title: "Péndulo Hebreo",
        terapeuta: "Rosa Santimone",
        terapeuta_id: 12,
        description:
          "Es una terapia de sanación que trabaja con la vibración de las letras hebreas...",
        precio: 20000,
        isDisabled: false,
        opciones: [{ sesiones: 1, precio: 20000 }],
      },
      {
        img: TerapeutaPlaceholder,
        title: "Todos los servicios",
        terapeuta: "Rosa Santimone",
        terapeuta_id: 12,
        description:
          "Aquí están todos los servicios disponibles de Rosa Santimone.",
        precio: 15000,
        isDisabled: false,
        opciones: [{ sesiones: 1, precio: 15000 }],
      },
    ],
  },
  {
    id: 10,
    nombre: "Alice Basay",
    email: "spaholistico@encuentrodesanacion.com",
    imagenPerfil: creadordigital, // Reemplaza con la imagen real
    servicios: [
      {
        img: sentido,
        title: "Regresión",
        terapeuta: "Alice Basay",
        terapeuta_id: 10,
        description: "Descubramos tu proyecto Sentido...",
        precio: 10000,
        isDisabled: false,
        opciones: [{ sesiones: 1, precio: 10000 }],
      },
      {
        img: sanando,
        title: "Taller de Regresión",
        terapeuta: "Alice Basay",
        terapeuta_id: 10,
        description: "Sientes que tuviste una infancia difícil...",
        precio: 10000,
        isDisabled: false,
        opciones: [{ sesiones: 1, precio: 10000 }],
      },
    ],
  },
  // Añade más terapeutas y sus servicios aquí
];
