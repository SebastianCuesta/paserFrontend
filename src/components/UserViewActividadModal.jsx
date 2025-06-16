import React from "react";
import UserRespuestaModal from "./UserRespuestaModal";

const UserViewActividadModal = ({ actividad, onClose, onRefetch }) => {
  if (!actividad) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-4 backdrop-blur-sm bg-black/40"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl shadow-2xl w-full max-w-lg animate-fade-in transition-all overflow-auto max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Encabezado */}
        <div className="flex justify-between items-center border-b border-gray-200 px-6 py-4">
          <h2 className="text-2xl font-bold text-green-700">
            Detalles de la Actividad
          </h2>
          <button
            onClick={onClose}
            className="text-gray-600 hover:text-gray-800 text-xl"
          >
            &times;
          </button>
        </div>

        {/* Cuerpo: Información de la actividad */}
        <div className="px-6 py-4 space-y-4">
          <p>
            <span className="font-semibold">Nombre:</span> {actividad.nombre}
          </p>
          <p>
            <span className="font-semibold">Descripción:</span>{" "}
            {actividad.descripcion}
          </p>
          <p>
            <span className="font-semibold">Fecha Límite:</span>{" "}
            {new Date(actividad.fechaLimite).toLocaleDateString()}
          </p>
          {/* Archivos adjuntos de la actividad */}
          {actividad.archivosAdjuntos && actividad.archivosAdjuntos.length > 0 && (
            <div>
              <p className="font-semibold mb-2">Archivos adjuntos:</p>
              <ul className="space-y-2">
                {actividad.archivosAdjuntos.map((fileObj, idx) => (
                  <li key={idx}>
                    <a
                      href={
                        fileObj.url.startsWith("http")
                          ? fileObj.url
                          : `${import.meta.env.VITE_API_BASE_URL}${fileObj.url}`
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      {fileObj.originalname}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="border-t border-gray-200"></div>
{/* indicador de fecha limite */}
        {new Date(actividad.fechaLimite) < new Date() && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4">
            <p className="font-bold">¡Fecha límite pasada!</p>
            <p>La fecha límite para enviar evidencia era: {new Date(actividad.fechaLimite).toLocaleDateString()}</p>
            <p>Ya no puedes enviar respuestas para esta actividad.</p>
          </div>
        )}

        {/* {new Date(actividad.fechaLimite) >= new Date() && (
          <UserRespuestaModal
            actividad={actividad}
            onClose={onClose}
            onSuccess={() => {
              if (onRefetch) onRefetch();
            }}
          />
        )}         */}
        

        {/* Formulario para enviar/re-enviar evidencia */}
        <div className="px-6 py-4">
          <UserRespuestaModal
            actividad={actividad}
            onClose={onClose}
            onSuccess={() => {
              if (onRefetch) onRefetch();
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default UserViewActividadModal;
