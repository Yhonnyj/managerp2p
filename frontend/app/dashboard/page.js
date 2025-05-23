"use client";

import { useState, useEffect } from "react";
import useAuth from "@/hooks/useAuth";
import DashboardStats from "./DashboardStats";
import ClientsSection from "./ClientsSection";
import OperationsSection from "./OperationsSection";

export default function DashboardPage() {
  useAuth(); // ✅ Redirige si no hay token

  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("accessToken");

      try {
        const res = await fetch("http://127.0.0.1:8000/api/transaction/dashboard/summary/", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          const text = await res.text();
          console.error("❌ Error en el API del dashboard:", res.status, text);
          throw new Error("No se pudo cargar el resumen del dashboard.");
        }

        const json = await res.json();
        setData(json);
      } catch (err) {
        console.error("❌ Error inesperado al obtener el dashboard:", err.message);
        setError("Error al cargar el dashboard. Verifica la consola.");
      }
    };

    fetchData();
  }, []);

  if (error) {
    return (
      <div className="ml-64 min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-500 mb-4">Error al cargar el dashboard</h1>
          <p className="text-gray-400">{error}</p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="ml-64 min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <p className="text-gray-300">Cargando dashboard...</p>
      </div>
    );
  }

  return (
    <div className="ml-64 min-h-screen bg-gray-900 text-white overflow-y-auto">
      <div className="max-w-7xl mx-auto px-6 py-6">
        <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

        {/* 📊 Tarjetas resumen */}
        <DashboardStats data={data} />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          <ClientsSection />
          <OperationsSection />
        </div>
      </div>
    </div>
  );
}
