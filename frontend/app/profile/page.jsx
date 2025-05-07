"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { Shield, User } from "lucide-react";
import { useRouter } from "next/navigation";
import EditProfileModal from "./EditProfileModal";

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState("profile");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const router = useRouter();

  const fetchProfile = async () => {
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      router.push("/login");
      return;
    }

    try {
      const response = await axios.get("http://127.0.0.1:8000/api/core/profile/", {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      setUser(response.data);
    } catch (error) {
      console.error("Error al obtener perfil:", error);
      router.push("/login");
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleSave = async (formData) => {
    const accessToken = localStorage.getItem("accessToken");
    try {
      await axios.put("http://127.0.0.1:8000/api/core/profile/update/", formData, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "multipart/form-data",
        },
      });
      setIsEditModalOpen(false);
      fetchProfile(); // Actualiza los datos luego de guardar
    } catch (error) {
      console.error("Error actualizando perfil:", error);
      alert("❌ Hubo un problema al actualizar el perfil.");
    }
  };

  if (!user) return <div className="text-white p-8">Cargando...</div>;

  return (
    <div className="flex min-h-screen bg-gray-900 text-white">
      {/* Sidebar perfil */}
      <aside className="w-64 bg-gray-800 border-r border-gray-700 p-6">
        <h2 className="text-xl font-bold mb-4">Cuenta</h2>
        <p className="text-gray-400 text-sm mb-8">Gestiona tu cuenta.</p>

        <nav className="space-y-2">
          <button
            onClick={() => setActiveTab("profile")}
            className={`w-full flex items-center gap-2 px-4 py-2 rounded ${activeTab === "profile" ? "bg-gray-700 text-white" : "text-gray-400 hover:bg-gray-700"}`}
          >
            <User className="w-4 h-4" />
            Perfil
          </button>
          <button
            onClick={() => setActiveTab("security")}
            className={`w-full flex items-center gap-2 px-4 py-2 rounded ${activeTab === "security" ? "bg-gray-700 text-white" : "text-gray-400 hover:bg-gray-700"}`}
          >
            <Shield className="w-4 h-4" />
            Seguridad
          </button>
        </nav>
      </aside>

      {/* Contenido derecho */}
      <main className="flex-1 p-10">
        {activeTab === "profile" && (
          <div>
            <h2 className="text-2xl font-bold mb-6">Cuenta</h2>

            <div className="bg-gray-800 rounded-xl p-6 space-y-6 border border-gray-700">
              {/* Perfil */}
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-purple-600 rounded-full flex items-center justify-center text-2xl font-bold uppercase">
                  {user.username[0]}
                </div>
                <div>
                  <h3 className="text-lg font-semibold">{user.username}</h3>
                  <p className="text-gray-400">{user.email}</p>
                </div>
                <div className="ml-auto">
                  <button onClick={() => setIsEditModalOpen(true)} className="text-blue-500 hover:underline">
                    Editar perfil
                  </button>
                </div>
              </div>

              {/* Correos electrónicos */}
              <div>
                <h4 className="text-sm text-gray-400 mb-1">Correo electrónico</h4>
                <div className="flex items-center gap-3">
                  <span className="text-white">{user.email}</span>
                  <span className="bg-gray-600 text-xs px-2 py-1 rounded">Principal</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "security" && (
          <div>
            <h2 className="text-2xl font-bold mb-6">Seguridad</h2>

            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 space-y-6">
              <div>
                <h4 className="text-sm text-gray-400 mb-1">Contraseña</h4>
                <p className="text-white">••••••••</p>
                <button className="mt-2 text-sm text-blue-500 hover:underline">Actualizar contraseña</button>
              </div>
              <div>
                <h4 className="text-sm text-gray-400 mb-1">Dispositivos activos</h4>
                <p className="text-white">Windows · Firefox 137.0</p>
              </div>
              <button className="text-red-500 hover:underline text-sm">Eliminar cuenta</button>
            </div>
          </div>
        )}
      </main>

      <EditProfileModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        userData={user}
        onSave={handleSave}
      />
    </div>
  );
}
