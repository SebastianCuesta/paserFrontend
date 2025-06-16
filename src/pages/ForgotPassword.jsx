import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import senaLogo from "../assets/logogreen.png";

const ForgotPassword = () => {
  const [correo, setCorreo] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/forgot-password", { correo });
      toast.success("Revisa tu correo para restablecer tu contraseña");
    } catch (err) {
      toast.error(err.response?.data?.message || "Error al enviar el correo");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md">
        {/* Logo SENA */}
        <div className="flex justify-center mb-6">
          <img src={senaLogo} alt="SENA Logo" className="h-12" />
        </div>
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">Recuperar Contraseña</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Correo registrado"
            value={correo}
            onChange={(e) => setCorreo(e.target.value)}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-200 focus:border-green-600"
          />
          <button
            type="submit"
            className="w-full bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition"
          >
            Enviar correo de recuperación
          </button>
        </form>
        <div className="mt-6 text-center text-gray-600 space-y-2">
          <p>
            <a href="/login" className="text-green-600 hover:underline font-medium">
              Iniciar Sesión
            </a>
          </p>
          
          <p>
            <a href="/" className="text-green-600 hover:underline font-medium">
              Volver al inicio
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
