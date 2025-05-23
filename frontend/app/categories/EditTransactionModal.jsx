"use client";
import React, { useState, useEffect } from "react";
import { Trash2, Check } from "lucide-react";
import { mutate } from "swr";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-hot-toast";
import ConfirmDeleteModal from "@/components/ui/ConfirmDeleteModal";

const API_BASE_URL = "http://127.0.0.1:8000/api/transactions/";

export default function EditTransactionModal({ open, onClose, transaccion }) {
  const [form, setForm] = useState({
    fecha: "",
    descripcion: "",
    monto: "",
    tipo: "Ingreso",
  });

  const [transaccionParaEliminar, setTransaccionParaEliminar] = useState(null);

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
          category: transaccion.category,
        }),
      });

      if (!res.ok) throw new Error("Error al actualizar");

      await res.json();
      await mutate("categorias");
      toast.success("✅ Transacción actualizada");
      onClose();
    } catch {
      toast.error("❌ Error al guardar");
    }
  };

  const handleConfirmDelete = async () => {
    if (!transaccionParaEliminar?.id) return;
    try {
      const token = localStorage.getItem("accessToken");
      const res = await fetch(`${API_BASE_URL}${transaccionParaEliminar.id}/`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Error al eliminar");

      await mutate("categorias");
      toast.success("🗑️ Transacción eliminada");
      setTransaccionParaEliminar(null);
      onClose();
    } catch {
      toast.error("❌ Error al eliminar");
      setTransaccionParaEliminar(null);
    }
  };

  return (
    <>
      <AnimatePresence>
        {open && transaccion && (
          <motion.div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 40 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 40 }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
              className="bg-gray-900 text-white w-full max-w-lg p-6 rounded-2xl shadow-2xl border border-gray-700 relative"
            >
              <button
                onClick={() => setTransaccionParaEliminar(transaccion)}
                className="absolute top-4 right-4 text-red-500 hover:text-red-400 transition"
                title="Eliminar transacción"
              >
                <Trash2 className="w-5 h-5" />
              </button>

              <h2 className="text-xl font-semibold mb-6">Editar transacción</h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-400">Fecha</label>
                  <input
                    type="date"
                    name="fecha"
                    value={form.fecha}
                    onChange={handleChange}
                    className="w-full mt-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded-xl text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400">Descripción</label>
                  <input
                    type="text"
                    name="descripcion"
                    value={form.descripcion}
                    onChange={handleChange}
                    className="w-full mt-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded-xl text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400">Monto</label>
                  <input
                    type="number"
                    name="monto"
                    value={form.monto}
                    onChange={handleChange}
                    className="w-full mt-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded-xl text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400">Tipo</label>
                  <select
                    name="tipo"
                    value={form.tipo}
                    onChange={handleChange}
                    className="w-full mt-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded-xl text-white"
                  >
                    <option value="Ingreso">Ingreso</option>
                    <option value="Egreso">Egreso</option>
                  </select>
                </div>
              </div>

              <div className="mt-6 flex justify-end gap-3">
                <button
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl bg-teal-700 hover:bg-teal-600 text-white text-sm transition"
                >
                  Cerrar
                </button>
                <button
                  onClick={handleSubmit}
                  className="px-4 py-2 rounded-xl bg-orange-600 hover:bg-orange-500 text-white text-sm font-semibold flex items-center gap-2 transition"
                >
                  <Check className="w-4 h-4" />
                  Guardar
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {transaccionParaEliminar && (
        <ConfirmDeleteModal
          isOpen={!!transaccionParaEliminar}
          onClose={() => setTransaccionParaEliminar(null)}
          onConfirm={handleConfirmDelete}
          item={`transacción del ${transaccionParaEliminar.date}`}
        />
      )}
    </>
  );
}
