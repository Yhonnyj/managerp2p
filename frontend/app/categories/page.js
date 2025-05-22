"use client";

import { useState } from "react";
import useSWR from "swr";
import Sidebar from "../../components/Sidebar";
import { getCategories } from "../api/categories";
import CategoryCard from "./CategoryCard";
import AddModalCategoryFinances from "./AddModalCategoryFinances";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
  Cell,
} from "recharts";

// ✅ Convierte fecha a "Ene", "Feb", etc.
const getMesCorto = (fecha) => {
  const meses = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];
  const date = new Date(fecha);
  return meses[date.getMonth()];
};

export default function CategoriasPage() {
  const [openModal, setOpenModal] = useState(null);
  const [mesSeleccionado, setMesSeleccionado] = useState("Todos");

  const meses = ["Todos", "Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];
  const { data, isLoading } = useSWR("categorias", getCategories);

  if (isLoading || !data) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
        <div className="h-10 w-10 border-4 border-orange-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const categorias = (data?.results || []).map((cat) => {
    const transacciones = cat.transactions || [];

    const dataMensual = {};

    // Sumar montos por mes
    for (const t of transacciones) {
      const mes = getMesCorto(t.date);
      const monto = parseFloat(t.amount);
      dataMensual[mes] = (dataMensual[mes] || 0) + monto;
    }

    // ✅ Crear data para todos los meses, incluso si no hay datos
    const dataGrafico = meses.slice(1).map((mes) => ({
      name: mes,
      value: dataMensual[mes] || 0,
    }));

    return {
      nombre: cat.name,
      total: transacciones.reduce((acc, t) => acc + parseFloat(t.amount), 0),
      transacciones: transacciones.length,
      color: "bg-gray-800 border border-gray-600 text-white",
      fillColor: cat.color || "#3b82f6",
      data: dataGrafico,
      transaccionesList: transacciones.map((t) => ({
        fecha: t.date,
        monto: parseFloat(t.amount),
        descripcion: t.description,
      })),
    };
  });

  return (
    <div className="flex min-h-screen bg-gray-900 text-white overflow-y-auto">
      <Sidebar />
      <div className="ml-64 px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-2xl font-bold mb-6">Categorías de Finanzas</h1>

        {/* Tarjetas */}
        <div className="grid grid-cols-5 gap-5">
          {categorias.map((cat, index) => (
            <CategoryCard key={index} categoria={cat} onClick={() => setOpenModal(index)} />
          ))}
        </div>

        {/* Comparativa general */}
        <div className="mt-10">
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-lg font-bold">Comparativa general por categoría</h2>
            <select
              value={mesSeleccionado}
              onChange={(e) => setMesSeleccionado(e.target.value)}
              className="bg-gray-800 border border-gray-600 text-white text-sm px-3 py-1 rounded-lg"
            >
              {meses.map((mes) => (
                <option key={mes} value={mes}>
                  {mes === "Todos" ? "Todos los meses" : mes}
                </option>
              ))}
            </select>
          </div>

          <div className="bg-gray-800 rounded-2xl shadow p-6">
            <ResponsiveContainer width="100%" height={260}>
              <BarChart
                data={categorias.map((cat) => {
                  const totalFiltrado =
                    mesSeleccionado === "Todos"
                      ? cat.total
                      : cat.data.find((d) => d.name === mesSeleccionado)?.value || 0;

                  return {
                    nombre: cat.nombre.replace(/^[^\w\s]/, ""),
                    total: totalFiltrado,
                  };
                })}
                margin={{ top: 10, right: 30, left: 10, bottom: 40 }}
              >
                <XAxis dataKey="nombre" tick={{ fill: "#e5e7eb", fontSize: 13 }} />
                <YAxis tick={{ fill: "#e5e7eb", fontSize: 13 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1f2937",
                    borderColor: "#374151",
                    color: "#fff",
                  }}
                  cursor={{ fill: "rgba(255, 255, 255, 0.05)" }}
                />
                <Bar dataKey="total" radius={[8, 8, 0, 0]}>
                  {categorias.map((_, i) => (
                    <Cell key={i} fill={categorias[i].fillColor} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

       {/* Modal */}
{openModal !== null && categorias[openModal] && (
  <AddModalCategoryFinances
    open={true}
    onClose={() => setOpenModal(null)}
    categoria={categorias[openModal]}
  />
)}

      </div>
    </div>
  );
}
