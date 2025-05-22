"use client";
import React, { useState, useEffect } from "react";
import { Trash2, Check } from "lucide-react";
import { mutate } from "swr";
import { motion, AnimatePresence } from "framer-motion";

const API_BASE_URL = "http://127.0.0.1:8000/api/transactions/";

export default function EditTransactionModal({ open, onClose, transaccion }) {
  const [form, setForm] = useState({
    fecha: "",
    descripcion: "",
    monto: "",
    tipo: "Ingreso",
  });

  useEffect(() => {
    if (transaccion) {
      setForm({
        fecha: transaccion.date?.slice(0, 10) || "",
        descripcion: transaccion.description || "",
        monto: transaccion.amount || "",
        tipo: transaccion.type || "Ingreso",
      });
    }
  }, [transaccion]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const res = await fetch(`${API_BASE_URL}${transaccion.id}/`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          date: form.fecha,
          description: form.descripcion,
          amount: form.monto,
          type: form.tipo,
          category: transaccion.category, // ✅ obligatorio para PUT
        }),
      });

      if (!res.ok) throw new Error("Error al actualizar");

      await res.json();
      await mutate("categorias");
      onClose();
    } catch {
      alert("❌ Error al guardar");
    }
  };

  const handleDelete = async () => {
    if (!confirm("¿Eliminar esta transacción?")) return;
    try {
      const token = localStorage.getItem("accessToken");
      const res = await fetch(`${API_BASE_URL}${transaccion.id}/`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Error al eliminar");

      await mutate("categorias");
      onClose();
    } catch {
      alert("❌ Error al eliminar");
    }
  };

  return (
    <AnimatePresence>
      {open && transaccion && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 flex items-center justify-center z-50"
        >
          <motion.div
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 40, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="bg-gray-900 text-white w-full max-w-lg p-6 rounded-2xl shadow-lg border border-gray-700 relative"
          >
            <button
              onClick={handleDelete}
              className="absolute top-4 right-4 text-red-500 hover:text-red-400"
            >
              <Trash2 className="w-5 h-5" />
            </button>

            <h2 className="text-xl font-bold mb-4">Editar Transacción</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400">Fecha</label>
                <input
                  type="date"
                  name="fecha"
                  value={form.fecha}
                  onChange={handleChange}
                  className="w-full px-3 py-2 rounded bg-gray-800 text-white"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400">Descripción</label>
                <input
                  type="text"
                  name="descripcion"
                  value={form.descripcion}
                  onChange={handleChange}
                  className="w-full px-3 py-2 rounded bg-gray-800 text-white"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400">Monto</label>
                <input
                  type="number"
                  name="monto"
                  value={form.monto}
                  onChange={handleChange}
                  className="w-full px-3 py-2 rounded bg-gray-800 text-white"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400">Tipo</label>
                <select
                  name="tipo"
                  value={form.tipo}
                  onChange={handleChange}
                  className="w-full px-3 py-2 rounded bg-gray-800 text-white"
                >
                  <option value="Ingreso">Ingreso</option>
                  <option value="Egreso">Egreso</option>
                </select>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={onClose}
                className="px-4 py-2 rounded bg-gray-700 hover:bg-gray-600 text-white"
              >
                Cerrar
              </button>
              <button
                onClick={handleSubmit}
                className="px-4 py-2 rounded bg-green-600 hover:bg-green-500 text-white flex items-center gap-2"
              >
                <Check className="w-4 h-4" /> Guardar
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
