"use client";
import { useState, useEffect } from "react";
import { X } from "lucide-react";

export default function EditProfileModal({ isOpen, onClose, userData, onSave }) {
  const [form, setForm] = useState({
    nombre: "",
    apellido: "",
    email: "",
    avatar: null,
    avatarPreview: null,
  });

  useEffect(() => {
    if (userData) {
      setForm({
        nombre: userData.nombre || "",
        apellido: userData.apellido || "",
        email: userData.email || "",
        avatar: null,
        avatarPreview: userData.avatar || null,
      });
    }
  }, [userData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setForm((prev) => ({
      ...prev,
      avatar: file,
      avatarPreview: URL.createObjectURL(file),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      alert("Token no encontrado. Inicia sesión de nuevo.");
      return;
    }

    const payload = new FormData();
    payload.append("nombre", form.nombre);
    payload.append("apellido", form.apellido);
    payload.append("email", form.email);
    if (form.avatar) payload.append("avatar", form.avatar);

    try {
      const response = await fetch("http://127.0.0.1:8000/api/core/profile/update/", {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        body: payload,
      });

      if (!response.ok) throw new Error("No se pudo actualizar el perfil");

      const data = await response.json();
      onSave && onSave(data);
      onClose();
    } catch (error) {
      console.error("❌ Error al actualizar perfil:", error);
      alert("Error al guardar los cambios.");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 text-white rounded-xl w-full max-w-2xl p-6 relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white">
          <X />
        </button>

        <h2 className="text-xl font-semibold mb-4">Actualizar Cuenta</h2>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col items-center gap-2 md:col-span-2">
            <img
              src={form.avatarPreview || "/default-avatar.png"}
              alt="Avatar"
              className="w-20 h-20 rounded-full object-cover"
            />
            <label className="text-sm text-gray-400">
              <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
              <span className="cursor-pointer bg-gray-700 px-3 py-1 rounded hover:bg-gray-600">
                Cargar imagen
              </span>
            </label>
          </div>

          <div>
            <label className="text-sm text-gray-400">Nombre</label>
            <input
              type="text"
              name="nombre"
              value={form.nombre}
              onChange={handleInputChange}
              className="w-full p-2 rounded bg-gray-800 text-white"
              required
            />
          </div>

          <div>
            <label className="text-sm text-gray-400">Apellidos</label>
            <input
              type="text"
              name="apellido"
              value={form.apellido}
              onChange={handleInputChange}
              className="w-full p-2 rounded bg-gray-800 text-white"
            />
          </div>

          <div className="md:col-span-2">
            <label className="text-sm text-gray-400">Correo electrónico</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleInputChange}
              className="w-full p-2 rounded bg-gray-800 text-white"
              required
            />
          </div>

          <div className="flex justify-end gap-2 md:col-span-2 mt-4 border-t border-gray-700 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded bg-gray-700 hover:bg-gray-600"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-500"
            >
              Guardar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
