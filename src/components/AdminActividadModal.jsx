import React, { useState, useEffect } from "react";
import { FaFilePdf, FaFileAlt, FaTimesCircle } from "react-icons/fa";

// La variable de entorno definida en .env
const BACKEND_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const AdminActividadModal = ({
  mode,                // "create" | "edit"
  selectedActividad,
  onClose,
  onChange,
  onSave,
  onCreate,
}) => {
  // Archivos recién seleccionados (instancias File)
  const [filesToUpload, setFilesToUpload] = useState([]);

  // Archivos previos (modo "edit"), recibidos del servidor como objetos con { url, originalname, filename }
  const [existingFiles, setExistingFiles] = useState([]);

  useEffect(() => {
    // Si estamos en modo edición y "selectedActividad.archivosAdjuntos" es un array
    // de objetos (no de File), los consideramos como archivos ya guardados
    if (
      mode === "edit" &&
      Array.isArray(selectedActividad.archivosAdjuntos) &&
      selectedActividad.archivosAdjuntos.length > 0 &&
      !(selectedActividad.archivosAdjuntos[0] instanceof File)
    ) {
      setExistingFiles(selectedActividad.archivosAdjuntos);
    } else {
      setExistingFiles([]);
    }
    setFilesToUpload([]);
  }, [selectedActividad, mode]);

  const handleFileChange = (e) => {
    const nuevos = Array.from(e.target.files);
    const combinados = [...filesToUpload, ...nuevos];
    setFilesToUpload(combinados);
    onChange({ ...selectedActividad, archivosAdjuntos: combinados });
  };

  // Eliminar un archivo recién seleccionado antes de enviarlo
  const removeNewFile = (idx) => {
    const filtrados = filesToUpload.filter((_, i) => i !== idx);
    setFilesToUpload(filtrados);
    onChange({ ...selectedActividad, archivosAdjuntos: filtrados });
  };

  // Eliminar un archivo que ya existía en el servidor (modo "edit")
  const removeExistingFile = (idx) => {
    const filtrados = existingFiles.filter((_, i) => i !== idx);
    setExistingFiles(filtrados);
    onChange({
      ...selectedActividad,
      archivosAdjuntos: filtrados,
    });
  };

  if (!selectedActividad) return null;

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
          {mode === "edit" ? "Editar Actividad" : "Crear Actividad"}
        </h2>

        <div className="grid grid-cols-1 gap-4">
          {/* Campo: Nombre */}
          <input
            type="text"
            value={selectedActividad.nombre}
            onChange={(e) =>
              onChange({ ...selectedActividad, nombre: e.target.value })
            }
            placeholder="Nombre de la actividad"
            className="w-full border border-gray-300 rounded px-4 py-2 focus:ring-2 focus:ring-green-200 focus:border-green-600 outline-none"
          />

          {/* Campo: Descripción */}
          <textarea
            value={selectedActividad.descripcion}
            onChange={(e) =>
              onChange({ ...selectedActividad, descripcion: e.target.value })
            }
            placeholder="Descripción detallada"
            rows={4}
            className="w-full border border-gray-300 rounded px-4 py-2 focus:ring-2 focus:ring-green-200 focus:border-green-600 outline-none"
          />

          {/* Campo: Fecha Límite */}
          <input
            type="date"
            value={
              selectedActividad.fechaLimite
                ? new Date(selectedActividad.fechaLimite).toISOString().split('T')[0]
                : ""
            }
            onChange={(e) =>
              onChange({ ...selectedActividad, fechaLimite: e.target.value })
            }
            className="w-full border border-gray-300 rounded px-4 py-2 focus:ring-2 focus:ring-green-200 focus:border-green-600 outline-none"
          />

          {/* Campo: Archivos Adjuntos */}
          <div>
            <label className="block text-gray-700 mb-1 font-medium">
              Archivos Adjuntos (opcional)
            </label>
            <input
              type="file"
              multiple
              onChange={handleFileChange}
              className="w-full"
            />
            {mode === "edit" && existingFiles.length > 0 && (
              <p className="mt-1 text-gray-500 text-xs">
                Archivos previos mostrados abajo. Para eliminar, haz clic en la X.
              </p>
            )}
          </div>

          {/* Vista previa de los archivos recién seleccionados */}
          {filesToUpload.length > 0 && (
            <div className="mt-2">
              <p className="text-gray-700 mb-1 font-medium">
                Archivos a subir:
              </p>
              <ul className="space-y-2 max-h-40 overflow-y-auto">
                {filesToUpload.map((file, idx) => (
                  <li
                    key={idx}
                    className="flex items-center justify-between bg-gray-100 px-3 py-2 rounded"
                  >
                    <div className="flex items-center space-x-2">
                      {file.type.startsWith("image/") ? (
                        <img
                          src={URL.createObjectURL(file)}
                          alt={file.name}
                          className="h-8 w-8 object-cover rounded"
                        />
                      ) : file.type === "application/pdf" ? (
                        <FaFilePdf className="text-red-500 text-xl" />
                      ) : (
                        <FaFileAlt className="text-gray-500 text-xl" />
                      )}
                      <span className="truncate max-w-xs">{file.name}</span>
                    </div>
                    <button
                      onClick={() => removeNewFile(idx)}
                      className="text-red-500 hover:text-red-700"
                      title="Eliminar"
                    >
                      <FaTimesCircle />
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Vista previa de los archivos existentes en modo "edit" */}
          {mode === "edit" && existingFiles.length > 0 && (
            <div className="mt-4">
              <p className="text-gray-700 mb-1 font-medium">
                Archivos actuales:
              </p>
              <ul className="space-y-2 max-h-40 overflow-y-auto">
                {existingFiles.map((fileObj, idx) => (
                  <li
                    key={idx}
                    className="flex items-center justify-between bg-gray-100 px-3 py-2 rounded"
                  >
                    <div className="flex items-center space-x-2">
                      {fileObj.url.match(/\.(jpg|jpeg|png|gif)$/i) ? (
                        <img
                          src={`${BACKEND_BASE_URL}${fileObj.url}`}
                          alt={fileObj.originalname}
                          className="h-8 w-8 object-cover rounded"
                        />
                      ) : fileObj.url.match(/\.pdf$/i) ? (
                        <FaFilePdf className="text-red-500 text-xl" />
                      ) : (
                        <FaFileAlt className="text-gray-500 text-xl" />
                      )}
                      <a
                        href={`${BACKEND_BASE_URL}${fileObj.url}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="truncate max-w-xs text-blue-600 hover:underline"
                      >
                        {fileObj.originalname}
                      </a>
                    </div>
                    <button
                      onClick={() => removeExistingFile(idx)}
                      className="text-red-500 hover:text-red-700"
                      title="Eliminar archivo existente"
                    >
                      <FaTimesCircle />
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
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
              Crear Actividad
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminActividadModal;
