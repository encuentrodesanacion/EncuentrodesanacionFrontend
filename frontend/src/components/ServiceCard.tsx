import { FC } from "react";
import { TerapiaItem, OpcionSesion } from "../types";

interface ServiceCardProps {
  service: TerapiaItem;
  onReserve: (service: TerapiaItem) => void;
}

const ServiceCard: FC<ServiceCardProps> = ({ service, onReserve }) => {
  return (
    <div className="flip-wrapper">
      <div className="flip-card">
        <div className="flip-inner">
          <div className="flip-front">
            <img src={service.img} alt={service.title} />
            <div className="nombre-overlay">
              <p>{service.title}</p>
            </div>
          </div>
          <div className="flip-back">
            <h3 className="mb-2 font-bold">{service.title}</h3>
            <p className="mb-2">{service.description}</p>
            <form className="w-full px-2" onSubmit={(e) => e.preventDefault()}>
              {service.opciones && service.opciones.length > 0 ? (
                service.opciones.map((op: OpcionSesion, j: number) =>
                  service.isDisabled ? (
                    <button
                      key={j}
                      type="button"
                      disabled
                      className="w-full mt-4 px-2 py-2 border rounded bg-gray-400 text-white cursor-not-allowed"
                      title="No disponible para reserva"
                    >
                      No Disponible
                    </button>
                  ) : (
                    <button
                      key={j}
                      type="button"
                      onClick={() => onReserve(service)}
                      className="w-full mt-4 px-2 py-2 border rounded bg-pink-600 text-white hover:bg-pink-700 transition-colors duration-300"
                    >
                      {op.sesiones} Sesión (${op.precio.toLocaleString()} CLP)
                    </button>
                  )
                )
              ) : service.isDisabled ? (
                <button
                  type="button"
                  disabled
                  className="w-full mt-4 px-2 py-2 border rounded bg-gray-400 text-white cursor-not-allowed"
                  title="No disponible para reserva"
                >
                  No Disponible
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => onReserve(service)}
                  className="w-full mt-4 px-2 py-2 border rounded bg-pink-600 text-white hover:bg-pink-700 transition-colors duration-300"
                >
                  Toma de hora (${service.precio.toLocaleString()} CLP)
                </button>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceCard;
