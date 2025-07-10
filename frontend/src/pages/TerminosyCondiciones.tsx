import React from "react";

const TerminosYCondiciones: React.FC = () => {
  return (
    <div className="bg-gradient-to-br from-purple-100 via-pink-100 to-blue-100 min-h-screen py-16 px-4 sm:px-6 lg:px-8 flex justify-center items-start">
      <div className="max-w-4xl mx-auto bg-white shadow-2xl rounded-xl p-8 md:p-12 border border-gray-200">
        <h1 className="text-4xl font-extrabold text-indigo-800 mb-6 text-center tracking-tight">
          Términos y Condiciones de Servicio de Encuentro de Sanación
        </h1>
        <p className="text-gray-500 text-sm mb-10 text-center italic">
          Fecha de entrada en vigor: 8 de julio de 2025
        </p>

        <p className="text-gray-700 mb-8 leading-relaxed text-lg">
          Bienvenido a Encuentro de Sanación, operado a través de{" "}
          <a
            href="https://www.encuentrodesanacion.com"
            className="text-purple-600 hover:text-purple-800 hover:underline transition-colors duration-200"
            target="_blank"
            rel="noopener noreferrer"
          >
            www.encuentrodesanacion.com
          </a>{" "}
          (en adelante, "el Sitio"). Estos Términos y Condiciones de Servicio
          (en adelante, los "Términos") rigen su acceso y uso de nuestro Sitio y
          los servicios de terapia y bienestar que ofrecemos.
        </p>
        <p className="text-gray-700 mb-8 leading-relaxed text-lg">
          Al acceder, navegar o utilizar este Sitio, así como al realizar una
          reserva o comprar nuestros servicios, usted ("el Usuario" o "usted")
          acepta estar legalmente vinculado por estos Términos, nuestra Política
          de Privacidad y cualquier otra política o directriz publicada en el
          Sitio. Si no está de acuerdo con alguna parte de estos Términos, no
          debe utilizar el Sitio ni nuestros servicios.
        </p>

        {/* Sección 1 */}
        <section className="mb-10">
          <h2 className="text-3xl font-bold text-indigo-700 mb-4 mt-8 border-b-2 border-purple-300 pb-2">
            1. Aceptación de los Términos
          </h2>
          <p className="text-gray-700 mb-6 leading-relaxed">
            El uso del Sitio y la adquisición de cualquiera de los servicios
            ofrecidos por Encuentro de Sanación constituyen una aceptación plena
            y sin reservas de estos Términos y Condiciones.
          </p>
        </section>

        {/* Sección 2 */}
        <section className="mb-10">
          <h2 className="text-3xl font-bold text-indigo-700 mb-4 mt-8 border-b-2 border-purple-300 pb-2">
            2. Descripción de los Servicios
          </h2>
          <p className="text-gray-700 mb-4 leading-relaxed">
            Encuentro de Sanación es una plataforma que facilita la reserva y
            acceso a diversos servicios de terapia y bienestar (en adelante, los
            "Servicios"), ofrecidos por profesionales independientes (en
            adelante, los "Terapeutas"). Nuestros Servicios pueden incluir,
            entre otros: [Ofrendas de Terapias a valor amoroso, Talleres
            Mensuales, Formación de Terapeutas de la Luz, Tratamientos
            Integrales, Alianzas].
          </p>
          <p className="text-gray-700 mb-6 leading-relaxed">
            Nos esforzamos por proporcionar descripciones precisas de los
            Servicios, incluyendo precios, duración y cualquier otro detalle
            relevante. Sin embargo, nos reservamos el derecho de modificar la
            oferta de Servicios, precios y disponibilidad en cualquier momento
            sin previo aviso.
          </p>
        </section>

        {/* Sección 3 */}
        <section className="mb-10">
          <h2 className="text-3xl font-bold text-indigo-700 mb-4 mt-8 border-b-2 border-purple-300 pb-2">
            3. Proceso de Reserva y Pago
          </h2>
          <ul className="list-disc pl-5 space-y-3 text-gray-700 mb-6">
            <li>
              <span className="font-semibold">Disponibilidad:</span> Las
              reservas están sujetas a la disponibilidad de los Terapeutas y los
              horarios publicados en el Sitio.
            </li>
            <li>
              <span className="font-semibold">Información del Usuario:</span>{" "}
              Para realizar una reserva, se le solicitará proporcionar
              información personal veraz y completa (nombre, número de
              teléfono). Usted es responsable de la exactitud de la información
              proporcionada.
            </li>
            <li>
              <span className="font-semibold">Precios:</span> Los precios de los
              Servicios se muestran en pesos chilenos (CLP) e incluyen todos los
              impuestos aplicables, a menos que se indique lo contrario.
            </li>
            <li>
              <span className="font-semibold">Procesamiento de Pagos:</span> Los
              pagos por los Servicios se procesan a través de una pasarela de
              pago de terceros, Transbank Webpay Plus. Al iniciar una
              transacción, usted acepta los términos y condiciones de Transbank.
              Encuentro de Sanación no almacena información sensible de tarjetas
              de crédito o débito.
            </li>
            <li>
              <span className="font-semibold">Confirmación de Reserva:</span>{" "}
              Una reserva se considerará confirmada únicamente una vez que el
              pago haya sido aprobado por Transbank.
            </li>
          </ul>
        </section>

        {/* Sección 4 */}
        <section className="mb-10">
          <h2 className="text-3xl font-bold text-indigo-700 mb-4 mt-8 border-b-2 border-purple-300 pb-2">
            4. Políticas de Cancelación, Modificación y Reembolso
          </h2>
          <h3 className="font-bold text-xl text-indigo-600 mb-2">
            Cancelación por el Usuario:
          </h3>
          <ul className="list-disc pl-5 space-y-2 text-gray-700 mb-4">
            <li>
              Las cancelaciones realizadas con [24 horas] o más de anticipación
              a la hora de la reserva podrán optar a [ej., un reembolso completo
              o un crédito para futuras reservas].
            </li>
            <li>
              Las cancelaciones realizadas con menos de [24 horas] de
              anticipación o la no comparecencia a la cita ("no-show") no serán
              elegibles para reembolso y el monto pagado por el Servicio será
              cobrado en su totalidad.
            </li>
            <li>
              Para solicitar una cancelación, el Usuario debe contactar a
              Encuentro de Sanación a través de [correo electrónico o número de
              teléfono].
            </li>
          </ul>
          <h3 className="font-bold text-xl text-indigo-600 mb-2">
            Modificación de Reserva por el Usuario:
          </h3>
          <ul className="list-disc pl-5 space-y-2 text-gray-700 mb-4">
            <li>
              Las modificaciones de fecha u hora de una reserva están sujetas a
              la disponibilidad del Terapeuta y deberán solicitarse con al menos
              [24 horas] de anticipación.
            </li>
          </ul>
          <h3 className="font-bold text-xl text-indigo-600 mb-2">
            Cancelación por Encuentro de Sanación / Terapeuta:
          </h3>
          <ul className="list-disc pl-5 space-y-2 text-gray-700 mb-4">
            <li>
              En caso de que una reserva deba ser cancelada por Encuentro de
              Sanación o por el Terapeuta por motivos de fuerza mayor o
              indisponibilidad, se le ofrecerá al Usuario la opción de
              reprogramar la cita o un reembolso completo del monto pagado.
            </li>
          </ul>
          <h3 className="font-bold text-xl text-indigo-600 mb-2">
            Proceso de Reembolso:
          </h3>
          <ul className="list-disc pl-5 space-y-2 text-gray-700 mb-6">
            <li>
              Los reembolsos, cuando sean aplicables según estas políticas, se
              emitirán a través de Transferencia Electrónica (descontando el IVA
              generado por la venta del servicio.) pueden tomar de [3 a 7] días
              hábiles en reflejarse en su cuenta bancaria, dependiendo de los
              tiempos de procesamiento de su banco.
            </li>
          </ul>
        </section>

        {/* Sección 5 */}
        <section className="mb-10">
          <h2 className="text-3xl font-bold text-indigo-700 mb-4 mt-8 border-b-2 border-purple-300 pb-2">
            5. Conducta del Usuario
          </h2>
          <p className="text-gray-700 mb-4 leading-relaxed">
            El Usuario se compromete a utilizar el Sitio y los Servicios de
            manera responsable, lícita y de acuerdo con estos Términos. El
            Usuario no podrá:
          </p>
          <ul className="list-disc pl-5 space-y-2 text-gray-700 mb-6">
            <li>Realizar reservas fraudulentas o especulativas.</li>
            <li>Utilizar el Sitio para fines ilegales o no autorizados.</li>
            <li>Interferir con el funcionamiento del Sitio o los Servicios.</li>
            <li>
              Infringir los derechos de propiedad intelectual de Encuentro de
              Sanación o de terceros. El ejercicio de actos que vulneren dichos
              derechos incurrirá en responsabilidad legal y podrá dar lugar a
              reclamaciones judiciales, incluyendo, pero no limitado a,
              solicitudes de indemnización por daños y perjuicios, honorarios
              legales y costos asociados.
            </li>
          </ul>
        </section>

        {/* Sección 6 */}
        <section className="mb-10">
          <h2 className="text-3xl font-bold text-indigo-700 mb-4 mt-8 border-b-2 border-purple-300 pb-2">
            6. Responsabilidad de Encuentro de Sanación
          </h2>
          <h3 className="font-bold text-xl text-indigo-600 mb-2">
            Plataforma de Intermediación:
          </h3>
          <p className="text-gray-700 mb-4 leading-relaxed">
            Encuentro de Sanación actúa como una plataforma de intermediación
            entre los Usuarios y los Terapeutas. No somos prestadores directos
            de los servicios de terapia o bienestar.
          </p>
          <h3 className="font-bold text-xl text-indigo-600 mb-2">
            Limitación de Responsabilidad:
          </h3>
          <p className="text-gray-700 mb-4 leading-relaxed">
            La responsabilidad de Encuentro de Sanación se limita a la operación
            del Sitio y la facilitación de las reservas y pagos. No somos
            responsables directos por:
          </p>
          <ul className="list-disc pl-5 space-y-2 text-gray-700 mb-6">
            <li>
              La calidad, idoneidad o resultados de los Servicios prestados por
              los Terapeutas.
            </li>
            <li>
              Cualquier daño o perjuicio derivado de la relación entre el
              Usuario y el Terapeuta.
            </li>
            <li>
              Interrupciones o errores en el Sitio o la pasarela de pago de
              terceros, salvo en lo que legalmente nos corresponda.
            </li>
          </ul>
          <h3 className="font-bold text-xl text-indigo-600 mb-2">
            Exclusión de Garantías:
          </h3>
          <p className="text-gray-700 mb-6 leading-relaxed">
            El Sitio y los Servicios se proporcionan "tal cual" y "según
            disponibilidad", sin garantías de ningún tipo, expresas o
            implícitas.
          </p>
        </section>

        {/* Sección 7 */}
        <section className="mb-10">
          <h2 className="text-3xl font-bold text-indigo-700 mb-4 mt-8 border-b-2 border-purple-300 pb-2">
            7. Propiedad Intelectual
          </h2>
          <p className="text-gray-700 mb-6 leading-relaxed">
            Todos los derechos de propiedad intelectual sobre el contenido del
            Sitio (textos, gráficos, logotipos, imágenes, videos, software,
            etc.) son propiedad exclusiva de Encuentro de Sanación o de sus
            licenciantes. Queda prohibida la reproducción, distribución,
            modificación o cualquier otro uso no autorizado de dicho contenido.
          </p>
        </section>

        {/* Sección 8 */}
        <section className="mb-10">
          <h2 className="text-3xl font-bold text-indigo-700 mb-4 mt-8 border-b-2 border-purple-300 pb-2">
            8. Enlaces a Terceros
          </h2>
          <p className="text-gray-700 mb-6 leading-relaxed">
            El Sitio puede contener enlaces a sitios web o servicios de terceros
            que no son operados por Encuentro de Sanación. No tenemos control
            sobre, ni asumimos responsabilidad por, el contenido, las políticas
            de privacidad o las prácticas de cualquier sitio o servicio de
            terceros.
          </p>
        </section>

        {/* Sección 9 */}
        <section className="mb-10">
          <h2 className="text-3xl font-bold text-indigo-700 mb-4 mt-8 border-b-2 border-purple-300 pb-2">
            9. Modificaciones de los Términos
          </h2>
          <p className="text-gray-700 mb-6 leading-relaxed">
            Nos reservamos el derecho de modificar estos Términos en cualquier
            momento. Cualquier cambio será efectivo inmediatamente después de su
            publicación en el Sitio. Le recomendamos revisar estos Términos
            periódicamente para estar al tanto de cualquier actualización. Su
            uso continuado del Sitio después de la publicación de los cambios
            constituirá su aceptación de los Términos modificados.
          </p>
        </section>

        {/* Sección 10 */}
        <section className="mb-10">
          <h2 className="text-3xl font-bold text-indigo-700 mb-4 mt-8 border-b-2 border-purple-300 pb-2">
            10. Ley Aplicable y Jurisdicción
          </h2>
          <p className="text-gray-700 mb-6 leading-relaxed">
            Estos Términos se regirán e interpretarán de acuerdo con las leyes
            de la República de Chile. Cualquier disputa que surja en relación
            con estos Términos o el uso del Sitio y los Servicios será sometida
            a la jurisdicción exclusiva de los tribunales de la ciudad de
            Santiago, Chile.
          </p>
        </section>

        {/* Sección 11 */}
        <section className="mb-10">
          <h2 className="text-3xl font-bold text-indigo-700 mb-4 mt-8 border-b-2 border-purple-300 pb-2">
            11. Contacto
          </h2>
          <p className="text-gray-700 mb-4 leading-relaxed">
            Si tiene alguna pregunta sobre estos Términos, por favor contáctenos
            en:
          </p>
          <div className="bg-indigo-50 p-6 rounded-lg border border-indigo-200 shadow-sm">
            <p className="text-gray-700 mb-1">
              <span className="font-semibold">Correo Electrónico:</span>{" "}
              <a
                href="mailto:[Insertar correo electrónico de contacto, ej., contacto@encuentrodesanacion.com]"
                className="text-purple-600 hover:text-purple-800 hover:underline transition-colors duration-200"
              >
                [spaholistico@encuentrodesanacion.com]
              </a>
            </p>
            <p className="text-gray-700">
              <span className="font-semibold">Teléfono:</span> [+569 7655 7902]
            </p>
          </div>
        </section>
      </div>
    </div>
  );
};

export default TerminosYCondiciones;
