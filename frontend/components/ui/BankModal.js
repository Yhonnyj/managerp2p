"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { createBank } from "../../app/api/bank";
import { mutate } from "swr";
import { X } from "lucide-react";

export default function BankModal({ isOpen, onClose, onSave, selectedCategory }) {
  const [bankName, setBankName] = useState("");
  const [holder, setHolder] = useState("");
  const [email, setEmail] = useState("");

  const resetFields = () => {
    setBankName("");
    setHolder("");
    setEmail("");
  };

  const handleSave = async () => {
    if (!bankName || !holder) {
      alert("Faltan campos obligatorios");
      return;
    }

    const newBank = {
      name: bankName,
      holder,
      balance: 0,
      email,
      note: "",
      category: selectedCategory,
    };

    try {
      const createdBank = await createBank(newBank);
      await mutate("banks");
      onSave({ ...createdBank, transactions: [] });
      resetFields();
      onClose();
    } catch (error) {
      console.error("❌ Error al guardar el banco:", error);
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
            {/* Botón cerrar */}
            <button
              onClick={() => { resetFields(); onClose(); }}
              className="absolute top-4 right-4 text-gray-400 hover:text-white transition"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Título */}
            <h2 className="text-2xl font-bold mb-6 text-white">Nuevo Banco</h2>

            {/* Inputs */}
            <div className="space-y-4 mb-6">
              <div>
                <label className="text-sm text-gray-400">Nombre <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  value={bankName}
                  onChange={(e) => setBankName(e.target.value)}
                  className="w-full p-3 mt-1 rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:outline-none"
                  placeholder="Nombre del banco"
                />
              </div>

              <div>
                <label className="text-sm text-gray-400">Titular</label>
                <input
                  type="text"
                  value={holder}
                  onChange={(e) => setHolder(e.target.value)}
                  className="w-full p-3 mt-1 rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:outline-none"
                  placeholder="Nombre del titular"
                />
              </div>

              <div>
                <label className="text-sm text-gray-400">Email (opcional)</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-3 mt-1 rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:outline-none"
                  placeholder="ejemplo@correo.com"
                />
              </div>

              <div>
                <label className="text-sm text-gray-400">Categoría</label>
                <input
                  type="text"
                  value={selectedCategory}
                  disabled
                  className="w-full p-3 mt-1 rounded-lg bg-gray-700 text-gray-400 cursor-not-allowed"
                />
              </div>
            </div>

            {/* Botones */}
            <div className="flex justify-end gap-4">
              <button
                onClick={() => { resetFields(); onClose(); }}
                className="px-5 py-2 rounded-lg border border-teal-500 text-teal-500 hover:bg-teal-500 hover:text-white transition"
              >
                Cancelar
              </button>
              <button
                onClick={handleSave}
                 className="px-5 py-2 rounded-lg bg-orange-600 hover:bg-orange-500 text-white font-semibold"
              >
                Crear
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
