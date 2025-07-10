import React from "react";

const PoliticasdePrivacidad: React.FC = () => {
  return (
    <div className="bg-gradient-to-br from-purple-100 via-pink-100 to-blue-100 min-h-screen py-16 px-4 sm:px-6 lg:px-8 flex justify-center items-start">
      <div className="max-w-4xl mx-auto bg-white shadow-2xl rounded-xl p-8 md:p-12 border border-gray-200">
        <h1 className="text-4xl font-extrabold text-indigo-800 mb-6 text-center tracking-tight">
          Política de Privacidad de Encuentro de Sanación
        </h1>
        <p className="text-gray-500 text-sm mb-10 text-center italic">
          Fecha de entrada en vigor: 8 de julio de 2025
        </p>

        <p className="text-gray-700 mb-8 leading-relaxed text-lg">
          En Encuentro de Sanación, operado a través de{" "}
          <a
            href="https://www.encuentrodesanacion.com"
            className="text-purple-600 hover:text-purple-800 hover:underline transition-colors duration-200"
            target="_blank"
            rel="noopener noreferrer"
          >
            www.encuentrodesanacion.com
          </a>
          , valoramos y respetamos su privacidad. Esta Política de Privacidad
          describe cómo recopilamos, utilizamos, almacenamos y protegemos su
          información personal cuando visita nuestro sitio web y utiliza
          nuestros servicios. Al acceder o utilizar nuestros servicios, usted
          acepta las prácticas descritas en esta política.
        </p>

        {/* Sección 1 */}
        <section className="mb-10">
          <h2 className="text-3xl font-bold text-indigo-700 mb-4 mt-8 border-b-2 border-purple-300 pb-2">
            1. Identidad y Contacto del Responsable del Tratamiento
          </h2>
          <p className="text-gray-700 mb-4 leading-relaxed">
            El responsable del tratamiento de sus datos personales es:
          </p>
          <div className="bg-indigo-50 p-6 rounded-lg border border-indigo-200 shadow-sm">
            <p className="font-bold text-indigo-800 text-xl mb-2">
              Encuentro de Sanación
            </p>
            <p className="text-gray-700 mb-1">
              <span className="font-semibold">Sitio Web:</span>{" "}
              <a
                href="https://www.encuentrodesanacion.com"
                className="text-purple-600 hover:text-purple-800 hover:underline transition-colors duration-200"
                target="_blank"
                rel="noopener noreferrer"
              >
                www.encuentrodesanacion.com
              </a>
            </p>
            <p className="text-gray-700 mb-1">
              <span className="font-semibold">Correo Electrónico:</span>{" "}
              <a
                href="mailto:spaholistico@encuentrodesanacion.com"
                className="text-purple-600 hover:text-purple-800 hover:underline transition-colors duration-200"
              >
                spaholistico@encuentrodesanacion.com
              </a>
            </p>
            <p className="text-gray-700">
              <span className="font-semibold">Teléfono:</span> +569 7655 7902
            </p>
          </div>
        </section>

        {/* Sección 2 */}
        <section className="mb-10">
          <h2 className="text-3xl font-bold text-indigo-700 mb-4 mt-8 border-b-2 border-purple-300 pb-2">
            2. Información que Recopilamos
          </h2>
          <p className="text-gray-700 mb-4 leading-relaxed">
            Recopilamos diferentes tipos de información para operar y mejorar
            nuestros servicios:
          </p>

          <ul className="list-none pl-0 space-y-6 text-gray-700">
            <li>
              <h3 className="font-bold text-xl text-indigo-600 mb-2">
                Información que usted nos proporciona directamente:
              </h3>
              <ul className="list-disc pl-8 space-y-2 text-gray-700">
                <li>
                  <span className="font-semibold">
                    Datos de Contacto e Identificación:
                  </span>{" "}
                  Nombre completo, dirección de correo electrónico, número de
                  teléfono. Estos datos se recopilan cuando usted realiza una
                  reserva, se registra en nuestro sitio o se comunica con
                  nosotros.
                </li>
                <li>
                  <span className="font-semibold">
                    Datos de Reserva/Servicio:
                  </span>{" "}
                  Detalles sobre los servicios que reserva (tipo de terapia,
                  especialidad, fecha, hora, terapeuta, cantidad de sesiones,
                  precio), nombre y teléfono del cliente asociado a la reserva.
                </li>
                <li>
                  <span className="font-semibold">Datos de Comunicación:</span>{" "}
                  Contenido de sus mensajes cuando se comunica con nosotros por
                  correo electrónico, formularios de contacto u otros medios.
                </li>
              </ul>
            </li>
            <li>
              <h3 className="font-bold text-xl text-indigo-600 mb-2">
                Información recopilada automáticamente:
              </h3>
              <ul className="list-disc pl-8 space-y-2 text-gray-700">
                <li>
                  <span className="font-semibold">Datos de Uso:</span>{" "}
                  Información sobre cómo accede y utiliza nuestro sitio web,
                  como las páginas visitadas, la duración de la visita, las
                  acciones realizadas, y los patrones de navegación.
                </li>
                <li>
                  <span className="font-semibold">Datos Técnicos:</span>{" "}
                  Dirección IP, tipo de navegador, versión del navegador,
                  sistema operativo, tipo de dispositivo, identificadores únicos
                  de dispositivo y otros datos de diagnóstico.
                </li>
                <li>
                  <span className="font-semibold">
                    Datos de Cookies y Tecnologías de Seguimiento:
                  </span>{" "}
                  Información recopilada a través de cookies y tecnologías
                  similares (ver sección 5).
                </li>
              </ul>
            </li>
            <li>
              <h3 className="font-bold text-xl text-indigo-600 mb-2">
                Información de Pago:
              </h3>
              <ul className="list-disc pl-8 space-y-2 text-gray-700">
                <li>
                  Para procesar sus pagos, utilizamos servicios de terceros
                  (Transbank Webpay Plus). Nosotros{" "}
                  <span className="font-bold">
                    no almacenamos ni procesamos directamente los datos
                    sensibles de su tarjeta de crédito o débito
                  </span>
                  . Toda la información de pago sensible es manejada
                  directamente por Transbank, que cumple con los estándares de
                  seguridad de la industria de pagos (PCI DSS).
                </li>
                <li>
                  Recibimos de Transbank solo información que nos permite
                  verificar el estado de su pago (aprobado, rechazado, anulado)
                  y un token de transacción o número de orden que vincula su
                  pago con su reserva en nuestro sistema.
                </li>
              </ul>
            </li>
          </ul>
        </section>

        {/* Sección 3 */}
        <section className="mb-10">
          <h2 className="text-3xl font-bold text-indigo-700 mb-4 mt-8 border-b-2 border-purple-300 pb-2">
            3. Finalidad del Tratamiento de Datos (Cómo Usamos Su Información)
          </h2>
          <p className="text-gray-700 mb-4 leading-relaxed">
            Utilizamos la información recopilada para los siguientes propósitos:
          </p>
          <ul className="list-none pl-0 space-y-6 text-gray-700">
            <li>
              <h3 className="font-bold text-xl text-indigo-600 mb-2">
                Para proporcionar y gestionar nuestros servicios:
              </h3>
              <ul className="list-disc pl-8 space-y-2 text-gray-700">
                <li>Procesar sus reservas de terapias y sesiones.</li>
                <li>Gestionar el flujo de pagos a través de Transbank.</li>
                <li>Confirmar sus citas y enviar recordatorios.</li>
                <li>
                  Facilitar la comunicación entre usted, nosotros y los
                  terapeutas (cuando sea relevante para la prestación del
                  servicio).
                </li>
              </ul>
            </li>
            <li>
              <h3 className="font-bold text-xl text-indigo-600 mb-2">
                Para mejorar y personalizar su experiencia:
              </h3>
              <ul className="list-disc pl-8 space-y-2 text-gray-700">
                <li>
                  Analizar cómo se utiliza nuestro sitio web para mejorar su
                  funcionalidad y contenido.
                </li>
                <li>
                  Adaptar nuestros servicios y ofertas a sus preferencias.
                </li>
              </ul>
            </li>
            <li>
              <h3 className="font-bold text-xl text-indigo-600 mb-2">
                Para marketing y comunicaciones (con su consentimiento):
              </h3>
              <ul className="list-disc pl-8 space-y-2 text-gray-700">
                <li>
                  Enviar boletines informativos, promociones u otra información
                  que pueda ser de su interés, si ha optado por recibirlas.
                </li>
              </ul>
            </li>
            <li>
              <h3 className="font-bold text-xl text-indigo-600 mb-2">
                Para fines de seguridad y cumplimiento legal:
              </h3>
              <ul className="list-disc pl-8 space-y-2 text-gray-700">
                <li>
                  Proteger la seguridad de nuestro sitio web y prevenir fraudes.
                </li>
                <li>
                  Cumplir con nuestras obligaciones legales y regulatorias.
                </li>
                <li>
                  Resolver disputas y hacer cumplir nuestros Términos y
                  Condiciones.
                </li>
              </ul>
            </li>
          </ul>
        </section>

        {/* Sección 4 */}
        <section className="mb-10">
          <h2 className="text-3xl font-bold text-indigo-700 mb-4 mt-8 border-b-2 border-purple-300 pb-2">
            4. Base Legal para el Tratamiento
          </h2>
          <p className="text-gray-700 mb-4 leading-relaxed">
            Tratamos sus datos personales basándonos en las siguientes bases
            legales:
          </p>
          <ul className="list-disc pl-5 space-y-2 text-gray-700 mb-6">
            <li>
              <span className="font-semibold">Consentimiento:</span> Cuando
              usted nos da su consentimiento explícito para un propósito
              específico (ej., para recibir comunicaciones de marketing).
            </li>
            <li>
              <span className="font-semibold">
                Cumplimiento de un Contrato:
              </span>{" "}
              Cuando el tratamiento es necesario para ejecutar un contrato con
              usted (ej., procesar una reserva y el pago asociado).
            </li>
            <li>
              <span className="font-semibold">Obligación Legal:</span> Cuando el
              tratamiento es necesario para cumplir con una obligación legal
              (ej., mantener registros contables).
            </li>
            <li>
              <span className="font-semibold">Interés Legítimo:</span> Cuando
              tenemos un interés legítimo para tratar sus datos que no anula sus
              derechos y libertades fundamentales (ej., mejorar nuestros
              servicios, prevenir fraudes).
            </li>
          </ul>
        </section>

        {/* Sección 5 */}
        <section className="mb-10">
          <h2 className="text-3xl font-bold text-indigo-700 mb-4 mt-8 border-b-2 border-purple-300 pb-2">
            5. Cookies y Tecnologías de Seguimiento
          </h2>
          <p className="text-gray-700 mb-4 leading-relaxed">
            Utilizamos cookies y tecnologías de seguimiento similares para
            rastrear la actividad en nuestro servicio y mantener cierta
            información. Las cookies son pequeños archivos de datos que se
            almacenan en su dispositivo.
          </p>
          <ul className="list-disc pl-5 space-y-2 text-gray-700 mb-6">
            <li>
              <span className="font-semibold">Tipos de Cookies:</span>
              <ul className="list-disc pl-8 mt-2 space-y-1">
                <li>
                  **Cookies Esenciales:** Necesarias para el funcionamiento del
                  sitio web (ej., gestión de sesiones, carrito de compras).
                </li>
                <li>
                  **Cookies de Rendimiento/Analíticas:** Nos ayudan a entender
                  cómo los visitantes interactúan con el sitio web (ej., Google
                  Analytics).
                </li>
                <li>
                  **Cookies de Funcionalidad:** Para recordar sus preferencias
                  (ej., idioma).
                </li>
                <li>
                  **Cookies de Marketing/Publicidad:** Utilizadas para ofrecer
                  anuncios relevantes (si aplica).
                </li>
              </ul>
            </li>
          </ul>
          <p className="text-gray-700 mb-6 leading-relaxed">
            Usted puede configurar su navegador para rechazar todas las cookies
            o para indicar cuándo se envía una cookie. Sin embargo, si no acepta
            las cookies, es posible que no pueda utilizar algunas partes de
            nuestro servicio.
          </p>
        </section>

        {/* Sección 6 */}
        <section className="mb-10">
          <h2 className="text-3xl font-bold text-indigo-700 mb-4 mt-8 border-b-2 border-purple-300 pb-2">
            6. Compartición de Su Información Personal
          </h2>
          <p className="text-gray-700 mb-4 leading-relaxed">
            Podemos compartir su información personal con terceros en las
            siguientes circunstancias:
          </p>
          <ul className="list-disc pl-5 space-y-2 text-gray-700 mb-6">
            <li>
              **Proveedores de Servicios:** Compartimos información con terceros
              que nos prestan servicios para el funcionamiento de nuestro
              negocio (ej., procesadores de pagos como Transbank, proveedores de
              hosting, servicios de correo electrónico para notificaciones,
              plataformas de análisis como Google Analytics). Estos terceros
              están obligados contractualmente a proteger su información y
              utilizarla solo para los fines para los que se les proporcionó.
            </li>
            <li>
              **Terapeutas:** Compartimos la información de reserva necesaria
              (servicio, fecha, hora, nombre y teléfono del cliente) con el
              terapeuta con el que ha reservado para que puedan prestar el
              servicio.
            </li>
            <li>
              **Cumplimiento Legal y Aplicación de la Ley:** Podemos divulgar su
              información si así lo exige la ley o en respuesta a solicitudes
              válidas de autoridades públicas (ej., un tribunal o una agencia
              gubernamental).
            </li>
          </ul>
          <p className="text-gray-700 mb-6 leading-relaxed font-semibold">
            Nunca vendemos ni alquilamos su información personal a terceros.
          </p>
        </section>

        {/* Sección 7 */}
        <section className="mb-10">
          <h2 className="text-3xl font-bold text-indigo-700 mb-4 mt-8 border-b-2 border-purple-300 pb-2">
            7. Seguridad de los Datos
          </h2>
          <p className="text-gray-700 mb-6 leading-relaxed">
            La seguridad de sus datos es importante para nosotros. Empleamos
            medidas de seguridad técnicas y organizativas razonables para
            proteger su información personal contra el acceso no autorizado, la
            divulgación, alteración o destrucción. Esto incluye el uso de
            cifrado SSL/TLS en nuestro sitio web y el acceso restringido a los
            datos. Sin embargo, ninguna transmisión de datos por Internet o
            método de almacenamiento electrónico es 100% seguro.
          </p>
        </section>

        {/* Sección 8 */}
        <section className="mb-10">
          <h2 className="text-3xl font-bold text-indigo-700 mb-4 mt-8 border-b-2 border-purple-300 pb-2">
            8. Retención de Datos
          </h2>
          <p className="text-gray-700 mb-6 leading-relaxed">
            Retendremos su información personal solo durante el tiempo necesario
            para cumplir con los fines para los que la recopilamos, incluyendo
            el cumplimiento de cualquier obligación legal, contable o de
            informes. Cuando su información ya no sea necesaria, la eliminaremos
            de forma segura o la anonimizaremos.
          </p>
        </section>

        {/* Sección 9 */}
        <section className="mb-10">
          <h2 className="text-3xl font-bold text-indigo-700 mb-4 mt-8 border-b-2 border-purple-300 pb-2">
            9. Sus Derechos de Protección de Datos
          </h2>
          <p className="text-gray-700 mb-4 leading-relaxed">
            Usted tiene ciertos derechos con respecto a su información personal,
            de acuerdo con la legislación de protección de datos aplicable.
            Estos pueden incluir:
          </p>
          <ul className="list-disc pl-5 space-y-2 text-gray-700 mb-6">
            <li>
              **Derecho de Acceso:** Solicitar una copia de la información
              personal que tenemos sobre usted.
            </li>
            <li>
              **Derecho de Rectificación:** Solicitar que corrijamos cualquier
              información incompleta o inexacta que tengamos sobre usted.
            </li>
            <li>
              **Derecho de Supresión ("Derecho al Olvido"):** Solicitar que
              eliminemos o retiremos su información personal bajo ciertas
              condiciones.
            </li>
            <li>
              **Derecho de Oposición:** Oponerse al procesamiento de sus datos
              personales bajo ciertas condiciones.
            </li>
            <li>
              **Derecho a la Limitación del Tratamiento:** Solicitar la
              suspensión del procesamiento de sus datos personales bajo ciertas
              condiciones.
            </li>
            <li>
              **Derecho a la Portabilidad de Datos:** Solicitar que le
              proporcionemos sus datos personales en un formato estructurado, de
              uso común y lectura mecánica.
            </li>
          </ul>
          <p className="text-gray-700 mb-6 leading-relaxed">
            Para ejercer cualquiera de estos derechos, por favor contáctenos
            utilizando la información proporcionada en la Sección 1 de esta
            Política de Privacidad. Podríamos solicitarle que verifique su
            identidad antes de responder a dichas solicitudes.
          </p>
        </section>

        {/* Sección 10 */}
        <section className="mb-10">
          <h2 className="text-3xl font-bold text-indigo-700 mb-4 mt-8 border-b-2 border-purple-300 pb-2">
            10. Enlaces a Otros Sitios Web
          </h2>
          <p className="text-gray-700 mb-6 leading-relaxed">
            Nuestro sitio web puede contener enlaces a otros sitios web que no
            son operados por nosotros. Si hace clic en un enlace de un tercero,
            será dirigido al sitio de ese tercero. Le recomendamos
            encarecidamente que revise la Política de Privacidad de cada sitio
            que visite. No tenemos control ni asumimos responsabilidad alguna
            por el contenido, las políticas de privacidad o las prácticas de
            sitios o servicios de terceros.
          </p>
        </section>

        {/* Sección 11 */}
        <section className="mb-10">
          <h2 className="text-3xl font-bold text-indigo-700 mb-4 mt-8 border-b-2 border-purple-300 pb-2">
            11. Cambios a Esta Política de Privacidad
          </h2>
          <p className="text-gray-700 mb-6 leading-relaxed">
            Podemos actualizar nuestra Política de Privacidad de vez en cuando.
            Le notificaremos cualquier cambio publicando la nueva Política de
            Privacidad en esta página. Se le aconseja revisar esta Política de
            Privacidad periódicamente para cualquier cambio. Los cambios a esta
            Política de Privacidad son efectivos cuando se publican en esta
            página.
          </p>
        </section>
      </div>
    </div>
  );
};

export default PoliticasdePrivacidad;
