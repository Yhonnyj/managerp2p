"use client";

import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from "recharts";

export default function CategoryCard({ categoria, onClick }) {
  if (!categoria) return null;

  return (
    <div
      className={`group rounded-2xl p-6 bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 shadow-lg hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 ease-in-out flex flex-col justify-between min-h-[300px]`}
    >
      <div>
        <h2 className="text-xl font-bold mb-2 text-white tracking-tight">
          {categoria.nombre}
        </h2>
        <p className="text-sm text-gray-400 mb-1">
          {categoria.transacciones} transacciones
        </p>
        <p className="text-3xl font-extrabold text-orange-400 mb-4">
          ${categoria.total.toLocaleString()}
        </p>

        <div className="h-28">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={categoria.data}>
              <XAxis dataKey="name" hide />
              <YAxis hide />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1f2937",
                  borderColor: "#374151",
                  color: "#fff",
                  fontSize: 13,
                }}
                cursor={{ fill: "rgba(255, 255, 255, 0.05)" }}
              />
              <Bar
                dataKey="value"
                fill={categoria.fillColor || "#3b82f6"}
                radius={[6, 6, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <button
        onClick={onClick}
        className="mt-5 w-full text-base font-semibold text-center py-2 rounded-xl bg-white hover:bg-gray-100 text-gray-900 shadow-sm transition-all"
      >
        Ver transacciones
      </button>
    </div>
  );
}
