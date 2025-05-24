"use client";

import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import {
  Home,
  FileText,
  Users,
  ChartNoAxesCombined,
  Landmark,
  CreditCard,
  ArrowLeftRight,
  LogOut,
  FolderKanban,
} from "lucide-react";
import axios from "axios";

export default function Sidebar() {
  const router = useRouter();
  const currentPath = usePathname();
  const [username, setUsername] = useState("Usuario");

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      router.push("/login");
      return;
    }

    const fetchUserProfile = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:8000/api/auth/user/", {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        const nombre =
          response.data.name ||
          response.data.username ||
          response.data.email ||
          "Usuario";

        setUsername(nombre);
        localStorage.setItem("username", nombre);
      } catch (error) {
        console.error("Error al obtener usuario:", error);
        localStorage.clear();
        router.push("/login");
      }
    };

    fetchUserProfile();
  }, [router]);

  const handleLogout = async () => {
    const accessToken = localStorage.getItem("accessToken");

    try {
      await axios.post("http://127.0.0.1:8000/api/auth/logout/", null, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
    } catch (error) {
      console.warn("Logout falló en backend:", error.response?.data || error.message);
    }

    localStorage.clear();
    router.push("/login");
  };

  return (
    <aside className="w-64 bg-gray-800 text-white flex flex-col p-5 h-screen fixed left-0 top-0">
      <Link href="/">
        <img src="/logo.png" alt="Logo" className="w-50 h-auto mx-auto mb-6" />
      </Link>

      <nav className="flex flex-col space-y-2 flex-grow text-[16px]">
        <Link
  href="/dashboard"
  className={`flex items-center gap-3 px-4 py-2 rounded transition
    ${currentPath === "/dashboard" ? "bg-orange-400/50" : "hover:bg-orange-400/50"}`}
>
  <Home className="w-6 h-6 text-teal-500" />
  Dashboard
</Link>

        <Link href="/transactions" className={`flex items-center gap-3 px-4 py-2 rounded transition ${currentPath === "/transactions" ? "bg-orange-400/50" : "hover:bg-orange-400/50"}`}>
          <ArrowLeftRight className="w-6 h-6 text-teal-500" />
          Transacciones
        </Link>
        <Link href="/clients" className={`flex items-center gap-3 px-4 py-2 rounded transition ${currentPath === "/clients" ? "bg-orange-500" : "hover:bg-orange-400/50"}`}>
          <Users className="w-6 h-6 text-teal-500" />
          Clientes
        </Link>
        <Link href="/reports" className={`flex items-center gap-3 px-4 py-2 rounded transition ${currentPath === "/reports" ? "bg-orange-500" : "hover:bg-orange-400/50"}`}>
          <ChartNoAxesCombined className="w-6 h-6 text-teal-500" />
          Reportes
        </Link>
        <Link href="/banks" className={`flex items-center gap-3 px-4 py-2 rounded transition ${currentPath === "/banks" ? "bg-orange-500" : "hover:bg-orange-400/50"}`}>
          <Landmark className="w-6 h-6 text-teal-500" />
          Bancos
        </Link>
        <Link href="/finances" className={`flex items-center gap-3 px-4 py-2 rounded transition ${currentPath === "/finances" ? "bg-orange-500" : "hover:bg-orange-400/50"}`}>
          <CreditCard className="w-6 h-6 text-teal-500" />
          Finanzas
        </Link>
        <Link href="/categories" className={`flex items-center gap-3 px-4 py-2 rounded transition ${currentPath === "/categories" ? "bg-orange-500" : "hover:bg-orange-400/50"}`}>
          <FolderKanban className="w-6 h-6 text-teal-500" />
          Categorías
        </Link>

        <button onClick={handleLogout} className="mt-2 flex items-center gap-3 px-4 py-2 hover:bg-orange-400/50 text-[16px]">
          <LogOut className="w-6 h-6 text-teal-500" />
          Cerrar Sesión
        </button>
      </nav>

      {typeof window !== "undefined" && localStorage.getItem("accessToken") && (
        <Link
          href="/profile"
          className="mt-6 flex items-center space-x-4 border-t border-gray-700 pt-4 hover:bg-gray-700 px-3 py-2 rounded transition"
        >
          <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center text-orange-400 font-bold uppercase">
            {username[0]}
          </div>
          <span className="text-gray-300 font-semibold text-[16px]">{username}</span>
        </Link>
      )}
    </aside>
  );
}
