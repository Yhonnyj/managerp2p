"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { createBankTransaction } from "../../app/api/bankCreateTransaction";
import { mutate } from "swr";
import { X } from "lucide-react";

export default function BankAddModal({ isOpen, onClose, bankId }) {
  const initialState = {
    amount: "",
    type: "Ingreso",
    date: new Date().toISOString().slice(0, 16),
    reference: "",
    concept: "",
  };

  const [form, setForm] = useState(initialState);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setForm(initialState);
      setLoading(false);
    }
  }, [isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    if (!form.amount || isNaN(form.amount)) return alert("Monto inválido");
    setLoading(true);

    try {
      await createBankTransaction(bankId, {
        ...form,
        bank: bankId,
        amount: parseFloat(form.amount),
      });
      await mutate(`transactions-${bankId}`);
      onClose();
    } catch (error) {
      console.error("Error al crear transacción:", error);
      alert("Error al guardar");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-gray-900 rounded-2xl w-full max-w-lg p-6 relative shadow-2xl"
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {/* Cerrar */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-400 hover:text-white transition"
            >
              <X className="w-6 h-6" />
            </button>

            <h2 className="text-2xl font-bold mb-6 text-white">Registrar Transacción</h2>

            {/* Formulario */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <input
                name="amount"
                type="number"
                placeholder="Monto"
                value={form.amount}
                onChange={handleChange}
                className="w-full p-3 rounded-lg bg-gray-800 text-white placeholder-gray-400"
              />
              <select
                name="type"
                value={form.type}
                onChange={handleChange}
                className="w-full p-3 rounded-lg bg-gray-800 text-white"
              >
                <option value="Ingreso">Ingreso</option>
                <option value="Egreso">Egreso</option>
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <input
                name="date"
                type="datetime-local"
                value={form.date}
                onChange={handleChange}
                className="w-full p-3 rounded-lg bg-gray-800 text-white"
              />
              <input
                name="reference"
                type="text"
                placeholder="Referencia"
                value={form.reference}
                onChange={handleChange}
                className="w-full p-3 rounded-lg bg-gray-800 text-white placeholder-gray-400"
              />
            </div>

            <textarea
              name="concept"
              placeholder="Concepto"
              value={form.concept}
              onChange={handleChange}
              className="w-full p-3 rounded-lg bg-gray-800 text-white placeholder-gray-400 resize-none mb-6"
              rows={3}
            />

            {/* Subir archivos */}
            <div className="p-5 border-2 border-dashed border-gray-600 rounded-lg text-center text-gray-400 mb-6 cursor-pointer">
              <p className="text-teal-500 font-bold">Subir archivos</p>
              <p>o arrastra y suéltalos</p>
              <p className="text-xs text-gray-500">PNG, JPG, JPEG hasta 5MB</p>
            </div>

            {/* Botones */}
            <div className="flex justify-end gap-4">
              <button
                onClick={onClose}
                className="px-5 py-2 rounded-lg border border-teal-500 text-teal-500 hover:bg-teal-500 hover:text-white transition"
                disabled={loading}
              >
                Cerrar
              </button>
              <button
                onClick={handleSave}
                className="px-5 py-2 rounded-lg bg-orange-600 hover:bg-orange-500 text-white font-semibold"
                disabled={loading}
              >
                {loading ? "Guardando..." : "Guardar"}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
