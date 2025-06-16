// src/components/UserRespuestaModal.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const UserRespuestaModal = ({ actividad, onClose, onSuccess }) => {
  const [archivo, setArchivo] = useState(null);
  const [respuestaExistente, setRespuestaExistente] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userStatus, setUserStatus] = useState(null); // Nuevo estado para el estado del usuario

  // 1) Verificar si ya existe respuesta del aprendiz para esta actividad
  const fetchRespuesta = async () => {
    setLoading(true);
    try {
      // Leer user de localStorage (y extraer su _id)
      const storedUser = localStorage.getItem("user");
      if (!storedUser) {
        toast.error("Usuario no encontrado en localStorage");
        setLoading(false);
        return;
      }
      const parsedUser = JSON.parse(storedUser);
       setUserStatus(parsedUser.estado); // Guardar estado del usuario
      const aprendizId = parsedUser._id;

      // Si el usuario está inactivo, no necesitamos verificar respuestas
      if (parsedUser.estado !== 'activo') {
        setLoading(false);
        return;
      }

      // Llamamos a /api/respuestas/mis-respuestas?aprendiz=<aprendizId>
      const { data } = await axios.get(
        `http://localhost:5000/api/respuestas/mis-respuestas?aprendiz=${aprendizId}`
      );
      const previa = data.find((r) => r.actividad._id === actividad._id);
      setRespuestaExistente(previa || null);
    } catch (err) {
      console.error("Error fetchRespuesta:", err);
      toast.error(
        err.response?.data?.message || "Error al verificar tu respuesta"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (actividad) fetchRespuesta();
    // eslint-disable-next-line
  }, [actividad]);

  const handleFileChange = (e) => {
    setArchivo(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

     // Verificar estado del usuario antes de enviar
    if (userStatus !== 'activo') {
      return toast.error("Tu cuenta está inactiva. No puedes enviar actividades.");
    }

    if (!archivo) {
      return toast.error("Selecciona un archivo de evidencia");
    }

    try {
      // Leer user de localStorage
      const storedUser = localStorage.getItem("user");
      if (!storedUser) {
        toast.error("Usuario no encontrado en localStorage");
        return;
      }
      const parsedUser = JSON.parse(storedUser);
      const aprendizId = parsedUser._id;

      const formData = new FormData();
      // Enviar el archivo
      formData.append("archivoEvidencia", archivo);
      // Enviar el aprendizId (clave exactamente "aprendizId")
      formData.append("aprendizId", aprendizId);

      await axios.post(
        `http://localhost:5000/api/respuestas/${actividad._id}`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      toast.success("Evidencia enviada correctamente");
      fetchRespuesta();
      if (onSuccess) onSuccess();
    } catch (err) {
      console.error("Error handleSubmit:", err);
      toast.error(err.response?.data?.message || "Error al enviar evidencia");
    }
  };

  if (!actividad) return null;

  if (userStatus === 'inactivo') {
    return (
      <div className="p-4 bg-red-50 border-l-4 border-red-500 rounded mb-4">
        <p className="text-red-700 font-medium">
          ⚠️ Cuenta inactiva
        </p>
        <p className="text-gray-600 mt-1">
          No puedes enviar actividades porque tu cuenta está inactiva.
          Por favor, contacta al administrador para reactivar tu cuenta.
        </p>
        <button
          onClick={onClose}
          className="mt-3 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
        >
          Entendido
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {loading ? (
        <p className="text-center text-gray-500">Cargando...</p>
      ) : respuestaExistente ? (
        <div className="p-4 bg-green-50 rounded mb-4">
          <p className="text-gray-700">
            Ya enviaste evidencia el:{" "}
            {new Date(respuestaExistente.fechaEnvio).toLocaleString()}
          </p>
          <p className="mt-2">
            Estado:{" "}
            <span
              className={`font-medium ${
                respuestaExistente.estado === "Aprobado"
                  ? "text-green-600"
                  : respuestaExistente.estado === "Reprobado"
                  ? "text-red-600"
                  : "text-yellow-600"
              }`}
            >
              {respuestaExistente.estado}
            </span>
          </p>
          {respuestaExistente.comentario && (
            <p className="mt-2 text-gray-600">
              Comentario: {respuestaExistente.comentario}
            </p>
          )}
          <p className="mt-4 text-gray-600">
            Si quieres reenviar, sube otro archivo:
          </p>
        </div>
      ) : null}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-gray-700 mb-1">Archivo Evidencia</label>
          <input type="file" onChange={handleFileChange} className="w-full"  disabled={userStatus !== 'activo'} /> 
        </div>
        <button
          type="submit"
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition disabled:opacity-50"
          disabled={userStatus !== 'activo'} // Deshabilitar si no está activo
        >
          {respuestaExistente ? "Reenviar Evidencia" : "Enviar Evidencia"}
        </button>
      </form>
    </div>
  );
};

export default UserRespuestaModal;
