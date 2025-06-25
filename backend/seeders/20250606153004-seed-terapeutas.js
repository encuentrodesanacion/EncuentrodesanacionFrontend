// backend/seeders/YYYYMMDDHHMMSS-seed-terapeutas.js
"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const terapeutasData = [
      // Terapeuta existente 1 (Betsy Bolivar - actualizar email si es el mismo que en SQL)
      {
        nombre: "Betsy Bolivar",
        email: "betsybolivar2980@gmail.com", // Email actualizado según tu SQL
        servicios_ofrecidos: JSON.stringify([
          "Workshop de Armonización de Chakras",
          "La limpieza de lealtades transgeneracionales",
          "Limpieza de Espacios", // Mantener si es un servicio adicional
        ]),
        created_at: new Date(),
        updated_at: new Date(),
      },
      // Terapeuta existente 2 (Paulina Villablanca - cuidado con el email "ejemplo.com")
      {
        nombre: "Paulina Villablanca",
        email: "paulina.villablanca@ejemplo.com", // Considera usar un email real si es para producción
        servicios_ofrecidos: JSON.stringify([
          "Constelaciones Familiares",
          "Taller de Meditación Profunda",
        ]),
        created_at: new Date(),
        updated_at: new Date(),
      },
      // Duplicado de Paulina Villablanca - ELIMINAR O CONSOLIDAR
      // Si el tercer Paulina Villablanca era un duplicado, lo eliminamos.
      // Si tenía servicios diferentes, consolida los servicios en un solo objeto para Paulina.

      // --- Nuevos Terapeutas desde tus INSERTs SQL ---

      {
        nombre: "Fabiola Valenzuela",
        email: "espacio.hijadela.luz@gmail.com",
        servicios_ofrecidos: JSON.stringify(["Limpieza con Cruz de Anhk"]),
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        nombre: "Niza",
        email: "brain.niza@gmail.com",
        servicios_ofrecidos: JSON.stringify(["Tarot"]),
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        nombre: "Mónica Gatica",
        email: "mogatica@gmail.com",
        servicios_ofrecidos: JSON.stringify([
          "Tameana - Salush Nahí",
          "Canalización",
          "Liberación Memorias Uterinas",
        ]),
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        nombre: "Macarena del Río",
        email: "Templo.sirio@gmail.com", // Asegúrate que el email no tenga espacios extra
        servicios_ofrecidos: JSON.stringify([
          "Reprogramación Neurolingüistica Emocional",
          "Reiki Egipcio",
        ]),
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        nombre: "Brenda Rivas",
        email: "rbrenda895@gmail.com",
        servicios_ofrecidos: JSON.stringify(["Canalización Energética"]),
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        nombre: "Nicole Rojas",
        email: "nrojasb0248@gmail.com",
        servicios_ofrecidos: JSON.stringify(["Péndulo Hebreo"]),
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        nombre: "Sandra Da Silva",
        email: "sandraserendipiall@gmail.com",
        servicios_ofrecidos: JSON.stringify([
          "Terapia de Respuesta Espiritual (Con Conexión Angelical)",
          "Purificación y Limpieza de Energías Negativas",
        ]),
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        nombre: "Paola Quintero",
        email: "paolaq81@gmail.com",
        servicios_ofrecidos: JSON.stringify([
          "Tarot Predictivo y/o Terapia con Oráculos",
        ]),
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        nombre: "Rosa Santimone",
        email: "rosisanti4@hotmail.com",
        servicios_ofrecidos: JSON.stringify(["Péndulo Hebreo"]),
        created_at: new Date(),
        updated_at: new Date(),
      },
    ];

    // Primero, si estás re-sembrando, podrías querer vaciar la tabla para evitar duplicados en cada ejecución.
    // await queryInterface.bulkDelete("terapeutas", null, {}); // Descomentar si quieres vaciar antes

    await queryInterface.bulkInsert(
      "terapeutas", // Asegúrate de que el nombre de la tabla sea 'terapeutas' (minúsculas)
      terapeutasData,
      {}
    );
  },

  down: async (queryInterface, Sequelize) => {
    // Si ejecutas el 'down', elimina todos los terapeutas insertados por este seeder.
    // Considera eliminar solo los que tienen los emails de este seeder para no borrar datos que no insertaste.
    await queryInterface.bulkDelete(
      "terapeutas",
      {
        email: [
          "betsybolivar2980@gmail.com",
          "paulina.villablanca@ejemplo.com", // Si usas este email
          "espacio.hijadela.luz@gmail.com",
          "brain.niza@gmail.com",
          "mogatica@gmail.com",
          "Templo.sirio@gmail.com",
          "rbrenda895@gmail.com",
          "nrojasb0248@gmail.com",
          "sandraserendipiall@gmail.com",
          "paolaq81@gmail.com",
          "rosisanti4@hotmail.com",
        ],
      },
      {}
    );
    // Alternativamente, para borrar todo: await queryInterface.bulkDelete("terapeutas", null, {});
  },
};
