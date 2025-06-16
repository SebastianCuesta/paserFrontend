import React from "react";

const AdminEditUserModal = ({
  mode,          // "edit" | "create"
  selectedUser,
  onClose,
  onChange,
  onSave,
  onCreate,
}) => {
  if (!selectedUser) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-4 backdrop-blur-sm bg-black/40"
      onClick={onClose}
    >
      <div
        className="bg-white p-6 rounded-xl shadow-2xl w-full max-w-lg animate-fade-in transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-2xl font-bold mb-6 text-center text-green-700">
          {mode === "edit" ? "Editar Usuario" : "Crear Usuario"}
        </h2>

        <div className="grid grid-cols-1  md:grid-cols-2 gap-4">
          {/* Nombres */}
          <input
            type="text"
            value={selectedUser.nombres}
            onChange={(e) =>
              onChange({ ...selectedUser, nombres: e.target.value })
            }
            placeholder="Nombres"
            className="w-full border border-gray-300 rounded px-4 py-2 focus:ring-2 focus:ring-green-200 focus:border-green-600 outline-none"
          />

          {/* Apellidos */}
          <input
            type="text"
            value={selectedUser.apellidos}
            onChange={(e) =>
              onChange({ ...selectedUser, apellidos: e.target.value })
            }
            placeholder="Apellidos"
            className="w-full border border-gray-300 rounded px-4 py-2 focus:ring-2 focus:ring-green-200 focus:border-green-600 outline-none"
          />

          {/* Tipo de Identificación */}
          <select
            value={selectedUser.tipoIdentificacion}
            onChange={(e) =>
              onChange({
                ...selectedUser,
                tipoIdentificacion: e.target.value,
              })
            }
            className="w-full border border-gray-300 rounded px-4 py-2 focus:ring-2 focus:ring-green-200 focus:border-green-600 outline-none"
          >
            <option value="">Seleccionar Tipo ID</option>
            <option value="CC">CC</option>
            <option value="TI">TI</option>
            <option value="PPT">PPT</option>
            <option value="CE">CE</option>
          </select>

          {/* Número de Identificación */}
          <input
            type="number"
            value={selectedUser.identificacion}
            onChange={(e) =>
              onChange({
                ...selectedUser,
                identificacion: e.target.value,
              })
            }
            placeholder="Número de Identificación"
            className="w-full border border-gray-300 rounded px-4 py-2 focus:ring-2 focus:ring-green-200 focus:border-green-600 outline-none"
          />

          {/* Teléfono */}
          <input
            type="number"
            value={selectedUser.numTelefono}
            onChange={(e) =>
              onChange({
                ...selectedUser,
                numTelefono: e.target.value,
              })
            }
            placeholder="Número de Teléfono"
            className="w-full border border-gray-300 rounded px-4 py-2 focus:ring-2 focus:ring-green-200 focus:border-green-600 outline-none"
          />

          {/* Correo */}
          <input
            type="email"
            value={selectedUser.correo}
            onChange={(e) =>
              onChange({ ...selectedUser, correo: e.target.value })
            }
            placeholder="Correo"
            className="w-full border border-gray-300 rounded px-4 py-2 focus:ring-2 focus:ring-green-200 focus:border-green-600 outline-none"
          />

          {/* Programa de Formación */}
          <input
            type="text"
            value={selectedUser.programaFormacion}
            onChange={(e) =>
              onChange({
                ...selectedUser,
                programaFormacion: e.target.value,
              })
            }
            placeholder="Programa de Formación"
            className="w-full border border-gray-300 rounded px-4 py-2 focus:ring-2 focus:ring-green-200 focus:border-green-600 outline-none"
          />

          {/* Número de Ficha */}
          <input
            type="number"
            value={selectedUser.numeroFicha}
            onChange={(e) =>
              onChange({
                ...selectedUser,
                numeroFicha: e.target.value,
              })
            }
            placeholder="Número de Ficha"
            className="w-full border border-gray-300 rounded px-4 py-2 focus:ring-2 focus:ring-green-200 focus:border-green-600 outline-none"
          />

          {/* Jornada */}
          <select
            value={selectedUser.jornada}
            onChange={(e) =>
              onChange({ ...selectedUser, jornada: e.target.value })
            }
            className="w-full border border-gray-300 rounded px-4 py-2 focus:ring-2 focus:ring-green-200 focus:border-green-600 outline-none"
          >
            <option value="">Seleccionar Jornada</option>
            <option value="Mañana">Mañana</option>
            <option value="Tarde">Tarde</option>
            <option value="Noche">Noche</option>
          </select>

          {/* Rol */}
          <select
            value={selectedUser.rol}
            onChange={(e) =>
              onChange({ ...selectedUser, rol: e.target.value })
            }
            className="w-full border border-gray-300 rounded px-4 py-2 focus:ring-2 focus:ring-green-200 focus:border-green-600 outline-none"
          >
            <option value="">Seleccionar Rol</option>
            <option value="user">Usuario</option>
            <option value="admin">Administrador</option>
          </select>

          {/* Estado */}
          <select
            value={selectedUser.estado}
            onChange={(e) =>
              onChange({ ...selectedUser, estado: e.target.value })
            }
            className="w-full border border-gray-300 rounded px-4 py-2 focus:ring-2 focus:ring-green-200 focus:border-green-600 outline-none"
          >
            <option value="">Seleccionar Estado</option>
            <option value="activo">Activo</option>
            <option value="inactivo">Inactivo</option>
          </select>
        </div>

        <div className="mt-6 flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition"
          >
            Cancelar
          </button>
          {mode === "edit" ? (
            <button
              onClick={onSave}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
            >
              Guardar Cambios
            </button>
          ) : (
            <button
              onClick={onCreate}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
            >
              Crear Usuario
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminEditUserModal;
