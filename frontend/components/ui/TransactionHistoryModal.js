"use client";

import useSWR, { mutate } from "swr";
import { FileText, FileSpreadsheet, X, Images } from "lucide-react";
import countries from "country-flag-emoji-json";
import { useState } from "react";
import TransactionEditModal from "../../app/transactions/TransactionEditModal";
import ClientImagesSidebar from "../../app/clients/ClientImagesSidebar";
import platformIcons from "@/utils/platformIcons";
import paymentIcons from "@/utils/paymentIcons";

const fetcher = (url) => fetch(url).then((res) => res.json());

export default function TransactionHistoryModal({ isOpen, onClose, clientId }) {
  const [selectedTx, setSelectedTx] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [showImagesSidebar, setShowImagesSidebar] = useState(false);
  const rowsPerPage = 9;

  const shouldFetch = isOpen && !!clientId;

  const { data: transactionData, isLoading: isLoadingTx } = useSWR(
    shouldFetch ? [`transactions-client`, clientId] : null,
    () => fetcher(`http://127.0.0.1:8000/api/transaction/transactions/?client=${clientId}`),
    { revalidateOnFocus: false }
  );

  const { data: clientesData } = useSWR(
    shouldFetch ? "clientes-full" : null,
    () => fetcher("http://127.0.0.1:8000/api/transaction/clientes/full/"),
    { revalidateOnFocus: false }
  );

  const transactions = transactionData?.results?.filter((t) => parseInt(t.client) === parseInt(clientId)) || [];
  const totalPages = Math.ceil(transactions.length / rowsPerPage);
  const client = clientesData?.find((c) => c.id === parseInt(clientId));

  const exportToPDF = () => {
    window.open(`http://127.0.0.1:8000/api/transaction/transactions/export/pdf/${clientId}/`, "_blank");
  };

  const exportToExcel = () => {
    window.open(`http://127.0.0.1:8000/api/transaction/transactions/export/excel/${clientId}/`, "_blank");
  };

  const getCountryCode = (name) => {
    const country = countries.find((c) => c.name.toLowerCase() === name?.toLowerCase());
    return country?.code?.toLowerCase() || null;
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4 animate-fadeIn">
        <div className="bg-gray-900 text-white w-full max-w-5xl rounded-2xl shadow-2xl p-6 relative border border-gray-700">

          {/* Botón cerrar */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-white transition"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Botón ver imágenes */}
          <div className="absolute top-16 right-4">
            <button
              onClick={() => setShowImagesSidebar(true)}
              className="bg-gray-800 hover:bg-gray-700 text-white p-2 rounded-lg"
              title="Ver documentos del cliente"
            >
              <Images className="w-5 h-5" />
            </button>
          </div>

          {/* Cabecera Cliente */}
          <div className="flex items-center gap-4 border-b border-gray-700 pb-4 mb-6 mt-2">
            <img
              src={client?.pais ? `https://flagcdn.com/h40/${getCountryCode(client.pais)}.png` : "/icons/white-flag.svg"}
              alt="País"
              className="w-8 h-6 rounded border border-gray-900 shadow"
            />
            <div>
              <h2 className="text-2xl font-bold">{client?.nombre || "Cliente"} <span className="text-gray-400">#{clientId}</span></h2>
              <p className="text-sm text-gray-400">
                Total operaciones: <span className="font-semibold">{transactions.length}</span>
              </p>
            </div>
          </div>

          {/* Info + tabla */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gray-800 rounded-lg p-4 text-sm space-y-3">
              <InfoItem label="Teléfono" value={client?.telefono} />
              <InfoItem label="Dirección" value={client?.direccion} />
              <InfoItem label="Correo" value={client?.email} />
              <InfoItem label="País" value={client?.pais} />
            </div>

            {/* Tabla transacciones */}
            <div className="col-span-2 max-h-96 overflow-y-auto overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-800 text-gray-400">
                  <tr>
                    <th className="px-3 py-2">USDT</th>
                    <th className="px-3 py-2">USD</th>
                    <th className="px-3 py-2">Profit</th>
                    <th className="px-3 py-2">Pago</th>
                    <th className="px-3 py-2">Plataforma</th>
                    <th className="px-3 py-2">Fecha</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage).map((tx) => (
                    <tr
                      key={tx.id}
                      className="border-t border-gray-800 hover:bg-gray-800 cursor-pointer transition"
                      onClick={() => setSelectedTx(tx)}
                    >
                      <td className="px-3 py-2">{tx.usdt}</td>
                      <td className="px-3 py-2">{tx.usd}</td>
                      <td className="px-3 py-2">{tx.profit}</td>
                      <td className="px-3 py-2">
                        <div className="flex items-center gap-2">
                          {tx.payment_method && paymentIcons[tx.payment_method] ? (
                            <>
                              <img src={paymentIcons[tx.payment_method]} className="w-5 h-5" />
                              <span>{tx.payment_method}</span>
                            </>
                          ) : <span>{tx.payment_method || "-"}</span>}
                        </div>
                      </td>
                      <td className="px-3 py-2">
                        <div className="flex items-center gap-2">
                          {tx.platform && platformIcons[tx.platform] ? (
                            <>
                              <img src={platformIcons[tx.platform]} className="w-5 h-5" />
                              <span>{tx.platform}</span>
                            </>
                          ) : <span>{tx.platform || "-"}</span>}
                        </div>
                      </td>
                      <td className="px-3 py-2">{tx.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {transactions.length === 0 && !isLoadingTx && (
                <div className="text-center text-gray-400 py-8">No hay transacciones disponibles.</div>
              )}

              {transactions.length > rowsPerPage && (
                <div className="flex justify-center mt-4">
                  <div className="flex items-center gap-2 bg-gray-800 p-2 rounded-lg">
                    <button
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                      className="text-gray-300 hover:text-white disabled:opacity-30"
                    >
                      &lt;
                    </button>
                    <span className="px-3 py-1 bg-orange-500 rounded-lg text-white font-bold">
                      {currentPage}
                    </span>
                    <button
                      onClick={() => setCurrentPage(prev => prev < totalPages ? prev + 1 : prev)}
                      disabled={currentPage === totalPages}
                      className="text-gray-300 hover:text-white disabled:opacity-30"
                    >
                      &gt;
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Botones exportar */}
          <div className="flex justify-end gap-4 mt-8">
            <button onClick={exportToPDF} className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded-lg transition">
              <FileText className="w-4 h-4" /> PDF
            </button>
            <button onClick={exportToExcel} className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded-lg transition">
              <FileSpreadsheet className="w-4 h-4" /> Excel
            </button>
          </div>
        </div>
      </div>

      {/* Modal editar */}
      {selectedTx && (
        <TransactionEditModal
          transaction={selectedTx}
          onClose={() => setSelectedTx(null)}
          onDeleteSuccess={() => {
            mutate(["transactions-client", clientId]);
            setSelectedTx(null);
          }}
        />
      )}

      {/* Sidebar imágenes */}
      <ClientImagesSidebar
        isOpen={showImagesSidebar}
        onClose={() => setShowImagesSidebar(false)}
        clientId={clientId}
      />
    </>
  );
}

function InfoItem({ label, value }) {
  return (
    <div>
      <p className="text-gray-400 text-xs">{label}:</p>
      <p className="font-semibold">{value || "-"}</p>
    </div>
  );
}
