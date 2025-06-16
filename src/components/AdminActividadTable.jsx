import React from "react";
import { FaClipboardList, FaSearch } from "react-icons/fa";

const AdminActividadTable = ({
  actividades,
  onEdit,
  onDelete,
  searchTerm,
  setSearchTerm,
  currentPage,
  totalPages,
  onPageChange,
}) => {
  return (
    <div className="bg-white p-4 sm:p-6 rounded-xl shadow-md w-full max-w-7xl mx-auto mt-6">
      <h2 className="text-xl sm:text-2xl font-bold text-green-700 mb-4 sm:mb-6 text-center flex items-center justify-center gap-2">
        <FaClipboardList /> Lista de Actividades
      </h2>

      <div className="relative max-w-sm mx-auto mb-4 sm:mb-6">
        <FaSearch className="absolute left-3 top-3 text-gray-400" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Buscar por nombre, fecha límite o descripción..."
          className="w-full pl-10 pr-4 py-2 text-sm sm:text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-200 focus:border-green-600"
        />
      </div>

      <div className="overflow-x-auto md:overflow-x-visible">
        <table className="table-auto w-full text-sm sm:text-base text-left border-separate border-spacing-y-2">
          <thead>
            <tr className="bg-green-600 text-white">
              <th className="px-3 sm:px-4 py-2 sm:py-3">Nombre</th>
              <th className="px-3 sm:px-4 py-2 sm:py-3">Descripción</th>
              <th className="px-3 sm:px-4 py-2 sm:py-3">Fecha Límite</th>
              <th className="px-3 sm:px-4 py-2 sm:py-3">Creado En</th>
              <th className="px-3 sm:px-4 py-2 sm:py-3 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {actividades.map((a) => (
              <tr
                key={a._id}
                className="bg-gray-50 hover:bg-green-50 transition"
              >
                <td className="px-3 sm:px-4 py-2 sm:py-3 font-medium text-gray-900 truncate max-w-xs">
                  {a.nombre}
                </td>
                <td className="px-3 sm:px-4 py-2 sm:py-3 text-gray-700 truncate max-w-sm">
                  {a.descripcion}
                </td>
                <td className="px-3 sm:px-4 py-2 sm:py-3 text-gray-700 whitespace-nowrap">
                  {new Date(a.fechaLimite).toLocaleDateString()}
                </td>
                <td className="px-3 sm:px-4 py-2 sm:py-3 text-gray-700 whitespace-nowrap">
                  {new Date(a.createdAt).toLocaleDateString()}
                </td>
                <td className="px-3 sm:px-4 py-2 sm:py-3 text-center space-x-1">
                  <button
                    onClick={() => onEdit(a)}
                    className="px-2 sm:px-4 py-1 sm:py-2 text-xs sm:text-sm font-medium text-white bg-yellow-500 rounded hover:bg-yellow-600 transition"
                  >
                    Editar 
                  </button>
                  <button
                    onClick={() => onDelete(a._id)}
                    className="px-2 sm:px-3 py-1 sm:py-2 text-xs sm:text-sm font-medium text-white bg-red-600 rounded hover:bg-red-700 transition"
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

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

export default AdminActividadTable;
