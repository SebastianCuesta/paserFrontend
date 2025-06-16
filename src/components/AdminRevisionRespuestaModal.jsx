import React, { useState } from "react";
import axios from "axios";
import { FaFilePdf, FaFileAlt, FaTimesCircle } from "react-icons/fa";
import { toast } from "react-toastify";

// BACKEND_BASE_URL para enlaces de descarga de la evidencia
const BACKEND_BASE_URL = import.meta.env.VITE_BACKEND_URL;

const AdminRevisionRespuestaModal = ({ respuesta, onClose }) => {
  const [estado, setEstado] = useState(respuesta.estado || "Pendiente");
  const [comentario, setComentario] = useState(respuesta.comentario || "");
  const [submitting, setSubmitting] = useState(false);

  // 1) Función para aprobar o rechazar
  const handleSubmit = async () => {
    if (estado !== "Aprobado" && estado !== "Reprobado") {
      toast.error("Selecciona Aprobado o Reprobado");
      return;
    }
    setSubmitting(true);
    try {
      const payload = { estado, comentario };
      await axios.put(
        `http://localhost:5000/api/actividades/respuestas/${respuesta._id}`,
        payload
      );
      toast.success(`Respuesta marcada como ${estado}`);
      onClose();
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Error al actualizar estado");
    } finally {
      setSubmitting(false);
    }
  };

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
            Revisión de Evidencia
          </h2>
          <button
            onClick={onClose}
            className="text-gray-600 hover:text-gray-800 text-xl"
          >
            &times;
          </button>
        </div>

        {/* Cuerpo */}
        <div className="px-6 py-4 space-y-4">
          <p>
            <span className="font-semibold">Aprendiz:</span>{" "}
            {respuesta.aprendiz.nombres} {respuesta.aprendiz.apellidos}
          </p>
          <p>
            <span className="font-semibold">Actividad:</span>{" "}
            {respuesta.actividad.nombre}
          </p>
          <p>
            <span className="font-semibold">Fecha Entrega:</span>{" "}
            {new Date(respuesta.fechaEnvio).toLocaleString()}
          </p>

          {/* Evidencia */}
          <div>
            <p className="font-semibold mb-2">Archivo de Evidencia:</p>
            <div className="flex items-center space-x-2">
              {respuesta.archivoEvidencia.url.match(/\.(jpg|jpeg|png|gif)$/i) ? (
                <img
                  src={`${BACKEND_BASE_URL}${respuesta.archivoEvidencia.url}`}
                  alt={respuesta.archivoEvidencia.originalname}
                  className="h-16 w-16 object-cover rounded"
                />
              ) : respuesta.archivoEvidencia.url.match(/\.pdf$/i) ? (
                <FaFilePdf className="text-red-500 text-3xl" />
              ) : (
                <FaFileAlt className="text-gray-500 text-3xl" />
              )}
              <a
                href={`${BACKEND_BASE_URL}${respuesta.archivoEvidencia.url}`}
                target="_blank"
                rel="noopener noreferrer"
                className="truncate max-w-md text-blue-600 hover:underline"
              >
                {respuesta.archivoEvidencia.originalname}
              </a>
            </div>
          </div>

          <div className="border-t border-gray-200"></div>

          {/* Seleccionar estado y comentario */}
          <div className="space-y-4">
            <div>
              <label className="block text-gray-700 mb-1 font-medium">
                Estado
              </label>
              <select
                value={estado}
                onChange={(e) => setEstado(e.target.value)}
                className="w-full border border-gray-300 rounded px-4 py-2 focus:ring-2 focus:ring-green-200 focus:border-green-600 outline-none"
              >
                <option value="Pendiente">Pendiente</option>
                <option value="Aprobado">Aprobado</option>
                <option value="Reprobado">Reprobado</option>
              </select>
            </div>
            <div>
              <label className="block text-gray-700 mb-1 font-medium">
                Comentario (opcional)
              </label>
              <textarea
                value={comentario}
                onChange={(e) => setComentario(e.target.value)}
                rows={3}
                className="w-full border border-gray-300 rounded px-4 py-2 focus:ring-2 focus:ring-green-200 focus:border-green-600 outline-none"
              />
            </div>
          </div>
        </div>

        <div className="border-t border-gray-200"></div>

        {/* Botones de acción */}
        <div className="px-6 py-4 flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition"
            disabled={submitting}
          >
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition disabled:opacity-50"
            disabled={submitting}
          >
            {submitting ? "Procesando..." : "Guardar Cambios"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminRevisionRespuestaModal;
