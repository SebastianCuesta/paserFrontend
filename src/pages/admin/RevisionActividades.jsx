import React, { useEffect, useState } from "react";
import axios from "axios";
import AdminRevisionActividadTable from "../../components/AdminRevisionActividadTable";
import AdminRevisionRespuestaModal from "../../components/AdminRevisionRespuestaModal";
import { toast } from "react-toastify";
import sena from "../../assets/logogreen.png";

const RevisionActividades = () => {
  const [actividades, setActividades] = useState([]);
  const [selectedActividadId, setSelectedActividadId] = useState("");
  const [respuestas, setRespuestas] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showRevisionModal, setShowRevisionModal] = useState(false);
  const [respuestaSeleccionada, setRespuestaSeleccionada] = useState(null);

  // 1) Cargar todas las actividades para el dropdown
  const fetchActividades = async () => {
    try {
      const { data } = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/actividades`);
      setActividades(data);
    } catch {
      toast.error("Error al obtener actividades");
    }
  };

  useEffect(() => {
    fetchActividades();
  }, []);

  // 2) Cuando el admin elija una actividad, cargar sus respuestas
  const fetchRespuestas = async (actividadId) => {
    // Si no hay actividad seleccionada, vaciamos respuestas y bajamos el loading
    if (!actividadId) {
      setRespuestas([]);
      setLoading(false);        // <--- Agregamos esta línea para asegurar que loading pase a false
      return;
    }

    setLoading(true);
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/api/actividades/${actividadId}/respuestas`
      );
      setRespuestas(data);
    } catch {
      toast.error("Error al obtener respuestas de la actividad");
    } finally {
      setLoading(false);
    }
  };

  // Llamar cada vez que cambie la actividad seleccionada
  useEffect(() => {
    fetchRespuestas(selectedActividadId);
  }, [selectedActividadId]);

  // 3) Abrir modal para revisar una respuesta concreta
  const openRevisionModal = (respuesta) => {
    setRespuestaSeleccionada(respuesta);
    setShowRevisionModal(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-gray-500">Cargando revisión...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      {/* Cabecera */}
      <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-md p-6 mb-6 flex items-center justify-between">
        <div className="flex items-center">
          <img src={sena} alt="SENA Logo" className="h-10 mr-4" />
          <h1 className="text-2xl font-bold text-gray-800">
            Revisión de Actividades
          </h1>
        </div>
      </div>

      {/* Selector de Actividad */}
      <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-md p-6 mb-6">
        <label className="block text-gray-700 font-medium mb-2">
          Seleccionar Actividad:
        </label>
        <select
          value={selectedActividadId}
          onChange={(e) => setSelectedActividadId(e.target.value)}
          className="w-full border border-gray-300 rounded px-4 py-2 focus:ring-2 focus:ring-green-200 focus:border-green-600 outline-none"
        >
          <option value="">-- Elige una actividad --</option>
          {actividades.map((act) => (
            <option key={act._id} value={act._id}>
              {act.nombre}
            </option>
          ))}
        </select>
      </div>

      {/* Tabla de respuestas de la actividad seleccionada */}
      <AdminRevisionActividadTable
        respuestas={respuestas}
        onReview={openRevisionModal}
      />

      {/* Modal de revisión de respuesta */}
      {showRevisionModal && respuestaSeleccionada && (
        <AdminRevisionRespuestaModal
          respuesta={respuestaSeleccionada}
          onClose={() => {
            setShowRevisionModal(false);
            // Recargar la lista de respuestas al cerrar el modal
            fetchRespuestas(selectedActividadId);
          }}
        />
      )}
    </div>
  );
};

export default RevisionActividades;
