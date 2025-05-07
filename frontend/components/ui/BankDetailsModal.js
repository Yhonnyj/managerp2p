"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import useSWR from "swr";
import BankAddModal from "./BankAddModal";
import BankEditModal from "./BankEditModal";
import TransactionEditModal from "./TransactionEditModal";
import { fetchBankTransactions, deleteBankTransaction, updateBank } from "../../app/api/bankCreateTransaction";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { FileText, Sheet, CopyPlus, Pencil } from "lucide-react";

const fetcher = async (bankId) => {
  const data = await fetchBankTransactions(bankId);
  return Array.isArray(data.results) ? data.results : [];
};

export default function BankDetailsModal({ isOpen, onClose, bank, onUpdate }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [addTransactionModalOpen, setAddTransactionModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [transactionModalOpen, setTransactionModalOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [bankDetails, setBankDetails] = useState(bank);

  useEffect(() => {
    if (bank?.id) setBankDetails(bank);
  }, [bank?.id]);

  const { data: transactions = [], mutate } = useSWR(
    bank?.id ? `transactions-${bank.id}` : null,
    () => fetcher(bank.id)
  );

  if (!isOpen || !bank) return null;

  const calculateBankBalance = () => {
    return Array.isArray(transactions)
      ? transactions.reduce((total, tx) => {
          const amount = parseFloat(tx.amount);
          return tx.type === "Ingreso" ? total + amount : total - amount;
        }, 0)
      : 0;
  };

  const exportToExcel = () => {
    if (!Array.isArray(transactions) || transactions.length === 0) return;
    const data = transactions.map(tx => ({
      Fecha: tx.date,
      Referencia: tx.reference || "N/A",
      Tipo: tx.type,
      Monto: Number(tx.amount).toFixed(2),
    }));
    const sheet = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, sheet, "Transacciones");
    const buffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    saveAs(new Blob([buffer]), `transacciones_${bank.name.replace(/\s+/g, "_")}.xlsx`);
  };

  const exportToPDF = () => {
    if (!Array.isArray(transactions)) return;
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text(`Transacciones - ${bank.name}`, 14, 15);
    const table = transactions.map(tx => [tx.date, tx.reference || "N/A", tx.type, `${Number(tx.amount).toFixed(2)} USD`]);
    autoTable(doc, { head: [["Fecha", "Referencia", "Tipo", "Monto"]], body: table, startY: 25 });
    doc.save(`transacciones_${bank.name.replace(/\s+/g, "_")}.pdf`);
  };

  const handleSaveTransaction = async () => {
    await mutate();
    setAddTransactionModalOpen(false);
  };

  const handleSaveEdit = async (updatedBank) => {
    const saved = await updateBank(bank.id, updatedBank);
    setBankDetails(saved);
    onUpdate(saved);
    setEditModalOpen(false);
  };

  const handleDeleteTransaction = async (transactionId) => {
    await deleteBankTransaction(bankDetails.id, transactionId);
    await mutate();
    setTransactionModalOpen(false);
  };

  const handleSelectTransaction = (tx) => {
    setSelectedTransaction(tx);
    setTransactionModalOpen(true);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-gray-900 rounded-2xl w-full max-w-4xl shadow-2xl p-6 relative"
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-4">
                {bankDetails.icon && (
                  <img
                    src={bankDetails.icon}
                    alt="icono banco"
                    className="w-12 h-12 rounded-full object-cover border border-gray-700"
                  />
                )}
                <div>
                  <h2 className="text-2xl font-bold text-white">{bankDetails.name}</h2>
                  <p className="text-sm text-gray-400">
                    {bankDetails.holder || "Titular sin nombre"} ({transactions.length} transacciones)
                  </p>
                </div>
              </div>
              <div className="flex gap-3 items-center">
                <div className="relative">
                  <button
                    onClick={() => setMenuOpen(!menuOpen)}
                    className="bg-gray-800 hover:bg-gray-700 rounded-lg p-2"
                  >
                    ⋮
                  </button>
                  {menuOpen && (
                    <div className="absolute right-0 top-12 bg-gray-800 rounded-lg shadow p-2 space-y-2 z-50">
                      <button
                        onClick={() => {
                          setAddTransactionModalOpen(true);
                          setMenuOpen(false);
                        }}
                        className="flex items-center gap-2 w-full text-left hover:bg-gray-700 rounded p-2 text-sm"
                      >
                        <CopyPlus className="w-4 h-4 text-orange-500" />
                        <span className="text-white">Registrar</span>
                      </button>
                      <button
                        onClick={() => {
                          setEditModalOpen(true);
                          setMenuOpen(false);
                        }}
                        className="flex items-center gap-2 w-full text-left hover:bg-gray-700 rounded p-2 text-sm"
                      >
                        <Pencil className="w-4 h-4 text-teal-400" />
                        <span className="text-white">Editar</span>
                      </button>
                    </div>
                  )}
                </div>
                <button onClick={onClose} className="bg-gray-800 hover:bg-gray-700 p-2 rounded-lg">✕</button>
              </div>
            </div>

            {/* Balance */}
            <div className="mb-6">
              <p className="text-lg text-orange-500 font-bold">
                Balance: ${calculateBankBalance().toFixed(2)}
              </p>
            </div>

            {/* Botones exportar */}
            <div className="flex gap-3 mb-6">
              <button onClick={exportToExcel} className="bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded flex items-center gap-2">
                <Sheet className="w-5 h-5" /> Excel
              </button>
              <button onClick={exportToPDF} className="bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded flex items-center gap-2">
                <FileText className="w-5 h-5" /> PDF
              </button>
            </div>

            {/* Tabla de transacciones */}
            <div className="bg-gray-800 rounded-lg overflow-y-auto max-h-[300px] shadow-inner">
              <table className="w-full text-sm text-left text-gray-300">
                <thead className="text-xs uppercase bg-gray-700 text-gray-400">
                  <tr>
                    <th className="px-4 py-2">Fecha</th>
                    <th className="px-4 py-2">Referencia</th>
                    <th className="px-4 py-2">Tipo</th>
                    <th className="px-4 py-2 text-right">Monto</th>
                  </tr>
                </thead>
                <tbody>
                  {Array.isArray(transactions) && transactions.length > 0 ? (
                    transactions.map((tx, index) => (
                      <tr
                        key={index}
                        onClick={() => handleSelectTransaction(tx)}
                        className={`cursor-pointer border-b border-gray-700 hover:bg-gray-700 ${
                          index % 2 === 0 ? "bg-gray-900" : "bg-gray-800"
                        }`}
                      >
                        <td className="px-4 py-2">
                          {new Date(tx.date).toLocaleString("es-VE", {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                            hour12: true,
                          })}
                        </td>
                        <td className="px-4 py-2">{tx.reference || "-"}</td>
                        <td className="px-4 py-2">{tx.type}</td>
                        <td className="px-4 py-2 text-right font-bold text-orange-400">
                          {Number(tx.amount) > 0 ? "+" : ""}${Number(tx.amount).toFixed(2)}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="text-center text-gray-400 py-8">
                        No hay transacciones registradas.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Modales */}
            <BankAddModal
              isOpen={addTransactionModalOpen}
              onClose={() => setAddTransactionModalOpen(false)}
              onSave={handleSaveTransaction}
              bankId={bankDetails.id}
              refreshTransactions={mutate}
            />
            <BankEditModal
              isOpen={editModalOpen}
              onClose={() => setEditModalOpen(false)}
              bank={bankDetails}
              onSave={handleSaveEdit}
            />
            {selectedTransaction && (
              <TransactionEditModal
                isOpen={transactionModalOpen}
                onClose={() => setTransactionModalOpen(false)}
                transaction={selectedTransaction}
                onDelete={() => handleDeleteTransaction(selectedTransaction.id)}
                onSave={mutate}
                bankId={bankDetails.id}
              />
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
