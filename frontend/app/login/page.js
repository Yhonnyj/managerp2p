"use client";

import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Loader2 } from "lucide-react";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await axios.post("http://127.0.0.1:8000/api/token/", {
        username,
        password,
      });

      const { access, refresh } = response.data;
      if (!access || !refresh) throw new Error("Tokens faltantes");

      localStorage.setItem("accessToken", access);
      localStorage.setItem("refreshToken", refresh);

      router.push("/dashboard");
    } catch (err) {
      console.error("Login error:", err.response?.data || err);
      setError("Usuario o contraseña incorrectos");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen w-full flex items-center justify-center bg-[url('/bg-pattern.svg')] bg-cover bg-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl px-8 py-10 w-full max-w-md">
        {/* Título */}
        <h2 className="text-2xl font-bold text-center text-gray-900">Entrar</h2>
        <p className="text-sm text-center text-gray-500 mb-6">para continuar a Manager P2P</p>

        <form onSubmit={handleLogin} className="space-y-6">
          {/* Usuario */}
          <div>
            <label className="block text-sm text-gray-700 mb-1">Usuario</label>
            <input
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          {/* Contraseña */}
          <div className="relative">
            <label className="block text-sm text-gray-700 mb-1">Contraseña</label>
            <input
              type={showPass ? "text" : "password"}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 pr-10 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <button
              type="button"
              onClick={() => setShowPass(!showPass)}
              className="absolute right-3 top-9 text-gray-500 hover:text-gray-700"
            >
              {showPass ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>

          {/* Botón */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-orange-600 hover:bg-orange-500 text-white font-semibold py-3 rounded-md flex items-center justify-center transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Continuar"}
          </button>

          {/* Error */}
          {error && (
            <p className="text-red-600 text-center text-sm mt-1">{error}</p>
          )}
        </form>

        {/* Footer */}
        <p className="text-xs text-gray-400 text-center mt-6">
          Secured by <span className="font-semibold">Caibo Secure</span>
        </p>
      </div>
    </main>
  );
}
