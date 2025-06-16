import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import senaLogo from "../assets/logogreen.png";

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password.length < 6) {
      toast.error("La contraseña debe tener al menos 6 caracteres");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Las contraseñas no coinciden");
      return;
    }

    try {
      await axios.post(`http://localhost:5000/api/reset-password/${token}`, { password });
      toast.success("Contraseña actualizada. Inicia sesión");
      navigate("/login");
    } catch (err) {
      toast.error(err.response?.data?.message || "Error al actualizar contraseña");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center px-4">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md">
        {/* Logo SENA */}
        <div className="flex justify-center mb-6">
          <img src={senaLogo} alt="SENA Logo" className="h-12" />
        </div>
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
          Restablecer Contraseña
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Nueva contraseña */}
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Nueva contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-200 focus:border-green-600 pr-10"
            />
            <span
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-600"
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>

          {/* Confirmar contraseña */}
          <div className="relative">
            <input
              type={showConfirm ? "text" : "password"}
              placeholder="Confirmar contraseña"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-200 focus:border-green-600 pr-10"
            />
            <span
              onClick={() => setShowConfirm(!showConfirm)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-600"
            >
              {showConfirm ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>

          <button
            type="submit"
            className="w-full bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition"
          >
            Guardar nueva contraseña
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

export default ResetPassword;
