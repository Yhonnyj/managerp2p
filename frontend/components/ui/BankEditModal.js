"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { updateBank } from "../../app/api/bankCreateTransaction";
import { mutate } from "swr";
import { X } from "lucide-react";

export default function BankEditModal({ isOpen, onClose, bank, onSave }) {
  const [name, setName] = useState("");
  const [holder, setHolder] = useState("");
  const [note, setNote] = useState("");
  const [hidden, setHidden] = useState(false);
  const [icon, setIcon] = useState(null);

  useEffect(() => {
    if (isOpen && bank) {
      setName(bank.name || "");
      setHolder(bank.holder || "");
      setNote(bank.note || "");
      setHidden(bank.hidden || false);
      setIcon(bank.icon || null);
    }
  }, [isOpen, bank]);

  const handleSave = async () => {
    const updatedBank = {
      ...bank,
      name,
      holder,
      note,
      hidden,
      icon,
    };

    try {
      const result = await updateBank(bank.id, updatedBank);
      await mutate("banks"); // 🔁 Refresca BanksPage al instante
      onSave?.(result);      // ✅ Notifica al padre si hace falta
      onClose();             // ✅ Cierra el modal
    } catch (error) {
      console.error("❌ Error al actualizar banco:", error);
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
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-400 hover:text-white transition"
            >
              <X className="w-6 h-6" />
            </button>

            <h2 className="text-2xl font-bold mb-6 text-white">Editar Banco</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <input
                type="text"
                placeholder="Nombre"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-3 rounded-lg bg-gray-800 text-white placeholder-gray-400"
              />
              <input
                type="text"
                placeholder="Titular"
                value={holder}
                onChange={(e) => setHolder(e.target.value)}
                className="w-full p-3 rounded-lg bg-gray-800 text-white placeholder-gray-400"
              />
            </div>

            <textarea
              placeholder="Nota"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="w-full p-3 rounded-lg bg-gray-800 text-white placeholder-gray-400 resize-none mb-6"
              rows={3}
            />

            <div className="flex items-center gap-2 mb-6">
              <input
                type="checkbox"
                checked={hidden}
                onChange={() => setHidden(!hidden)}
                className="w-5 h-5 text-green-500 border-gray-600 bg-gray-700"
              />
              <label className="text-gray-300 text-sm">Ocultar banco</label>
            </div>

            <div className="flex items-center gap-4 mb-8">
              {icon && (
                <img
                  src={icon}
                  alt="icono banco"
                  className="w-12 h-12 rounded-full object-cover border border-gray-700"
                />
              )}
              <button
                onClick={() => document.getElementById("iconUpload").click()}
                className="bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded-lg text-white text-sm"
              >
                Cambiar Icono
              </button>
              <input
                id="iconUpload"
                type="file"
                accept="image/*"
                style={{ display: "none" }}
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (!file) return;
                  const reader = new FileReader();
                  reader.onloadend = () => setIcon(reader.result);
                  reader.readAsDataURL(file);
                }}
              />
            </div>

            <div className="flex justify-end gap-4">
              <button
                onClick={onClose}
                className="px-5 py-2 rounded-lg border border-teal-500 text-teal-500 hover:bg-teal-500 hover:text-white transition"
              >
                Cerrar
              </button>
              <button
                onClick={handleSave}
                className="px-5 py-2 rounded-lg bg-orange-600 hover:bg-orange-500 text-white font-semibold"
              >
                Guardar
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
