import React from "react";
import senaLogo from "../assets/logogreen.png";

const Welcome = ({ user }) => {
  return (
    <div className="bg-gray-100 min-h-screen flex items-start justify-center p-4">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-4xl">
        {/* Cabecera con logo y título */}
        <div className="flex items-center mb-6">
          <img src={senaLogo} alt="SENA Logo" className="h-10 mr-3" />
          <h1 className="text-2xl sm:text-3xl font-bold text-green-700">
            PASER - Panel de Administración
          </h1>
        </div>

        {/* Mensaje de bienvenida */}
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Bienvenido a PASER, <span className="text-green-600">{user?.nombres}</span>!
        </h2>
        <p className="text-gray-600 mb-6">
          Has ingresado como{" "}
          <span className="italic text-gray-800">{user?.rol}</span>.
        </p>

        {/* Mensajes según rol */}
        {user?.rol === "admin" && (
          <div className="bg-green-50 border-l-4 border-green-600 p-4 rounded mb-4">
            <p className="text-green-700">
              Tienes acceso completo a todas las funcionalidades del panel.
            </p>
          </div>
        )}
        {user?.rol === "user" && user?.estado === "activo" &&(
          <div className="bg-green-50 border-l-4 border-green-600 p-4 rounded mb-4">
            <p className="text-green-700">
              Puedes ver tus actividades y responderlas.
            </p>
          </div>
        )}
        {user?.estado === "inactivo" && (
          <div className="bg-red-50 border-l-4 border-red-600 p-4 rounded mb-4">
            <p className="text-red-700">
              Su usuario esta inactivo por lo tanto no puede responder actividades, si consideras que es un error comunicate con bienestar al aprendiz.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Welcome;
