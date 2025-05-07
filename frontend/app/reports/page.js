"use client";

import { useState } from "react";
import useSWR from "swr";
import { ResponsivePie } from "@nivo/pie";
import { ResponsiveBar } from "@nivo/bar";
import { TrendingUp, TrendingDown, ShoppingCart, Store } from "lucide-react";
import Sidebar from "../../components/Sidebar";

const fetcher = (url) => fetch(url).then((res) => res.json());

export default function ReportsPage() {
  const [filtro, setFiltro] = useState("mes");
  const [mes, setMes] = useState(new Date().getMonth() + 1);
  const [anio, setAnio] = useState(new Date().getFullYear());

  const query = filtro === "semana" ? "tipo=semana" : `tipo=mes&mes=${mes}&anio=${anio}`;
  const { data, isLoading } = useSWR(
    `http://127.0.0.1:8000/api/transaction/dashboard/reporte-completo/?${query}`,
    fetcher
  );

  const resumen = data?.resumen || {};
  const plataformas = data?.plataformas || [];
  const metodosPago = data?.metodos_pago || [];
  const tiposTransaccion = data?.tipos_transaccion || [];
  const operacionesMensuales = data?.operaciones_mensuales || [];

  return (
    <div className="flex">
      <Sidebar />
      <div className="bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 text-white min-h-screen p-8 flex-1 ml-64 animate-fadeIn">
        <h1 className="text-3xl font-bold mb-8">Reportes</h1>

        {/* Tarjetas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard icon={<TrendingUp className="w-10 h-10 text-orange-400 animate-pulse" />} title="Transacciones" value={resumen?.transacciones_totales ?? 0} />
          <StatCard icon={<Store className="w-10 h-10 text-green-400 animate-pulse" />} title="Ganancias" value={`$${(resumen?.ganancia || 0).toFixed(2)}`} />
          <StatCard icon={<ShoppingCart className="w-10 h-10 text-blue-400 animate-pulse" />} title="Compras" value={`$${resumen?.compras?.usd ?? 0}`} />
          <StatCard icon={<TrendingDown className="w-10 h-10 text-red-400 animate-pulse" />} title="Ventas" value={`$${resumen?.ventas?.usd ?? 0}`} />
        </div>

        {/* Filtros */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-gray-800 p-4 rounded-lg shadow-lg mb-10">
          <select value={filtro} onChange={(e) => setFiltro(e.target.value)} className="bg-gray-700 text-white p-3 rounded-lg">
            <option value="mes">Mes</option>
            <option value="semana">7 días</option>
          </select>

          {filtro === "mes" && (
            <>
              <select value={mes} onChange={(e) => setMes(Number(e.target.value))} className="bg-gray-700 text-white p-3 rounded-lg">
                {Array.from({ length: 12 }, (_, i) => (
                  <option key={i + 1} value={i + 1}>
                    Mes {i + 1}
                  </option>
                ))}
              </select>
              <select value={anio} onChange={(e) => setAnio(Number(e.target.value))} className="bg-gray-700 text-white p-3 rounded-lg">
                {[2024, 2025].map((a) => (
                  <option key={a} value={a}>
                    {a}
                  </option>
                ))}
              </select>
            </>
          )}
        </div>

        {/* Gráficos Premium */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <PieChartComponent title="Distribución por Plataforma" data={plataformas} loading={isLoading} />
          <PieChartComponent title="Distribución por Método de Pago" data={metodosPago} loading={isLoading} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-10">
          <BarChartComponent title="Crecimiento Mensual de Operaciones" data={operacionesMensuales} loading={isLoading} />
          <PieChartComponent title="Compras vs Ventas" data={tiposTransaccion} loading={isLoading} colores={["#4CAF50", "#FF5722"]} />
        </div>
      </div>
    </div>
  );
}

// 📊 Tarjeta estadística
function StatCard({ icon, title, value }) {
  return (
    <div className="flex flex-col items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 rounded-2xl p-6 shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 ease-in-out">
      {icon}
      <h3 className="text-lg text-gray-300 font-semibold mt-4">{title}</h3>
      <p className="text-3xl font-bold text-orange-400 mt-2">{value}</p>
    </div>
  );
}

// 📈 Gráfico Pie Premium
function PieChartComponent({ title, data, loading, colores }) {
  const colors = colores || { scheme: "category10" };

  return (
    <div className="bg-gray-800 p-6 rounded-2xl shadow-lg">
      <h2 className="text-xl font-bold text-white mb-6">{title}</h2>
      {loading ? (
        <div className="h-[350px] bg-gray-700 rounded-lg animate-pulse" />
      ) : (
        <div className="h-[350px]">
          <ResponsivePie
            data={data.map(d => ({
              id: d.name,
              label: d.name,
              value: d.value
            }))}
            margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
            innerRadius={0.5}
            padAngle={0.7}
            cornerRadius={3}
            activeOuterRadiusOffset={8}
            colors={colors}
            borderWidth={1}
            borderColor={{ from: "color", modifiers: [["darker", 0.2]] }}
            arcLinkLabelsSkipAngle={10}
            arcLinkLabelsTextColor="#ccc"
            arcLinkLabelsThickness={2}
            arcLinkLabelsColor={{ from: "color" }}
            arcLabelsSkipAngle={10}
            arcLabelsTextColor="#ffffff"
            theme={{
              tooltip: {
                container: {
                  background: "#1F2937",
                  color: "#fff",
                  fontSize: 12,
                },
              },
            }}
          />
        </div>
      )}
    </div>
  );
}

// 📊 Gráfico Bar Premium
function BarChartComponent({ title, data, loading }) {
  return (
    <div className="bg-gray-800 p-6 rounded-2xl shadow-lg">
      <h2 className="text-xl font-bold text-white mb-6">{title}</h2>
      {loading ? (
        <div className="h-[350px] bg-gray-700 rounded-lg animate-pulse" />
      ) : (
        <div className="h-[350px]">
          <ResponsiveBar
            data={data.map((d) => ({ name: d.name, value: d.value }))}
            keys={["value"]}
            indexBy="name"
            margin={{ top: 50, right: 50, bottom: 50, left: 50 }}
            padding={0.4}
            colors={{ scheme: "nivo" }}
            axisBottom={{ tickSize: 5, tickPadding: 5, tickRotation: 0 }}
            axisLeft={{ tickSize: 5, tickPadding: 5, tickRotation: 0 }}
            theme={{
              tooltip: {
                container: {
                  background: "#1F2937",
                  color: "#fff",
                },
              },
              axis: {
                ticks: {
                  text: { fill: "#ffffff" },
                },
              },
            }}
          />
        </div>
      )}
    </div>
  );
}
