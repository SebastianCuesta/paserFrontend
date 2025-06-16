// src/components/UserActividadTable.jsx
import React from "react";
import { FaClipboardList, FaSearch } from "react-icons/fa";
import { FaCheckCircle } from "react-icons/fa";

const UserActividadTable = ({
  actividades,
  onView,
  searchTerm,
  setSearchTerm,
  currentPage,
  totalPages,
  onPageChange,
  estadoRespuestas = {}, // { actividadId: estado }
}) => {
  return (
    <div className="bg-white p-4 sm:p-6 rounded-xl shadow-md w-full max-w-7xl mx-auto mt-6">
      <h2 className="text-xl sm:text-2xl font-bold text-green-700 mb-4 sm:mb-6 text-center flex items-center justify-center gap-2">
        <FaClipboardList /> Actividades Abiertas
      </h2>

      {/* Buscador */}
      <div className="relative max-w-sm mx-auto mb-4 sm:mb-6">
        <FaSearch className="absolute left-3 top-3 text-gray-400" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Buscar por nombre o fecha límite..."
          className="w-full pl-10 pr-4 py-2 text-sm sm:text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-200 focus:border-green-600"
        />
      </div>

      {/* Tabla, con scroll en pantallas pequeñas */}
      <div className="overflow-x-auto md:overflow-x-visible">
        <table className="table-auto w-full text-sm sm:text-base text-left border-separate border-spacing-y-2">
          <thead>
            <tr className="bg-green-600 text-white">
              <th className="px-3 sm:px-4 py-2 sm:py-3">Nombre</th>
              <th className="px-3 sm:px-4 py-2 sm:py-3">Fecha Límite</th>
              <th className="px-3 sm:px-4 py-2 sm:py-3 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {actividades.map((a) => {
              // Obtenemos el estado desde el mapa; si no existe, queda undefined
              const estado = estadoRespuestas[a._id.toString()];
              return (
                <tr
                  key={a._id}
                  className="bg-gray-50 hover:bg-green-50 transition"
                >
                  <td className="px-3 sm:px-4 py-2 sm:py-3 font-medium text-gray-900 truncate max-w-xs">
                    {a.nombre}
                  </td>
                  <td className="px-3 sm:px-4 py-2 sm:py-3 text-gray-700 truncate">
                    {new Date(a.fechaLimite).toLocaleDateString()}
                  </td>
                  <td className="px-3 sm:px-4 py-2 sm:py-3 text-center">
                    {estado === "Aprobado" ? (
                      <FaCheckCircle className="text-green-500 text-2xl mx-auto" />
                    ) : (
                      <button
                        onClick={() => onView(a)}
                        className="px-2 sm:px-3 py-1 sm:py-2 text-xs sm:text-sm font-medium text-white bg-blue-500 rounded hover:bg-blue-600 transition"
                      >
                        Ver
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Paginación (si hace falta) */}
      {totalPages > 1 && (
        <div className="mt-4 sm:mt-6 flex justify-center gap-2">
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i + 1}
              onClick={() => onPageChange(i + 1)}
              className={`px-2 sm:px-3 py-1 sm:py-2 rounded text-sm ${
                currentPage === i + 1
                  ? "bg-green-600 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserActividadTable;
