"use client";

import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from "recharts";

export default function CategoryCard({ categoria, onClick }) {
  if (!categoria) return null;

  return (
    <div
      className={`rounded-xl shadow-sm p-4 ${categoria.color} transition hover:shadow-md flex flex-col justify-between`}
    >
      <div>
        <h2 className="text-base font-semibold mb-1">{categoria.nombre}</h2>
        <p className="text-sm text-gray-400 mb-1">
          {categoria.transacciones} transacciones
        </p>
        <p className="text-xl font-bold mb-2">
          ${categoria.total.toLocaleString()}
        </p>

        <div className="h-24">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={categoria.data}>
              <XAxis dataKey="name" hide />
              <YAxis hide />
              <Tooltip />
              <Bar dataKey="value" fill={categoria.fillColor || "#3b82f6"} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <button
        onClick={onClick}
        className="mt-3 w-full text-sm font-medium text-center py-1.5 rounded-xl bg-white/80 hover:bg-white text-gray-800 border border-gray-300"
      >
        Ver transacciones
      </button>
    </div>
  );
}
