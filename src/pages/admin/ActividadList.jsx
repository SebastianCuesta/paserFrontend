import React, { useEffect, useState } from "react";
import axios from "axios";
import AdminActividadTable from "../../components/AdminActividadTable";
import AdminActividadModal from "../../components/AdminActividadModal";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import sena from "../../assets/logogreen.png";

const ActividadList = () => {
  const [actividades, setActividades] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showActividadModal, setShowActividadModal] = useState(false);
  const [selectedActividad, setSelectedActividad] = useState(null);
  const [actividadMode, setActividadMode] = useState("create"); // "create" | "edit"

  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // 1) Obtener lista de actividades
  const fetchActividades = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get("http://localhost:5000/api/actividades");
      setActividades(data);
    } catch {
      toast.error("Error al obtener actividades");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActividades();
  }, []);

  // 2) Abrir modal para crear
  const openCreateModal = () => {
    setSelectedActividad({
      nombre: "",
      descripcion: "",
      fechaLimite: "",
      archivosAdjuntos: [],
      creador: "",
    });
    setActividadMode("create");
    setShowActividadModal(true);
  };

  // 3) Abrir modal para editar
  const openEditModal = (actividad) => {
    setSelectedActividad({ ...actividad });
    setActividadMode("edit");
    setShowActividadModal(true);
  };

  // 4) Eliminar actividad
  const eliminarActividad = async (id) => {
    const result = await Swal.fire({
      title: "¿Estás seguro?",
      text: "Esta acción eliminará la actividad permanentemente.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });
    if (result.isConfirmed) {
      try {
        await axios.delete(`http://localhost:5000/api/actividades/${id}`);
        await fetchActividades();
        toast.success("Actividad eliminada correctamente");
      } catch {
        toast.error("Error al eliminar actividad");
      }
    }
  };

  // 5) Guardar cambios (editar)
  const handleSaveActividad = async () => {
    try {
      const {
        _id,
        nombre,
        descripcion,
        fechaLimite,
        archivosAdjuntos,
        creador,
      } = selectedActividad;

      const formData = new FormData();
      formData.append("nombre", nombre);
      formData.append("descripcion", descripcion);
      formData.append("fechaLimite", fechaLimite);
      formData.append("creador", creador);

      // Si hay archivos nuevos (instancias File) en archivosAdjuntos, los añadimos
      if (Array.isArray(archivosAdjuntos) && archivosAdjuntos.length > 0) {
        archivosAdjuntos
          .filter((f) => f instanceof File)
          .forEach((file) => {
            formData.append("archivosAdjuntos", file);
          });
      }

      await axios.put(
        `http://localhost:5000/api/actividades/${_id}`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      await fetchActividades();
      setShowActividadModal(false);
      toast.success("Actividad actualizada correctamente");
    } catch {
      toast.error("Error al actualizar actividad");
    }
  };

  // 6) Crear nueva actividad
  const handleCreateActividad = async () => {
    try {
      // Leemos el user desde localStorage
      const storedUser = localStorage.getItem("user");
      let creadorId = null;
      if (storedUser) {
        const parsed = JSON.parse(storedUser);
        creadorId = parsed._id;
      }

      const { nombre, descripcion, fechaLimite, archivosAdjuntos } =
        selectedActividad;

      const formData = new FormData();
      formData.append("nombre", nombre);
      formData.append("descripcion", descripcion);
      formData.append("fechaLimite", fechaLimite);
      if (creadorId) {
        formData.append("creador", creadorId);
      }

      if (Array.isArray(archivosAdjuntos) && archivosAdjuntos.length > 0) {
        archivosAdjuntos.forEach((file) => {
          formData.append("archivosAdjuntos", file);
        });
      }

      await axios.post(
        "http://localhost:5000/api/actividades",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      await fetchActividades();
      setShowActividadModal(false);
      toast.success("Actividad creada correctamente");
    } catch (err) {
      toast.error(err.response?.data?.message || "Error al crear actividad");
    }
  };

  // 7) Filtrado
  const filtered = actividades.filter((a) => {
    const termino = search.toLowerCase();
    const nombre = a.nombre?.toLowerCase() ?? "";
    const descripcion = a.descripcion?.toLowerCase() ?? "";
    const fecha = new Date(a.fechaLimite).toLocaleDateString();
    return (
      nombre.includes(termino) ||
      descripcion.includes(termino) ||
      fecha.includes(termino)
    );
  });

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paginated = filtered.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-gray-500">Cargando actividades...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      {/* Cabecera */}
      <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-md p-6 mb-6 flex items-center justify-between">
        <div className="flex items-center">
          <img src={sena} alt="SENA Logo" className="h-10 mr-4" />
          <h1 className="text-2xl font-bold text-gray-800">Gestión de Actividades</h1>
        </div>
        <button
          onClick={openCreateModal}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          + Crear Actividad
        </button>
      </div>

      {/* Tabla y buscador */}
      <AdminActividadTable
        actividades={paginated}
        onEdit={openEditModal}
        onDelete={eliminarActividad}
        searchTerm={search}
        setSearchTerm={(val) => {
          setSearch(val);
          setCurrentPage(1);
        }}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />

      {/* Modal de creación/edición */}
      {showActividadModal && (
        <AdminActividadModal
          mode={actividadMode}
          selectedActividad={selectedActividad}
          onClose={() => setShowActividadModal(false)}
          onChange={setSelectedActividad}
          onSave={handleSaveActividad}
          onCreate={handleCreateActividad}
        />
      )}
    </div>
  );
};

export default ActividadList;
