"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";
import countries from "country-flag-emoji-json";
import { mutate } from "swr";
import { motion, AnimatePresence } from "framer-motion";

export default function EditClientModal({ isOpen, onClose, clientData }) {
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    telefono: "",
    pais: "",
    direccion: "",
  });

  useEffect(() => {
    if (clientData) {
      setFormData({
        nombre: clientData.nombre || "",
        email: clientData.email || "",
        telefono: clientData.telefono || "",
        pais: clientData.pais || "",
        direccion: clientData.direccion || "",
      });
    }
  }, [clientData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/transaction/clientes/${clientData.id}/editar/`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      );

      if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);

      await response.json();
      await mutate("clientes-full");
      await mutate(["transactions-client", clientData.id]);
      onClose();
    } catch (error) {
      console.error("❌ Error actualizando cliente:", error);
      alert("Hubo un error al actualizar el cliente. Intenta de nuevo.");
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-gray-900 text-white w-full max-w-lg rounded-2xl shadow-xl p-6 relative border border-gray-700"
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-400 hover:text-white transition"
            >
              <X className="w-6 h-6" />
            </button>

            <h2 className="text-2xl font-bold mb-6 border-b border-gray-700 pb-3">
              Editar Cliente <span className="text-gray-400">#{clientData.id}</span>
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4 text-sm">
              <div>
                <label className="text-gray-400 block mb-1">Nombre</label>
                <input
                  type="text"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                  className="w-full p-2 rounded bg-gray-800 text-white"
                  required
                />
              </div>

              <div>
                <label className="text-gray-400 block mb-1">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full p-2 rounded bg-gray-800 text-white"
                />
              </div>

              <div>
                <label className="text-gray-400 block mb-1">Teléfono</label>
                <input
                  type="text"
                  name="telefono"
                  value={formData.telefono}
                  onChange={handleChange}
                  className="w-full p-2 rounded bg-gray-800 text-white"
                />
              </div>

              <div>
                <label className="text-gray-400 block mb-1">País</label>
                <select
                  name="pais"
                  value={formData.pais}
                  onChange={handleChange}
                  className="w-full p-2 rounded bg-gray-800 text-white"
                >
                  <option value="">Selecciona un país</option>
                  {countries.map((country) => (
                    <option key={country.code} value={country.name}>
                      {country.emoji} {country.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-gray-400 block mb-1">Dirección</label>
                <input
                  type="text"
                  name="direccion"
                  value={formData.direccion}
                  onChange={handleChange}
                  className="w-full p-2 rounded bg-gray-800 text-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-gray-700 mt-6">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-5 py-2 rounded-lg border border-teal-500 text-teal-500 hover:bg-teal-500 hover:text-white transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                   className="px-5 py-2 rounded-lg bg-orange-600 hover:bg-orange-500 text-white font-semibold"
                >
                  Guardar
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
