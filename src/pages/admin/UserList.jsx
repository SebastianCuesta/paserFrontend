// src/pages/admin/UserList.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import AdminUserTable from "../../components/AdminUserTable";
import AdminEditUserModal from "../../components/AdminEditUserModal";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import sena from "../../assets/logogreen.png";
import { FaFileExcel, FaDownload } from "react-icons/fa";
import * as XLSX from 'xlsx';


const UserList = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [mode, setMode] = useState("edit"); // "edit" | "create"
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false)

   // Función para descargar la plantilla Excel
  const downloadTemplate = () => {
    const templateData = [
      {
        nombres: "Juan",
        apellidos: "Pérez",
        tipoIdentificacion: "CC/TI/PPT/CE",
        identificacion: "123456789",
        numTelefono: "3001234567",
        correo: "ejemplo@correo.com",
        programaFormacion: "Programación",
        numeroFicha: "123456",
        jornada: "Mañana/Tarde/Noche",
        rol: "user/admin",
        estado: "activo/inactivo"
      }
    ];
    
    const ws = XLSX.utils.json_to_sheet(templateData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "PlantillaUsuarios");
    XLSX.writeFile(wb, "Plantilla_Carga_Usuarios.xlsx");
  };

  // Función para manejar la carga masiva
  const handleBulkUpload = async () => {
    if (!file) {
      toast.warning('Por favor selecciona un archivo Excel');
      return;
    }

    const result = await Swal.fire({
      title: '¿Confirmar carga masiva?',
      html: `Se crearán usuarios desde el archivo <strong>${file.name}</strong>`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, continuar',
      cancelButtonText: 'Cancelar',
      showLoaderOnConfirm: true,
      preConfirm: async () => {
        try {
          setIsUploading(true);
          const formData = new FormData();
          formData.append('file', file);

          const { data } = await axios.post(
            'http://localhost:5000/api/bulk', 
            formData, 
            {
              headers: {
                'Content-Type': 'multipart/form-data'
              }
            }
          );

          await fetchUsuarios();
          return data;
        } catch (error) {
          Swal.showValidationMessage(
            `Error: ${error.response?.data?.message || 'Error en carga masiva'}`
          );
        } finally {
          setIsUploading(false);
        }
      }
    });

    if (result.isConfirmed) {
      const { details } = result.value;
      
      if (details.errors.length > 0) {
        Swal.fire({
          title: 'Proceso completado con errores',
          html: `
            <p>${result.value.message}</p>
            <p>Errores encontrados: ${details.errors.length}</p>
            <div class="text-left mt-4 max-h-60 overflow-y-auto">
              ${details.errors.map(err => `
                <div class="mb-2 p-2 bg-red-50 rounded">
                  <p class="font-semibold">Fila ${err.row}: ${err.error}</p>
                  <p class="text-sm">${JSON.stringify(err.data)}</p>
                </div>
              `).join('')}
            </div>
          `,
          icon: 'warning'
        });
      } else {
        Swal.fire(
          '¡Éxito!',
          result.value.message,
          'success'
        );
      }
      setFile(null);
    }
  };

  // 1) Función para obtener la lista de usuarios desde el backend
  const fetchUsuarios = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get("http://localhost:5000/api/users");
      setUsuarios(data);
    } catch {
      toast.error("Error al obtener usuarios");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsuarios();
  }, []);

  // 2) Eliminar usuario (igual que antes)
  const eliminarUsuario = async (id) => {
    const result = await Swal.fire({
      title: "¿Estás seguro?",
      text: "Esta acción eliminará al usuario permanentemente.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });
    if (result.isConfirmed) {
      try {
        await axios.delete(`http://localhost:5000/api/users/${id}`);
        // Volvemos a traer la lista completa para reflejar el borrado
        await fetchUsuarios();
        toast.success("Usuario eliminado correctamente");
      } catch {
        toast.error("Error al eliminar usuario");
      }
    }
  };

  const openEditModal = (user) => {
    setSelectedUser(user);
    setMode("edit");
    setShowModal(true);
  };

  const openCreateModal = () => {
    setSelectedUser({
      nombres: "",
      apellidos: "",
      tipoIdentificacion: "",
      identificacion: "",
      numTelefono: "",
      correo: "",
      programaFormacion: "",
      numeroFicha: "",
      jornada: "",
      rol: "user",
      estado: "",
    });
    setMode("create");
    setShowModal(true);
  };

  // 3) Al guardar cambios, hacemos PUT y luego re‐fetch
  const handleSaveChanges = async () => {
    try {
      await axios.put(
        `http://localhost:5000/api/users/${selectedUser._id}`,
        selectedUser
      );
      // Después de editar, vuelvo a traer toda la lista
      await fetchUsuarios();
      setShowModal(false);
      toast.success("Usuario actualizado correctamente");
    } catch {
      toast.error("Error al actualizar usuario");
    }
  };

  // 4) Al crear, hacemos POST y luego re‐fetch
  const handleCreateUser = async () => {
    try {
      const payload = {
        nombres: selectedUser.nombres,
        apellidos: selectedUser.apellidos,
        tipoIdentificacion: selectedUser.tipoIdentificacion,
        identificacion: selectedUser.identificacion,
        numTelefono: selectedUser.numTelefono,
        correo: selectedUser.correo,
        programaFormacion: selectedUser.programaFormacion,
        numeroFicha: selectedUser.numeroFicha,
        jornada: selectedUser.jornada,
        rol: selectedUser.rol,
        estado: selectedUser.estado,
      };

      await axios.post("http://localhost:5000/api/register", payload);
      // Después de crear, vuelvo a traer toda la lista
      await fetchUsuarios();
      setShowModal(false);
      toast.success("Usuario creado correctamente");
    } catch (err) {
      toast.error(err.response?.data?.message || "Error al crear usuario");
    }
  };

  // 5) Filtrado (igual que antes)
  const filtered = usuarios.filter((u) => {
    const termino = search.toLowerCase();
    const nombres = u.nombres?.toLowerCase() ?? "";
    const apellidos = u.apellidos?.toLowerCase() ?? "";
    const correo = u.correo?.toLowerCase() ?? "";
    const identificacion = u.identificacion?.toString() ?? "";

    return (
      nombres.includes(termino) ||
      apellidos.includes(termino) ||
      correo.includes(termino) ||
      identificacion.includes(termino)
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
        <p className="text-gray-500">Cargando usuarios...</p>
      </div>
    );
  }

return (
  <div className="min-h-screen bg-gray-100 p-4">
    {/* Cabecera */}
    <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-md p-6 mb-6 mt-4">
      {/* Primera fila - Logo, título y botones principales */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
        {/* Logo y título */}
        <div className="flex items-center mb-4 md:mb-0">
          <img src={sena} alt="sena Logo" className="h-10 mr-4" />
          <h1 className="text-2xl font-bold text-gray-800">Gestión de Usuarios</h1>
        </div>

        {/* Contenedor de botones - modificado para alinear a derecha en md */}
        <div className="flex flex-wrap justify-end gap-2">
          {/* Botón para descargar plantilla */}
          <button
            onClick={downloadTemplate}
            className="flex items-center px-3 sm:px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 text-sm sm:text-base"
          >
            <FaDownload className="mr-1 sm:mr-2" />
            <span className="hidden sm:inline">Plantilla</span>
          </button>

          {/* Input para subir archivo */}
          <label className="flex items-center px-3 sm:px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 cursor-pointer text-sm sm:text-base">
            <FaFileExcel className="mr-1 sm:mr-2" />
            <span className="hidden sm:inline">Cargar Excel</span>
            <input
              type="file"
              className="hidden"
              accept=".xlsx, .xls"
              onChange={(e) => setFile(e.target.files[0])}
            />
          </label>

          <button
            onClick={openCreateModal}
            className="px-3 sm:px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 text-sm sm:text-base"
          >
            <span className="hidden sm:inline">+ </span>Crear usuario
          </button>
        </div>
      </div>

{/* Segunda fila - Información del archivo seleccionado */}
      {file && (
        <div className="flex items-center gap-4 bg-gray-50 p-3 rounded-lg border border-gray-200">
          <div className="flex-1">
            <span className="text-sm font-medium text-gray-700">
              Archivo seleccionado:
            </span>
            <span className="ml-2 text-sm text-gray-600 truncate max-w-md">
              {file.name}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleBulkUpload}
              disabled={isUploading}
              className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 disabled:bg-gray-400 text-sm"
            >
              {isUploading ? 'Procesando...' : 'Importar'}
            </button>
            <button
              onClick={() => setFile(null)}
              className="px-3 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 text-sm"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}
    </div>


    {/* Tabla y buscador */}
    <AdminUserTable
      usuarios={paginated}
      onEdit={openEditModal}
      onDelete={eliminarUsuario}
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
    {showModal && (
      <AdminEditUserModal
        mode={mode}
        selectedUser={selectedUser}
        onClose={() => setShowModal(false)}
        onChange={setSelectedUser}
        onSave={handleSaveChanges}
        onCreate={handleCreateUser}
      />
    )}
  </div>
);
}
export default UserList;
