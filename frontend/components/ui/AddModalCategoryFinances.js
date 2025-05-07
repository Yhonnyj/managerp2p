"use client";
import { useEffect, useState } from "react";
import AddTransactionToCategoryModal from "./AddTransactionToCategoryModal";
import EditTransactionModal from "./EditTransactionModal";

export default function AddModalCategoryFinances({ open, onClose, categoria }) {
  const [openAddModal, setOpenAddModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [transaccionActiva, setTransaccionActiva] = useState(null);
  const [transacciones, setTransacciones] = useState([]);
  const [filtros, setFiltros] = useState({
    desde: "",
    hasta: "",
    texto: "",
    montoMin: "",
    tipo: "",
  });

  useEffect(() => {
    if (categoria?.transaccionesList) {
      setTransacciones(categoria.transaccionesList);
    }
  }, [categoria]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  if (!open || !categoria) return null;

  const transaccionesFiltradas = transacciones.filter((item) => {
    const fechaValida =
      (!filtros.desde || item.fecha >= filtros.desde) &&
      (!filtros.hasta || item.fecha <= filtros.hasta);

    const textoValido =
      !filtros.texto || item.descripcion.toLowerCase().includes(filtros.texto.toLowerCase());

    const montoValido = !filtros.montoMin || item.monto >= parseFloat(filtros.montoMin);

    const tipoValido = !filtros.tipo || item.tipo === filtros.tipo;

    return fechaValida && textoValido && montoValido && tipoValido;
  });

  const handleEditar = (transaccion) => {
    setTransaccionActiva(transaccion);
    setOpenEditModal(true);
  };

  const guardarCambios = (transaccionEditada) => {
    const actualizadas = transacciones.map((item) =>
      item === transaccionActiva ? transaccionEditada : item
    );
    setTransacciones(actualizadas);
  };

  return (
    <div className="fixed inset-0 bg-[rgba(0,0,0,0.6)] flex items-center justify-center z-50">
      <div className="bg-gray-900 text-white w-full max-w-3xl rounded-2xl shadow-lg p-6">
        {/* Encabezado */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">{categoria.nombre}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-red-400 text-xl font-bold">
            ×
          </button>
        </div>

        {/* Botón y filtros */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-3">
            <button
              onClick={() => setOpenAddModal(true)}
              className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm"
            >
              + Agregar transacción
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-2 text-sm">
            <input
              type="date"
              value={filtros.desde}
              onChange={(e) => setFiltros({ ...filtros, desde: e.target.value })}
              className="bg-gray-800 rounded px-3 py-2 w-full"
            />
            <input
              type="date"
              value={filtros.hasta}
              onChange={(e) => setFiltros({ ...filtros, hasta: e.target.value })}
              className="bg-gray-800 rounded px-3 py-2 w-full"
            />
            <input
              type="text"
              value={filtros.texto}
              onChange={(e) => setFiltros({ ...filtros, texto: e.target.value })}
              className="bg-gray-800 rounded px-3 py-2 w-full"
              placeholder="Descripción"
            />
            <input
              type="number"
              value={filtros.montoMin}
              onChange={(e) => setFiltros({ ...filtros, montoMin: e.target.value })}
              className="bg-gray-800 rounded px-3 py-2 w-full"
              placeholder="Monto mínimo"
            />
            <select
              value={filtros.tipo}
              onChange={(e) => setFiltros({ ...filtros, tipo: e.target.value })}
              className="bg-gray-800 rounded px-3 py-2 w-full col-span-1 sm:col-span-2 lg:col-span-1"
            >
              <option value="">Todos los tipos</option>
              <option value="Ingreso">Ingreso</option>
              <option value="Egreso">Egreso</option>
            </select>
          </div>
        </div>

        {/* Tabla */}
        <table className="w-full text-sm">
          <thead className="border-b border-gray-600">
            <tr>
              <th className="text-left py-2">Fecha</th>
              <th className="text-left py-2">Descripción</th>
              <th className="text-right py-2">Monto</th>
            </tr>
          </thead>
          <tbody>
            {transaccionesFiltradas.map((item, index) => (
              <tr
                key={index}
                className="border-b border-gray-700 hover:bg-gray-800 cursor-pointer"
                onClick={() => handleEditar(item)}
              >
                <td className="py-2">{item.fecha}</td>
                <td className="py-2">{item.descripcion}</td>
                <td className="py-2 text-right">${item.monto}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Botón cerrar */}
        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 text-white"
          >
            Cerrar
          </button>
        </div>
      </div>

      {/* Modales */}
      <AddTransactionToCategoryModal
        open={openAddModal}
        onClose={() => setOpenAddModal(false)}
        onAdd={(nueva) => setTransacciones([...transacciones, nueva])}
      />

   <EditTransactionModal
  open={openEditModal}
  onClose={() => setOpenEditModal(false)}
  transaccion={transaccionActiva}
  onSave={guardarCambios}
  onDelete={(transaccionAEliminar) => {
    const actualizadas = transacciones.filter(
      (item) => item !== transaccionAEliminar
    );
    setTransacciones(actualizadas);
  }}
/>

    </div>
  );
}
