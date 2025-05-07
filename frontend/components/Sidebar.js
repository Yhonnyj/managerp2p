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
  const [username, setUsername] = useState("Usuario");
  const router = useRouter();
  const currentPath = usePathname();

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");

    if (!accessToken) {
      router.push("/login");
      return;
    }

    const fetchUserProfile = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:8000/api/core/profile/", {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        setUsername(response.data.username || "Usuario");
      } catch (error) {
        console.error("Error al obtener usuario:", error);
        localStorage.removeItem("accessToken");
        router.push("/login");
      }
    };

    fetchUserProfile();
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    router.push("/login");
  };

  return (
    <aside className="w-64 bg-gray-800 text-white flex flex-col p-5 h-screen fixed left-0 top-0">
      <Link href="/">
        <img src="/logo.png" alt="Logo" className="w-50 h-auto mx-auto mb-6" />
      </Link>

      <nav className="flex flex-col space-y-2 flex-grow">
        <Link href="/dashboard" className={`flex items-center gap-2 px-4 py-2 rounded transition ${currentPath === "/dashboard" ? "bg-orange-500" : "hover:bg-orange-400/50"}`}>
          <Home className="w-5 h-5" />
          Dashboard
        </Link>
        <Link href="/transactions" className={`flex items-center gap-2 px-4 py-2 rounded transition ${currentPath === "/transactions" ? "bg-orange-500" : "hover:bg-orange-400/50"}`}>
          <ArrowLeftRight className="w-5 h-5" />
          Transacciones
        </Link>
        <Link href="/clients" className={`flex items-center gap-2 px-4 py-2 rounded transition ${currentPath === "/clients" ? "bg-orange-500" : "hover:bg-orange-400/50"}`}>
          <Users className="w-5 h-5" />
          Clientes
        </Link>
        <Link href="/reports" className={`flex items-center gap-2 px-4 py-2 rounded transition ${currentPath === "/reports" ? "bg-orange-500" : "hover:bg-orange-400/50"}`}>
          <ChartNoAxesCombined className="w-5 h-5" />
          Reportes
        </Link>
        <Link href="/banks" className={`flex items-center gap-2 px-4 py-2 rounded transition ${currentPath === "/banks" ? "bg-orange-500" : "hover:bg-orange-400/50"}`}>
          <Landmark className="w-5 h-5" />
          Bancos
        </Link>
        <Link href="/finances" className={`flex items-center gap-2 px-4 py-2 rounded transition ${currentPath === "/finances" ? "bg-orange-500" : "hover:bg-orange-400/50"}`}>
          <CreditCard className="w-5 h-5" />
          Finanzas
        </Link>
        <Link href="/categories" className={`flex items-center gap-2 px-4 py-2 rounded transition ${currentPath === "/categories" ? "bg-orange-500" : "hover:bg-orange-400/50"}`}>
          <FolderKanban className="w-5 h-5" />
          Categorías
        </Link>

        <button onClick={handleLogout} className="mt-2 flex items-center gap-2 px-4 py-2 hover:bg-orange-400/50">
          <LogOut className="w-5 h-5" />
          Cerrar Sesión
        </button>
      </nav>

      {/* Usuario en el Sidebar - ahora clickeable */}
      <Link
        href="/profile"
        className="mt-6 flex items-center space-x-4 border-t border-gray-700 pt-4 hover:bg-gray-700 px-3 py-2 rounded transition"
      >
        <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center text-orange-400 font-bold uppercase">
          {username[0]}
        </div>
        <span className="text-gray-300 font-semibold">{username}</span>
      </Link>
    </aside>
  );
}
