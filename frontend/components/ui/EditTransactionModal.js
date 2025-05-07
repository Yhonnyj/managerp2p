"use client";
import React, { useState } from "react";
import { Trash2, Check } from "lucide-react";

export default function EditTransactionModal({ open, onClose, transaccion, onSave, onDelete }) {
  const [form, setForm] = useState(transaccion);

  if (!open || !transaccion) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = () => {
    onSave(form);
    onClose();
  };

  const handleDelete = () => {
    if (confirm("\u00bfEst\u00e1s seguro de que quieres eliminar esta transacci\u00f3n?")) {
      onDelete(transaccion);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-gray-900 text-white w-full max-w-lg p-6 rounded-2xl shadow-lg border border-gray-700 relative">
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
      </div>
    </div>
  );
}
