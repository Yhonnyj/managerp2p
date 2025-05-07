"use client";
import { useState } from "react";
import Sidebar from "../../components/Sidebar";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
  Cell,
} from "recharts";
import AddModalCategoryFinances from "../../components/ui/AddModalCategoryFinances";

export default function CategoriasPage() {
  const [openModal, setOpenModal] = useState(null);

  const categorias = [
    {
      nombre: "💼 Gastos operativos",
      total: 1250,
      transacciones: 8,
      color: "bg-gray-800 border border-red-500 text-red-400",
      fillColor: "#ef4444",
      data: [
        { name: "Ene", value: 300 },
        { name: "Feb", value: 500 },
        { name: "Mar", value: 450 },
        { name: "Abr", value: 100 },
      ],
      transaccionesList: [
        { fecha: "2025-03-01", monto: 200, descripcion: "Pago oficina" },
        { fecha: "2025-03-05", monto: 150, descripcion: "Servicios públicos" },
      ],
    },
    {
      nombre: "📄 Retiros",
      total: 980,
      transacciones: 4,
      color: "bg-gray-800 border border-yellow-500 text-yellow-300",
      fillColor: "#ca8a04",
      data: [
        { name: "Ene", value: 200 },
        { name: "Feb", value: 300 },
        { name: "Mar", value: 480 },
        { name: "Abr", value: 100 },
      ],
      transaccionesList: [
        { fecha: "2025-03-03", monto: 300, descripcion: "Retiro a Zinli" },
        { fecha: "2025-03-10", monto: 180, descripcion: "Retiro a efectivo" },
      ],
    },
    {
      nombre: "📈 Inversiones",
      total: 2100,
      transacciones: 5,
      color: "bg-gray-800 border border-green-500 text-green-400",
      fillColor: "#22c55e",
      data: [
        { name: "Ene", value: 600 },
        { name: "Feb", value: 750 },
        { name: "Mar", value: 750 },
        { name: "Abr", value: 100 },
      ],
      transaccionesList: [
        { fecha: "2025-03-02", monto: 1000, descripcion: "Compra BTC" },
        { fecha: "2025-03-20", monto: 1100, descripcion: "Compra acciones" },
      ],
    },
    {
      nombre: "🗞 Cuentas por pagar",
      total: 350,
      transacciones: 2,
      color: "bg-gray-800 border border-purple-500 text-purple-300",
      fillColor: "#a855f7",
      data: [
        { name: "Ene", value: 100 },
        { name: "Feb", value: 150 },
        { name: "Mar", value: 100 },
        { name: "Abr", value: 100 },
      ],
      transaccionesList: [
        { fecha: "2025-03-08", monto: 150, descripcion: "Proveedor X" },
        { fecha: "2025-03-15", monto: 200, descripcion: "Factura pendiente" },
      ],
    },
    {
      nombre: "✅ Cuentas por cobrar",
      total: 1700,
      transacciones: 3,
      color: "bg-gray-800 border border-blue-500 text-blue-400",
      fillColor: "#3b82f6",
      data: [
        { name: "Ene", value: 800 },
        { name: "Feb", value: 500 },
        { name: "Mar", value: 400 },
        { name: "Abr", value: 100 },
      ],
      transaccionesList: [
        { fecha: "2025-03-05", monto: 900, descripcion: "Cliente 1" },
        { fecha: "2025-03-19", monto: 800, descripcion: "Cliente 2" },
      ],
    },
  ];

  const [mesSeleccionado, setMesSeleccionado] = useState("Todos");
  const meses = ["Todos", "Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];

  return (
    <div className="flex min-h-screen bg-gray-900 text-white overflow-y-auto">
      <Sidebar />

      <div className="ml-64 px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-2xl font-bold mb-6">Categorías de Finanzas</h1>

        <div className="grid grid-cols-5 gap-5">
          {categorias.map((cat, index) => (
            <div
              key={index}
              className={`rounded-xl shadow-sm p-4 ${cat.color} transition hover:shadow-md flex flex-col justify-between`}
            >
              <div>
                <h2 className="text-base font-semibold mb-1">{cat.nombre}</h2>
                <p className="text-sm text-gray-400 mb-1">
                  {cat.transacciones} transacciones
                </p>
                <p className="text-xl font-bold mb-2">
                  ${cat.total.toLocaleString()}
                </p>
                <div className="h-24">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={cat.data}>
                      <XAxis dataKey="name" hide />
                      <YAxis hide />
                      <Tooltip />
                      <Bar dataKey="value" fill={cat.fillColor} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <button
                onClick={() => setOpenModal(index)}
                className="mt-3 w-full text-sm font-medium text-center py-1.5 rounded-xl bg-white/80 hover:bg-white text-gray-800 border border-gray-300"
              >
                Ver transacciones
              </button>
            </div>
          ))}
        </div>

    

        <div className="mt-10">
  <div className="flex justify-between items-center mb-3">
    <h2 className="text-lg font-bold">Comparativa general por categoría</h2>

    {/* Filtro por mes */}
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
          <Cell fill="#ef4444" />
          <Cell fill="#ca8a04" />
          <Cell fill="#22c55e" />
          <Cell fill="#a855f7" />
          <Cell fill="#3b82f6" />
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  </div>
</div>

<AddModalCategoryFinances
  open={openModal !== null}
  onClose={() => setOpenModal(null)}
  categoria={categorias[openModal]}
/>
</div>
</div>
);
}
