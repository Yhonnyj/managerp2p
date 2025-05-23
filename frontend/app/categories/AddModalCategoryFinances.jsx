"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import AddTransactionToCategoryModal from "./AddTransactionToCategoryModal";
import EditTransactionModal from "./EditTransactionModal";
import { mutate } from "swr";
import { CopyPlus } from "lucide-react";


export default function AddModalCategoryFinances({ open, onClose, categoria, categorias = [] }) {
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

  const categoriaCompleta = categorias.find(
    (c) => c.nombre === categoria.nombre || c.name === categoria.nombre
  );

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

  const handleAgregar = (nueva) => {
    setTransacciones([...transacciones, nueva]);
    mutate("categorias");
  };

  const handleGuardarEdicion = (editada) => {
    setTransacciones((prev) =>
      prev.map((t) => (t.id === editada.id ? editada : t))
    );
    mutate("categorias");
  };

  const handleEliminar = (transaccion) => {
    setTransacciones((prev) => prev.filter((t) => t.id !== transaccion.id));
    mutate("categorias");
  };

  return (
    <AnimatePresence>
      {open && categoria && (
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
            className="w-full max-w-4xl bg-gray-900 text-white rounded-2xl shadow-2xl p-6 relative"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold">{categoria.nombre}</h2>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-red-500 text-2xl transition"
              >
                ×
              </button>
            </div>

          <div className="flex justify-end mb-4">
  <button
    onClick={() => setOpenAddModal(true)}
    className="bg-orange-600 hover:bg-orange-700 text-white text-sm px-4 py-2 rounded-xl shadow flex items-center gap-2 transition"
  >
    <CopyPlus className="w-4 h-4" />
    Agregar transacción
  </button>
</div>


            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6 text-sm">
              <input
                type="date"
                value={filtros.desde}
                onChange={(e) => setFiltros({ ...filtros, desde: e.target.value })}
                className="rounded-xl bg-gray-800 border border-gray-700 px-3 py-2 w-full text-white placeholder-gray-400"
              />
              <input
                type="date"
                value={filtros.hasta}
                onChange={(e) => setFiltros({ ...filtros, hasta: e.target.value })}
                className="rounded-xl bg-gray-800 border border-gray-700 px-3 py-2 w-full text-white"
              />
              <input
                type="text"
                placeholder="Descripción"
                value={filtros.texto}
                onChange={(e) => setFiltros({ ...filtros, texto: e.target.value })}
                className="rounded-xl bg-gray-800 border border-gray-700 px-3 py-2 w-full text-white"
              />
              <input
                type="number"
                placeholder="Monto mínimo"
                value={filtros.montoMin}
                onChange={(e) => setFiltros({ ...filtros, montoMin: e.target.value })}
                className="rounded-xl bg-gray-800 border border-gray-700 px-3 py-2 w-full text-white"
              />
              <select
                value={filtros.tipo}
                onChange={(e) => setFiltros({ ...filtros, tipo: e.target.value })}
                className="rounded-xl bg-gray-800 border border-gray-700 px-3 py-2 w-full text-white"
              >
                <option value="">Todos los tipos</option>
                <option value="Ingreso">Ingreso</option>
                <option value="Egreso">Egreso</option>
              </select>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm table-auto">
                <thead className="border-b border-gray-700 text-left">
                  <tr>
                    <th className="py-2">Fecha</th>
                    <th className="py-2">Descripción</th>
                    <th className="py-2 text-right">Monto</th>
                  </tr>
                </thead>
                <tbody>
                  {transaccionesFiltradas.map((item, index) => (
                    <tr
                      key={item.id || index}
                      onClick={() => handleEditar(item)}
                      className="hover:bg-gray-800 transition cursor-pointer border-b border-gray-800"
                    >
                      <td className="py-2">{item.date}</td>
                      <td className="py-2">{item.description}</td>
                      <td className="py-2 text-right">${item.amount}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={onClose}
                className="px-4 py-2 rounded-xl border border-teal-700 hover:bg-teal-600 text-sm transition"
              >
                Cerrar
              </button>
            </div>
          </motion.div>

          <AddTransactionToCategoryModal
            open={openAddModal}
            onClose={() => setOpenAddModal(false)}
            categoria={categoriaCompleta}
            onAdd={handleAgregar}
          />

          <EditTransactionModal
            open={openEditModal}
            onClose={() => setOpenEditModal(false)}
            transaccion={transaccionActiva}
            onSave={handleGuardarEdicion}
            onDelete={handleEliminar}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
