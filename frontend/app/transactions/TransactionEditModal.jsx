"use client";

import { Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast"; // ✅ Importamos toast
import platformIcons from "@/utils/platformIcons";
import paymentIcons from "@/utils/paymentIcons";

export default function TransactionEditModal({ transaction, onClose, onDeleteSuccess }) {
  const [operador, setOperador] = useState("Cargando...");
  const [isDeleting, setIsDeleting] = useState(false); // 🔥 Loading delete

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) return setOperador("Desconocido");

    fetch("http://127.0.0.1:8000/api/core/profile/", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        setOperador(data?.username || "Desconocido");
      })
      .catch(() => setOperador("Desconocido"));
  }, []);

  if (!transaction) return null;

  const handleDelete = async () => {
    if (!confirm("¿Eliminar esta transacción?")) return;
    try {
      setIsDeleting(true);

      const res = await fetch(
        `http://127.0.0.1:8000/api/transaction/transactions/${transaction.id}/`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (!res.ok) throw new Error("No se pudo eliminar");

      toast.success("✅ Transacción eliminada correctamente."); // 🎯 Elegante

      if (onDeleteSuccess) {
        onDeleteSuccess();
      } else {
        onClose();
      }
    } catch {
      toast.error("❌ Error al eliminar la transacción."); // 🎯 Elegante
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-gray-900 text-white w-full max-w-3xl rounded-2xl p-6 relative border border-gray-700 shadow-2xl">

        {/* Botón eliminar */}
        <button
          onClick={handleDelete}
          disabled={isDeleting}
          className={`absolute top-6 right-4 transition ${
            isDeleting
              ? "text-gray-500 cursor-not-allowed"
              : "text-red-500 hover:text-red-400"
          }`}
          title="Eliminar transacción"
        >
          <Trash2 className="w-7 h-7" />
        </button>

        {/* Cabecera */}
        <div className="mb-6 border-b border-gray-700 pb-4">
          <h2 className="text-2xl font-bold">
            {isDeleting ? "Eliminando..." : (
              <>Operación <span className="text-gray-400">#{transaction.id}</span></>
            )}
          </h2>
        </div>

        {/* Detalles */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-sm">
          <Detail label="Cliente" value={transaction.client_name} />
          <Detail label="Fecha" value={transaction.date} />
          <Detail label="USDT" value={transaction.usdt} />
          <Detail label="USD" value={transaction.usd} />
          <Detail label="Fee" value={transaction.fee} />
          <Detail label="Profit" value={transaction.profit} />
          <Detail
            label="Plataforma"
            value={
              <div className="flex items-center gap-2">
                {platformIcons[transaction.platform] && (
                  <img src={platformIcons[transaction.platform]} alt={transaction.platform} className="w-5 h-5" />
                )}
                <span>{transaction.platform}</span>
              </div>
            }
          />
          <Detail
            label="Método de Pago"
            value={
              <div className="flex items-center gap-2">
                {paymentIcons[transaction.payment_method] && (
                  <img src={paymentIcons[transaction.payment_method]} alt={transaction.payment_method} className="w-5 h-5" />
                )}
                <span>{transaction.payment_method || "N/A"}</span>
              </div>
            }
          />
          <Detail label="Tipo de Transacción" value={transaction.transaction_type} />
          <Detail label="Operador" value={operador} />
        </div>

        {/* Botón cerrar */}
        <div className="flex justify-end border-t border-gray-700 pt-6 mt-6">
          <button
            onClick={onClose}
            disabled={isDeleting}
            className={`px-6 py-2 rounded-lg transition font-bold ${
              isDeleting
                ? "bg-gray-600 cursor-not-allowed text-white"
                : "bg-orange-700 hover:bg-orange-600 text-white"
            }`}
          >
            {isDeleting ? "Procesando..." : "Cerrar"}
          </button>
        </div>
      </div>
    </div>
  );
}

const Detail = ({ label, value }) => (
  <div>
    <p className="text-gray-400 text-xs">{label}</p>
    {typeof value === "string" || typeof value === "number" ? (
      <p className="font-semibold text-white">{value}</p>
    ) : (
      <div className="font-semibold text-white">{value}</div>
    )}
  </div>
);
