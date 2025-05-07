"use client";

import React from "react";
import useSWR from "swr";
import Chart from "react-apexcharts";

const months = [
  "Ene", "Feb", "Mar", "Abr", "May", "Jun",
  "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"
];

// 🔹 Fetch simple
const fetcher = (url) => fetch(url).then((res) => res.json());

export default function ClientsChart() {
  const { data } = useSWR(
    "http://127.0.0.1:8000/api/transaction/dashboard/clientes-por-mes/",
    fetcher,
    {
      fallbackData: { series: new Array(12).fill(0) },
      revalidateOnFocus: false,
      refreshInterval: 60000,
    }
  );

  const chartData = {
    series: [
      {
        name: "Clientes Nuevos",
        data: data.series,
      },
    ],
    options: {
      chart: {
        type: "bar",
        height: 360,
        background: "transparent",
        toolbar: { show: false },
        animations: {
          enabled: true,
          easing: "easeinout",
          speed: 300,
          animateGradually: { enabled: true, delay: 50 },
          dynamicAnimation: { enabled: true, speed: 300 },
        },
      },
      plotOptions: {
        bar: {
          borderRadius: 6,
          columnWidth: "50%",
        },
      },
      dataLabels: {
        enabled: false,
      },
      xaxis: {
        categories: months,
        labels: { style: { colors: "#E5E7EB", fontWeight: 500 } },
        axisBorder: { color: "#4B5563" },
        axisTicks: { color: "#4B5563" },
      },
      yaxis: {
        title: {
          text: "Clientes Nuevos",
          style: { color: "#E5E7EB" },
        },
        labels: { style: { colors: "#E5E7EB" } },
      },
      grid: {
        borderColor: "#374151",
        strokeDashArray: 5,
      },
      colors: ["#45B4B0"],
      tooltip: {
        theme: "dark",
      },
      states: {
        hover: {
          filter: {
            type: "darken",
            value: 0.9,
          },
        },
      },
    },
  };

  return (
    <div className="bg-gray-900 rounded-2xl p-6 shadow-lg border border-gray-700 text-white">
      <h2 className="text-xl font-bold mb-4">Clientes Nuevos por Mes</h2>
      <Chart
        options={chartData.options}
        series={chartData.series}
        type="bar"
        height={360}
      />
    </div>
  );
}
