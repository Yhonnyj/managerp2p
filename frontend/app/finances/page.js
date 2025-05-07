"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import useSWR from "swr";
import { TrendingUp, TrendingDown, Banknote, Search } from "lucide-react";
import Sidebar from "../../components/Sidebar";
import FilterModal from "./FilterModal";
import { getFinanceDashboardData } from "../api/finances";
import { ResponsiveBar } from "@nivo/bar";
import { ResponsiveLine } from "@nivo/line";

export default function AnalisisFinanzas() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [showModal, setShowModal] = useState(false);
  const [pygToUsdRate, setPygToUsdRate] = useState(0);

  useEffect(() => {
    fetch("https://open.er-api.com/v6/latest/PYG")
      .then((res) => res.json())
      .then((data) => setPygToUsdRate(data.rates?.USD || 0))
      .catch(() => setPygToUsdRate(0));
  }, []);

  const convertGs = (monto, bancoNombre) => {
    if (!bancoNombre?.toLowerCase().includes("guaraní")) return monto;
    return monto * pygToUsdRate;
  };

  const filtros = {
    desde: searchParams.get("desde") || "",
    hasta: searchParams.get("hasta") || "",
    tipo: searchParams.get("tipo") || "",
    banco: searchParams.get("banco") || "",
    monto: searchParams.get("monto") || "",
  };

  const { data, isLoading, error } = useSWR(
    ["finance-dashboard", filtros],
    () => getFinanceDashboardData(filtros),
    { refreshInterval: 30000 }
  );

  const aplicarFiltros = (nuevoFiltro) => {
    const query = new URLSearchParams(nuevoFiltro).toString();
    router.push(`?${query}`);
    setShowModal(false);
  };

  const {
    ingresos_por_banco = [],
    ingresos_vs_egresos = [],
    banco_mayor_ingreso,
    mes_mayor_egreso,
    promedio_mensual,
  } = data || {};

  if (isLoading) return <div className="text-white p-8">Cargando datos...</div>;
  if (error) return <div className="text-red-500 p-8">Error al cargar los datos.</div>;

  return (
    <div className="flex min-h-screen bg-gray-900 text-white">
      <Sidebar />
      <div className="flex-1 p-8 ml-64">
        <h1 className="text-3xl font-bold mb-8">Análisis Inteligente</h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <Card
            title="Banco con más ingresos"
            value={
              banco_mayor_ingreso
                ? `${banco_mayor_ingreso.banco} ($${convertGs(
                    banco_mayor_ingreso.ingreso,
                    banco_mayor_ingreso.banco
                  ).toFixed(2)})`
                : "Cargando..."
            }
            icon={<Banknote className="w-10 h-10 text-orange-400 animate-pulse" />}
          />
          <Card
            title="Mes con más egresos"
            value={
              mes_mayor_egreso
                ? `${mes_mayor_egreso.mes} ($${convertGs(
                    mes_mayor_egreso.egreso,
                    mes_mayor_egreso.banco
                  ).toFixed(2)})`
                : "Cargando..."
            }
            icon={<TrendingDown className="w-10 h-10 text-red-400 animate-pulse" />}
          />
          <Card
            title="Promedio mensual"
            value={`Ingreso: $${convertGs(
              promedio_mensual?.ingreso || 0,
              promedio_mensual?.banco
            ).toFixed(2)}  Egreso: $${convertGs(
              promedio_mensual?.egreso || 0,
              promedio_mensual?.banco
            ).toFixed(2)}`}
            icon={<TrendingUp className="w-10 h-10 text-green-400 animate-pulse" />}
          />
          <ActionCard
            title="Buscador Avanzado"
            onClick={() => setShowModal(true)}
            icon={<Search className="w-10 h-10 text-blue-400 animate-pulse" />}
          />
        </div>

        {/* Gráfico de barras */}
        {ingresos_por_banco.length > 0 && (
          <div className="bg-gray-800 p-6 rounded-2xl shadow-lg mb-8">
            <h2 className="text-xl font-bold mb-6">Ingresos por Banco</h2>
            <div className="h-[400px]">
              <ResponsiveBar
                data={ingresos_por_banco.map((item) => ({
                  ...item,
                  ingreso: convertGs(item.ingreso, item.banco),
                }))}
                keys={["ingreso"]}
                indexBy="banco"
                margin={{ top: 10, right: 30, bottom: 50, left: 60 }}
                padding={0.3}
                colors={{ scheme: "nivo" }}
                borderRadius={6}
                axisBottom={{ tickSize: 5, tickPadding: 5, tickRotation: -25 }}
                axisLeft={{ tickSize: 5, tickPadding: 5 }}
                theme={{
                  axis: {
                    ticks: { text: { fill: "#e5e7eb", fontSize: 12 } },
                    legend: { text: { fill: "#e5e7eb", fontSize: 14 } },
                  },
                  tooltip: { container: { background: "#1f2937", color: "#fff" } },
                }}
              />
            </div>
          </div>
        )}

        {/* Gráfico de líneas */}
        {ingresos_vs_egresos.length > 0 && (
          <div className="bg-gray-800 p-6 rounded-2xl shadow-lg">
            <h2 className="text-xl font-bold mb-6">Ingresos vs Egresos por Mes</h2>
            <div className="h-[400px]">
              <ResponsiveLine
                data={[
                  {
                    id: "Ingreso",
                    data: ingresos_vs_egresos.map((item) => ({
                      x: item.mes,
                      y: convertGs(item.ingreso, item.banco),
                    })),
                  },
                  {
                    id: "Egreso",
                    data: ingresos_vs_egresos.map((item) => ({
                      x: item.mes,
                      y: convertGs(item.egreso, item.banco),
                    })),
                  },
                ]}
                margin={{ top: 20, right: 30, bottom: 50, left: 60 }}
                xScale={{ type: "point" }}
                yScale={{ type: "linear", min: "auto", max: "auto", stacked: false }}
                colors={{ scheme: "nivo" }}
                axisBottom={{ tickRotation: -25 }}
                axisLeft={{ tickSize: 5, tickPadding: 5 }}
                theme={{
                  axis: {
                    ticks: { text: { fill: "#e5e7eb", fontSize: 12 } },
                    legend: { text: { fill: "#e5e7eb", fontSize: 14 } },
                  },
                  tooltip: { container: { background: "#1f2937", color: "#fff" } },
                }}
                pointBorderWidth={3}
                pointBorderColor={{ from: "serieColor" }}
                useMesh={true}
              />
            </div>
          </div>
        )}
      </div>

      {showModal && (
        <FilterModal
          initialFilters={filtros}
          onClose={() => setShowModal(false)}
          onApply={aplicarFiltros}
        />
      )}
    </div>
  );
}

function Card({ title, value, icon }) {
  return (
    <div className="flex flex-col items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 rounded-2xl p-6 shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 ease-in-out">
      {icon}
      <h3 className="text-md text-gray-400 font-semibold mt-4">{title}</h3>
      <p className="text-2xl font-bold text-orange-400 mt-2">{value}</p>
    </div>
  );
}

function ActionCard({ title, onClick, icon }) {
  return (
    <div
      onClick={onClick}
      className="flex flex-col items-center justify-center bg-gradient-to-br from-gray-700 to-gray-800 border border-gray-700 rounded-2xl p-6 shadow-lg hover:shadow-2xl hover:scale-105 hover:bg-gray-700 cursor-pointer transition-all duration-300 ease-in-out"
    >
      {icon}
      <h3 className="text-md text-gray-300 font-semibold mt-4">{title}</h3>
    </div>
  );
}
