"use client";
import { useState } from "react";
import { mutate } from "swr";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-hot-toast";

const API_BASE_URL = "http://127.0.0.1:8000/api/finance-categories/";

export default function AddTransactionToCategoryModal({ open, onClose, categoria }) {
  const [form, setForm] = useState({
    fecha: "",
    descripcion: "",
    monto: "",
    tipo: "Ingreso",
  });

  const handleSubmit = async () => {
    if (!form.fecha || !form.descripcion || !form.monto) {
      toast.error("⚠️ Todos los campos son obligatorios.");
      return;
    }

    if (!categoria?.id) {
      toast.error("⚠️ No se encontró ID de la categoría.");
      return;
    }

    try {
      const token = localStorage.getItem("accessToken");

      const res = await fetch(`${API_BASE_URL}${categoria.id}/transactions/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          date: form.fecha,
          description: form.descripcion,
          amount: form.monto,
          type: form.tipo,
        }),
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText);
      }

      await mutate("categorias");
      setForm({ fecha: "", descripcion: "", monto: "", tipo: "Ingreso" });
      toast.success("✅ Transacción agregada con éxito");
      onClose();
    } catch (err) {
      toast.error(`❌ Error al agregar la transacción:\n${err.message}`);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="bg-gray-900 text-white w-full max-w-md rounded-2xl shadow-2xl p-6"
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Agregar transacción</h2>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-red-500 text-2xl font-bold transition"
              >
                ×
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-sm text-gray-300">Fecha</label>
                <input
                  type="date"
                  value={form.fecha}
                  onChange={(e) => setForm({ ...form, fecha: e.target.value })}
                  className="w-full mt-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded-xl text-white"
                />
              </div>
              <div>
                <label className="text-sm text-gray-300">Descripción</label>
                <input
                  type="text"
                  value={form.descripcion}
                  onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
                  className="w-full mt-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded-xl text-white"
                  placeholder="Ej. Pago de servicios"
                />
              </div>
              <div>
                <label className="text-sm text-gray-300">Monto</label>
                <input
                  type="number"
                  value={form.monto}
                  onChange={(e) => setForm({ ...form, monto: e.target.value })}
                  className="w-full mt-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded-xl text-white"
                  placeholder="Ej. 150"
                />
              </div>
              <div>
                <label className="text-sm text-gray-300">Tipo</label>
                <select
                  value={form.tipo}
                  onChange={(e) => setForm({ ...form, tipo: e.target.value })}
                  className="w-full mt-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded-xl text-white"
                >
                  <option value="Ingreso">Ingreso</option>
                  <option value="Egreso">Egreso</option>
                </select>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-2">
              <button
                onClick={onClose}
                className="px-4 py-2 rounded-xl bg-teal-700 hover:bg-teal-600 text-white text-sm transition"
              >
                Cancelar
              </button>
              <button
                onClick={handleSubmit}
                className="px-4 py-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-semibold text-sm transition"
              >
                Agregar
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
