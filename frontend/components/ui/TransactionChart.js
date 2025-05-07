"use client";
import React, { useState, useEffect } from "react";
import { getReports } from "../../app/api/reports";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

export default function TransactionChart() {
    const [view, setView] = useState("weekly");
    const [weeklyData, setWeeklyData] = useState([]);
    const [monthlyData, setMonthlyData] = useState([]);

    useEffect(() => {
        async function fetchData() {
            let allTransactions = [];
            let nextPage = "http://127.0.0.1:8000/api/transaction/transactions/?page=1";
            
            try {
                while (nextPage) {
                    const response = await fetch(nextPage);
                    const data = await response.json();
                    console.log("📌 Datos de página:", data);
                    
                    if (data.results) {
                        allTransactions = [...allTransactions, ...data.results];
                    }
                    nextPage = data.next;
                }
                
                console.log("📊 Todas las transacciones cargadas:", allTransactions);
                
                if (allTransactions.length === 0) {
                    console.warn("⚠ No hay transacciones en la API.");
                    return;
                }
                
                const weekMap = {};
                allTransactions.forEach(t => {
                    const day = new Date(t.date).toLocaleString("es-ES", { weekday: "short" });
                    weekMap[day] = (weekMap[day] || 0) + 1;
                });
                const weekArray = Object.keys(weekMap).map(day => ({ name: day, transactions: weekMap[day] }));
                setWeeklyData(weekArray);
                
                const monthMap = {};
                allTransactions.forEach(t => {
                    const month = new Date(t.date).toLocaleString("es-ES", { month: "short" });
                    monthMap[month] = (monthMap[month] || 0) + 1;
                });
                const monthArray = Object.keys(monthMap).map(month => ({ name: month, transactions: monthMap[month] }));
                setMonthlyData(monthArray);
                
            } catch (error) {
                console.error("❌ Error al cargar las transacciones en Reports:", error);
            }
            const data = await getReports();
            console.log("📊 Datos recibidos en TransactionChart:", data);
            
            if (!data || typeof data !== 'object' || !data.results) {
                console.error("⚠ La API no devolvió datos válidos:", data);
                return;
            }
            console.log("📊 Datos recibidos en TransactionChart:", data);
            
            const transactions = Array.isArray(data.results) ? data.results : [];
            if (transactions.length === 0) {
                console.warn("⚠ No hay transacciones en la API.");
                return;
            }

            // 📊 Procesar datos semanales
            const weekMap = {};
            transactions.forEach(t => {
                const day = new Date(t.date).toLocaleString("es-ES", { weekday: "short" });
                weekMap[day] = (weekMap[day] || 0) + 1;
            });
            const weekArray = Object.keys(weekMap).map(day => ({ name: day, transactions: weekMap[day] }));
            setWeeklyData(weekArray);

            // 📊 Procesar datos mensuales
            const monthMap = {};
            transactions.forEach(t => {
                const month = new Date(t.date).toLocaleString("es-ES", { month: "short" });
                monthMap[month] = (monthMap[month] || 0) + 1;
            });
            const monthArray = Object.keys(monthMap).map(month => ({ name: month, transactions: monthMap[month] }));
            setMonthlyData(monthArray);
        }
        fetchData();
    }, []);

    return (
        <div className="bg-gray-800 p-4 rounded-lg shadow-md">
            {/* Selector de vista */}
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-white">📊 Evolución de Transacciones</h2>
                <div className="flex gap-2">
                    <button 
                        onClick={() => setView("weekly")} 
                        className={`px-4 py-2 rounded ${view === "weekly" ? "bg-blue-600 text-white" : "bg-gray-700 text-gray-300"}`}
                    >
                        Semanal
                    </button>
                    <button 
                        onClick={() => setView("monthly")} 
                        className={`px-4 py-2 rounded ${view === "monthly" ? "bg-blue-600 text-white" : "bg-gray-700 text-gray-300"}`}
                    >
                        Mensual
                    </button>
                </div>
            </div>

            {/* Gráfico */}
            <ResponsiveContainer width="100%" height={200}>
                <LineChart data={view === "weekly" ? weeklyData : monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                    <XAxis dataKey="name" stroke="#ccc" />
                    <YAxis stroke="#ccc" />
                    <Tooltip />
                    <Line type="monotone" dataKey="transactions" stroke="#38bdf8" strokeWidth={2} />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}
