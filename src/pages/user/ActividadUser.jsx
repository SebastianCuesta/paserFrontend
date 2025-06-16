// src/pages/user/ActividadUser.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import UserActividadTable from "../../components/UserActividadTable";
import UserViewActividadModal from "../../components/UserViewActividadModal";
import { toast } from "react-toastify";

const ActividadUser = () => {
  const [actividades, setActividades] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal para ver detalles de la actividad (y desde allí cargar evidencia)
  const [showViewModal, setShowViewModal] = useState(false);
  const [actividadSeleccionada, setActividadSeleccionada] = useState(null);

  // Para mapear cada actividad a su estado de respuesta:
  //   { "64act...": "Aprobado", "64act...": "Pendiente", ... }
  const [estadoRespuestas, setEstadoRespuestas] = useState({});

  // Paginación / búsqueda
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // --------------------------
  // 1) Obtener actividades abiertas
  // --------------------------
  const fetchActividades = async () => {
    setLoading(true);
    try {
      /* const { data } = await axios.get("http://localhost:5000/api/actividades");
      const hoy = new Date();
      const abiertas = data.filter((a) => new Date(a.fechaLimite) >= hoy);
      setActividades(abiertas); */

      const { data } = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/actividades`);
      setActividades(data);
    } catch (err) {
      toast.error("Error al obtener actividades");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // --------------------------
  // 2) Obtener “mis respuestas” para construir el mapa de estados
  // --------------------------
  const fetchMisRespuestas = async () => {
    try {
      const storedUser = localStorage.getItem("user");
      if (!storedUser) {
        console.warn("No hay usuario en localStorage");
        return;
      }
      const parsed = JSON.parse(storedUser);
      const aprendizId = parsed._id;
      if (!aprendizId) {
        console.warn("El objeto user no tiene _id");
        return;
      }

      const res = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/api/respuestas/mis-respuestas?aprendiz=${aprendizId}`
      );
      console.log("Mis respuestas recibidas:", res.data);

      // Construir un mapa { actividadId: estado }
      const mapa = {};
      res.data.forEach((r) => {
        // r.actividad._id puede ser un ObjectId; lo convertimos a string
        const actId = r.actividad._id.toString();
        mapa[actId] = r.estado; // "Pendiente" | "Aprobado" | "Reprobado"
      });
      setEstadoRespuestas(mapa);
      console.log("Mapa de estados:", mapa);
    } catch (err) {
      toast.error("Error al obtener tus respuestas");
      console.error(err);
    }
  };

  // --------------------------
  // 3) useEffect inicial → traer actividades y mis respuestas
  // --------------------------
  useEffect(() => {
    fetchActividades();
    fetchMisRespuestas();
  }, []);

  // --------------------------
  // 4) Abrir modal para ver datos de la actividad
  // --------------------------
  const openViewModal = (actividad) => {
    const storedUser = localStorage.getItem('user');
    const parsedUser = storedUser ? JSON.parse(storedUser) : null;

    if (parsedUser?.estado !== 'activo') {
      toast.error("Tu cuenta está inactiva. No puedes enviar actividades.");
      return;
    }

    setActividadSeleccionada(actividad);
    setShowViewModal(true);
  };

  // --------------------------
  // 5) Filtrado y paginación
  // --------------------------
  const filtered = actividades.filter((a) => {
    const termino = search.toLowerCase();
    const nombre = a.nombre?.toLowerCase() ?? "";
    const fecha = new Date(a.fechaLimite).toLocaleDateString();
    return nombre.includes(termino) || fecha.includes(termino);
  });

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paginated = filtered.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // --------------------------
  // 6) Si aún está cargando, mostrar spinner
  // --------------------------
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-gray-500">Cargando actividades...</p>
      </div>
    );
  }

  // --------------------------
  // 7) Render final
  // --------------------------
  return (
    <div className="min-h-screen bg-gray-100 p-4">
      {/* Cabecera */}
      <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-md p-6 mb-6 flex items-center">
        <h1 className="text-2xl font-bold text-gray-800">
          Lista de Actividades
        </h1>
      </div>

      {/* Tabla y buscador */}
      <UserActividadTable
        actividades={paginated}
        onView={openViewModal}
        searchTerm={search}
        setSearchTerm={(val) => {
          setSearch(val);
          setCurrentPage(1);
        }}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        estadoRespuestas={estadoRespuestas} // <– aquí va el mapa de estados
      />

      {/* Modal para ver información de la actividad y (re)enviar evidencia */}
      {showViewModal && actividadSeleccionada && (
        <UserViewActividadModal
          actividad={actividadSeleccionada}
          onClose={() => {
            setShowViewModal(false);
            // Cuando se cierre el modal, “quizá” la respuesta cambió (por reenvío o porque el admin aprobó)
            fetchMisRespuestas();
          }}
          onRefetch={fetchActividades} // no es estrictamente necesario, pero lo dejamos por si quieres
        />
      )}
    </div>
  );
};

export default ActividadUser;
