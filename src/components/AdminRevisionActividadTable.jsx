import React from "react";
import { FaSearch } from "react-icons/fa";

const AdminRevisionActividadTable = ({ respuestas, onReview }) => {
  return (
    <div className="bg-white p-4 sm:p-6 rounded-xl shadow-md w-full max-w-7xl mx-auto mt-6">
      <h2 className="text-xl sm:text-2xl font-bold text-green-700 mb-4 sm:mb-6 text-center flex items-center justify-center gap-2">
        <FaSearch /> Respuestas Entregadas
      </h2>

      <div className="overflow-x-auto">
        <table className="table-auto w-full text-sm sm:text-base text-left border-separate border-spacing-y-2">
          <thead>
            <tr className="bg-green-600 text-white">
              <th className="px-3 sm:px-4 py-2 sm:py-3">Aprendiz</th>
              <th className="px-3 sm:px-4 py-2 sm:py-3">Actividad</th>
              <th className="px-3 sm:px-4 py-2 sm:py-3">Fecha Entrega</th>
              <th className="px-3 sm:px-4 py-2 sm:py-3">Estado</th>
              <th className="px-3 sm:px-4 py-2 sm:py-3 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {respuestas.map((r) => (
              <tr
                key={r._id}
                className="bg-gray-50 hover:bg-green-50 transition"
              >
                <td className="px-3 sm:px-4 py-2 sm:py-3 text-gray-900 truncate max-w-xs">
                  {r.aprendiz.nombres} {r.aprendiz.apellidos}
                </td>
                <td className="px-3 sm:px-4 py-2 sm:py-3 text-gray-700 truncate max-w-xs">
                  {r.actividad.nombre}
                </td>
                <td className="px-3 sm:px-4 py-2 sm:py-3 text-gray-700 whitespace-nowrap">
                  {new Date(r.fechaEnvio).toLocaleString()}
                </td>
                <td
                  className={`px-3 sm:px-4 py-2 sm:py-3 font-medium ${
                    r.estado === "Aprobado"
                      ? "text-green-600"
                      : r.estado === "Reprobado"
                      ? "text-red-600"
                      : "text-yellow-600"
                  }`}
                >
                  {r.estado}
                </td>
                <td className="px-3 sm:px-4 py-2 sm:py-3 text-center">
                  <button
                    onClick={() => onReview(r)}
                    className="px-2 sm:px-3 py-1 sm:py-2 text-xs sm:text-sm font-medium text-white bg-blue-500 rounded hover:bg-blue-600 transition"
                  >
                    Revisar
                  </button>
                </td>
              </tr>
            ))}
            {respuestas.length === 0 && (
              <tr>
                <td
                  colSpan={5}
                  className="px-3 sm:px-4 py-4 text-center text-gray-500"
                >
                  No hay respuestas para esta actividad.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminRevisionActividadTable;
