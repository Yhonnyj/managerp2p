"use client";
import { useState } from "react";
import { mutate } from "swr";

const API_BASE_URL = "http://127.0.0.1:8000/api/finance-categories/";

export default function AddTransactionToCategoryModal({ open, onClose, categoria }) {
  const [form, setForm] = useState({
    fecha: "",
    descripcion: "",
    monto: "",
    tipo: "Ingreso",
  });

  if (!open || !categoria?.id) return null; // 🔒 Validamos que haya ID

  const handleSubmit = async () => {
    if (!form.fecha || !form.descripcion || !form.monto) {
      alert("⚠️ Todos los campos son obligatorios.");
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

      if (!res.ok) throw new Error("Error al guardar");

      await mutate("categorias");
      setForm({ fecha: "", descripcion: "", monto: "", tipo: "Ingreso" });
      onClose();
    } catch {
      alert("❌ Error al agregar la transacción");
    }
  };

  return (
    <div className="fixed inset-0 bg-[rgba(0,0,0,0.6)] flex items-center justify-center z-50">
      <div className="bg-gray-900 text-white w-full max-w-md rounded-2xl shadow-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold">Agregar transacción</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-red-400 text-xl font-bold">
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
              className="w-full mt-1 px-3 py-2 bg-gray-700 text-white rounded-lg"
            />
          </div>
          <div>
            <label className="text-sm text-gray-300">Descripción</label>
            <input
              type="text"
              value={form.descripcion}
              onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
              className="w-full mt-1 px-3 py-2 bg-gray-700 text-white rounded-lg"
              placeholder="Ej. Pago de servicios"
            />
          </div>
          <div>
            <label className="text-sm text-gray-300">Monto</label>
            <input
              type="number"
              value={form.monto}
              onChange={(e) => setForm({ ...form, monto: e.target.value })}
              className="w-full mt-1 px-3 py-2 bg-gray-700 text-white rounded-lg"
              placeholder="Ej. 150"
            />
          </div>
          <div>
            <label className="text-sm text-gray-300">Tipo</label>
            <select
              value={form.tipo}
              onChange={(e) => setForm({ ...form, tipo: e.target.value })}
              className="w-full mt-1 px-3 py-2 bg-gray-700 text-white rounded-lg"
            >
              <option value="Ingreso">Ingreso</option>
              <option value="Egreso">Egreso</option>
            </select>
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 text-white"
          >
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold"
          >
            Agregar
          </button>
        </div>
      </div>
    </div>
  );
}
