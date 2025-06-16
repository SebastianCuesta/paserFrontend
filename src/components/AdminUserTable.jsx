// src/components/AdminUserTable.js
import React from "react";
import { FaUsers, FaSearch } from "react-icons/fa";

const AdminUserTable = ({
  usuarios,
  onEdit,
  onDelete,
  searchTerm,
  setSearchTerm,
  currentPage,
  totalPages,
  onPageChange,
}) => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-md w-full max-w-7xl mx-auto mt-6">
      <h2 className="text-2xl font-bold text-green-700 mb-6 text-center flex items-center justify-center gap-2">
        <FaUsers /> Lista de Usuarios
      </h2>

      <div className="relative max-w-sm mx-auto mb-6">
        <FaSearch className="absolute left-3 top-3 text-gray-400" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Buscar por nombre, identificación o correo..."
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-200 focus:border-green-600"
        />
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-[900px] w-full text-sm text-left border-separate border-spacing-y-2">
          <thead>
            <tr className="bg-green-600 text-white">
              <th className="px-4 py-3">Nombres</th>
              <th className="px-4 py-3">Apellidos</th>
              <th className="px-4 py-3">Identificación</th>
              <th className="px-4 py-3">Estado</th>
              <th className="px-4 py-3">Teléfono</th>
              <th className="px-4 py-3">Nº Ficha</th>
              <th className="px-4 py-3">Correo</th>
              <th className="px-4 py-3">Rol</th>
              <th className="px-4 py-3 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {usuarios.map((u) => (
              <tr
                key={u._id}
                className="bg-gray-50 hover:bg-green-50 rounded transition"
              >
                <td className="px-4 py-3 font-medium text-gray-900">{u.nombres}</td>
                <td className="px-4 py-3 text-gray-700">{u.apellidos}</td>
                <td className="px-4 py-3 text-gray-700">{u.identificacion}</td>
                <td className="px-4 py-3 text-gray-700">{u.estado}</td>
                <td className="px-4 py-3 text-gray-700">{u.numTelefono}</td>
                <td className="px-4 py-3 text-gray-700">{u.numeroFicha}</td>
                <td className="px-4 py-3 text-gray-700">{u.correo}</td>
                <td className="px-4 py-3 capitalize text-gray-700">{u.rol}</td>
                <td className="px-4 py-3 text-center space-x-2">
                  <button
                    onClick={() => onEdit(u)}
                    className="px-3 py-1 text-sm font-medium text-white bg-yellow-500 rounded hover:bg-yellow-600 transition"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => onDelete(u._id)}
                    className="px-3 py-1 text-sm font-medium text-white bg-red-600 rounded hover:bg-red-700 transition"
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
        <div className="mt-6 flex justify-center gap-2">
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i + 1}
              onClick={() => onPageChange(i + 1)}
              className={`px-3 py-1 rounded ${
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

export default AdminUserTable;
