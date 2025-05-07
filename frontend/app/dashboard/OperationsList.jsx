"use client";

import React, { useState } from "react";
import useSWR from "swr";
import TransactionEditModal from "../../app/transactions/TransactionEditModal";

const fetcher = (url) => fetch(url).then((res) => res.json());

export default function OperationsList() {
  const { data: transactions = [] } = useSWR(
    "http://127.0.0.1:8000/api/transaction/dashboard/ultimas-transacciones/",
    fetcher,
    {
      fallbackData: [],
      revalidateOnFocus: false,
    }
  );

  const [showAll, setShowAll] = useState(false);
  const [selectedTx, setSelectedTx] = useState(null);

  const visibleTransactions = showAll ? transactions : transactions.slice(0, 9);

  return (
    <>
      <div className="relative overflow-x-auto rounded-2xl shadow-lg border border-gray-700 mt-6 bg-gray-900 p-4">
        <table className="w-full text-sm text-left text-gray-300">
          <thead className="text-xs uppercase bg-gray-800 text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3">ID</th>
              <th scope="col" className="px-6 py-3">Cliente</th>
              <th scope="col" className="px-6 py-3">Tipo</th>
              <th scope="col" className="px-6 py-3">USD</th>
              <th scope="col" className="px-6 py-3">Fecha</th>
            </tr>
          </thead>
          <tbody>
            {visibleTransactions.map((t) => (
              <tr
                key={t.id}
                onClick={() => setSelectedTx(t)}
                className="odd:bg-gray-900 even:bg-gray-800 border-b border-gray-700 cursor-pointer hover:bg-orange-700/20 transition-all"
              >
                <td className="px-6 py-4 font-semibold">{t.id}</td>
                <td className="px-6 py-4 truncate">{t.client_name}</td>
                <td className="px-6 py-4 capitalize">{t.transaction_type}</td>
                <td className="px-6 py-4 font-bold text-orange-400">${Number(t.usd).toFixed(2)}</td>
                <td className="px-6 py-4">{t.date}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Botón mostrar más */}
        {!showAll && transactions.length > 9 && (
          <div className="flex justify-center mt-6">
            <button
              onClick={() => setShowAll(true)}
              className="px-5 py-2 rounded-lg text-sm font-semibold border border-gray-600 hover:border-white hover:text-white transition-all text-gray-400"
            >
              ⤢ Mostrar más transacciones
            </button>
          </div>
        )}
      </div>

      {/* Modal de edición de transacción */}
      {selectedTx && (
        <TransactionEditModal
          transaction={selectedTx}
          onClose={() => setSelectedTx(null)}
        />
      )}
    </>
  );
}
