"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Trash2 } from "lucide-react";
import ConfirmDeleteModal from "./ConfirmDeleteModal";
import { updateTransaction } from "../../app/api/bankCreateTransaction";

export default function TransactionEditModal({
  isOpen,
  onClose,
  transaction,
  onDelete,
  bankId,
  refreshTransactions,
}) {
  const [form, setForm] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  useEffect(() => {
    if (transaction) {
      setForm({
        ...transaction,
        date: transaction.date?.slice(0, 10),
        amount: transaction.amount?.toString() || "",
        reference: transaction.reference || "",
        type: transaction.type || "Ingreso",
        concept: transaction.concept || "",
      });
    }
  }, [transaction]);

  if (!isOpen || !transaction || !form) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    try {
      await updateTransaction(bankId, {
        ...form,
        amount: parseFloat(form.amount),
        bank: bankId,
      });
      await refreshTransactions?.();
      onClose();
    } catch (error) {
      console.error("❌ Error al guardar cambios:", error);
    }
  };

  const handleDelete = async () => {
    await onDelete(transaction.id);
    await refreshTransactions?.();
    onClose();
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="bg-gray-900 w-full max-w-lg rounded-2xl shadow-2xl p-6 relative"
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {/* Botón cerrar */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Botón eliminar arriba izquierdo */}
          <button
            onClick={() => setDeleteModalOpen(true)}
            className="absolute top-4 left-4 text-red-500 hover:text-red-400 transition"
            title="Eliminar"
          >
            <Trash2 className="w-5 h-5" />
          </button>

          <h2 className="text-2xl font-bold text-white mb-6 text-center">
            Editar Transacción
          </h2>

          {/* Campos */}
          <div className="space-y-5">
            <div>
              <label className="block text-sm text-gray-400 mb-1">Fecha</label>
              <input
                type="date"
                name="date"
                value={form.date}
                onChange={handleChange}
                className="w-full p-3 rounded-lg bg-gray-800 text-white focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-1">Referencia</label>
              <input
                type="text"
                name="reference"
                value={form.reference}
                onChange={handleChange}
                className="w-full p-3 rounded-lg bg-gray-800 text-white focus:outline-none"
                placeholder="Ej: #1234ABC"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-1">Monto</label>
              <input
                type="number"
                name="amount"
                value={form.amount}
                onChange={handleChange}
                className="w-full p-3 rounded-lg bg-gray-800 text-white focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-1">Tipo</label>
              <select
                name="type"
                value={form.type}
                onChange={handleChange}
                className="w-full p-3 rounded-lg bg-gray-800 text-white focus:outline-none"
              >
                <option value="Ingreso">Ingreso</option>
                <option value="Egreso">Egreso</option>
              </select>
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-1">Concepto</label>
              <textarea
                name="concept"
                value={form.concept}
                onChange={handleChange}
                rows="3"
                className="w-full p-3 rounded-lg bg-gray-800 text-white focus:outline-none resize-none"
                placeholder="Detalle o descripción..."
              />
            </div>
          </div>

          {/* Botones */}
          <div className="flex justify-end gap-3 mt-8">
            <button
              onClick={onClose}
              className="px-5 py-2 rounded-lg border border-teal-500 text-teal-500 hover:bg-teal-500 hover:text-white transition"
            >
              Cancelar
            </button>
            <button
              onClick={handleSubmit}
              className="px-5 py-2 rounded-lg bg-orange-600 hover:bg-orange-500 text-white font-semibold"
            >
              Guardar
            </button>
          </div>

          {/* Modal de confirmación */}
          <ConfirmDeleteModal
            isOpen={deleteModalOpen}
            onClose={() => setDeleteModalOpen(false)}
            onConfirm={handleDelete}
          />
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}