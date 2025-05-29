"use client";

import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { motion } from "framer-motion";

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
      const response = await axios.post("http://127.0.0.1:8000/api/auth/login/", {
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
    <main className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e] p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="bg-white/5 backdrop-blur-2xl border border-white/10 shadow-2xl rounded-3xl px-10 py-12 w-full max-w-md"
      >
        <motion.h2
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-4xl font-bold text-center text-white"
        >
          Iniciar Sesión
        </motion.h2>
        <p className="text-sm text-center text-gray-300 mt-2 mb-8">
          Accede a tu cuenta de <span className="text-orange-400 font-semibold">Manager P2P</span>
        </p>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm text-gray-300 mb-1">Usuario</label>
            <input
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3 border border-gray-700 bg-gray-900 text-white rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 shadow-inner"
            />
          </div>

          <div className="relative">
            <label className="block text-sm text-gray-300 mb-1">Contraseña</label>
            <input
              type={showPass ? "text" : "password"}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 pr-10 border border-gray-700 bg-gray-900 text-white rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 shadow-inner"
            />
            <button
              type="button"
              onClick={() => setShowPass(!showPass)}
              className="absolute right-3 top-[38px] text-gray-400 hover:text-white"
            >
              {showPass ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>

          <motion.button
            type="submit"
            disabled={loading}
            whileTap={{ scale: 0.97 }}
            className="w-full bg-orange-600 hover:bg-orange-500 text-white font-semibold py-3 rounded-xl flex items-center justify-center transition disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Entrar"}
          </motion.button>

          {error && <p className="text-red-400 text-center text-sm mt-1">{error}</p>}
        </form>

        <p className="text-xs text-gray-500 text-center mt-6">
          Plataforma cifrada <span className="font-semibold text-orange-400">Caibo Secure</span>
        </p>
      </motion.div>
    </main>
  );
}