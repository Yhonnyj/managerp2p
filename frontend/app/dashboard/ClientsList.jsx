"use client";

import React, { useState } from "react";
import useSWR from "swr";
import { UsersRound } from "lucide-react"; // Icono bonito para clientes
import TransactionHistoryModal from "../../components/ui/TransactionHistoryModal";

const fetcher = (url) => fetch(url).then((res) => res.json());

export default function ClientsList() {
  const { data: clients = [] } = useSWR(
    "http://127.0.0.1:8000/api/transaction/dashboard/clientes-ranking/",
    fetcher,
    {
      fallbackData: [],
      revalidateOnFocus: false,
    }
  );

  const [visibleCount, setVisibleCount] = useState(5);
  const [selectedClientId, setSelectedClientId] = useState(null);

  const handleShowMore = () => setVisibleCount((prev) => prev + 5);
  const handleCloseModal = () => setSelectedClientId(null);

  const visibleClients = clients.slice(0, visibleCount);
  const maxTransacciones = clients.length > 0 ? clients[0].total : 1;

  return (
    <div className="bg-gray-900 rounded-2xl p-6 shadow-lg border border-gray-700 text-white animate-fadeIn">
      {/* Encabezado */}
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-cyan-500/20 p-2 rounded-full animate-pulse">
          <UsersRound className="w-6 h-6 text-cyan-400" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-cyan-400">Clientes con Más Transacciones</h2>
          <p className="text-gray-400 text-xs">Ranking de actividad de clientes</p>
        </div>
      </div>

      {/* Cabecera tabla */}
      <div className="flex justify-between text-sm text-gray-400 px-1 mb-3">
        <span className="font-semibold">Cliente</span>
        <span className="font-semibold">Transacciones</span>
      </div>

      {/* Lista de clientes */}
      <div className="space-y-3">
        {visibleClients.map((client, index) => {
          const porcentaje = (client.total / maxTransacciones) * 100;

          return (
            <div
              key={index}
              className="flex items-center justify-between group cursor-pointer hover:bg-gray-800 rounded-lg transition-all p-2"
              onClick={() => setSelectedClientId(client.client_id)}
            >
              <div className="w-full mr-2 bg-gray-700 rounded-lg overflow-hidden">
                <div
                  className="text-sm px-3 py-2 font-semibold text-white truncate transition-all duration-500"
                  style={{
                    width: `${porcentaje}%`,
                    backgroundColor: "#45B4B0",
                  }}
                >
                  {client.client}
                </div>
              </div>
              <span className="text-sm font-semibold text-gray-300">{client.total}</span>
            </div>
          );
        })}
      </div>

      {/* Botón Mostrar más */}
      {visibleCount < clients.length && (
        <button
          onClick={handleShowMore}
          className="w-full mt-6 py-2 text-sm font-semibold rounded-lg border border-gray-600 text-gray-300 hover:text-white hover:border-white transition-all"
        >
          ⤢ Mostrar más
        </button>
      )}

      {/* Modal de historial */}
      <TransactionHistoryModal
        isOpen={selectedClientId !== null}
        onClose={handleCloseModal}
        clientId={selectedClientId}
      />
    </div>
  );
}
