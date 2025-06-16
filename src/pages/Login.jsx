import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import senaLogo from "../assets/logogreen.png";

const Login = () => {
  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      if (storedUser.rol === "admin" || storedUser.isAdmin) {
        navigate("/admin-dashboard");
      } else {
        navigate("/dashboard");
      }
    }
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/login`, { correo, password });
      const { token, user } = res.data;
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      toast.success("Inicio de sesión exitoso");
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Error al iniciar sesión");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center px-4">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md">
        {/* Logo SENA */}
        <div className="flex justify-center mb-6">
          <img src={senaLogo} alt="SENA Logo" className="h-12" />
        </div>
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">Iniciar Sesión</h2>
        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="email"
            placeholder="Ingresa el correo"
            value={correo}
            onChange={(e) => setCorreo(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:border-green-600 focus:ring focus:ring-green-200 outline-none"
            required
          />
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Ingresa la contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:border-green-600 focus:ring focus:ring-green-200 outline-none pr-10"
              required
            />
            <div
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-3 flex items-center cursor-pointer text-gray-600"
            >
              {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
            </div>
          </div>
          <button
            type="submit"
            className="w-full bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition"
          >
            Iniciar Sesión
          </button>
        </form>
        <div className="mt-6 text-center text-gray-600 space-y-2">
          <p>
            <a href="/forgot-password" className="text-green-600 hover:underline font-medium">
              ¿Olvidaste tu contraseña?
            </a>
          </p>
          
          <p>
            <a href="/" className="text-green-600 hover:underline font-medium">
              Volver al Home
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
