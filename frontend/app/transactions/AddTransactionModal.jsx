"use client";
import toast from "react-hot-toast";
import { X, UserRoundPlus } from "lucide-react";
import { useState, useEffect } from "react";
import useSWR from "swr";
import platformIcons from "@/utils/platformIcons";
import paymentIcons from "@/utils/paymentIcons";
import AddClientModal from "@/app/clients/AddClientModal";

const fetcher = (url) => fetch(url).then((res) => res.json());

export default function AddTransactionModal({ isOpen, onClose, onSave }) {
  const [tipo, setTipo] = useState("Compra");
  const [usdt, setUsdt] = useState("");
  const [usd, setUsd] = useState("");
  const [platform, setPlatform] = useState("");
  const [fee, setFee] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState("");
  const [client, setClient] = useState("");
  const [addClientOpen, setAddClientOpen] = useState(false);

  const { data: clientesData, mutate: refreshClientes } = useSWR("clientes-full", () =>
    fetcher("http://127.0.0.1:8000/api/transaction/clientes/full/")
  );

  useEffect(() => {
    setFee(
      platform === "Dorado" ? 0.3 :
      platform === "Apolo Pay" ? 0.2 :
      platform === "Binance" ? 0.28 : 0
    );
  }, [platform]);

  const handleSubmit = () => {
    if (!usdt || !usd || !client || !platform || !paymentMethod) {
      alert("Todos los campos son obligatorios.");
      return;
    }

    const newTransaction = {
      transaction_type: tipo.toLowerCase(),
      usdt: parseFloat(usdt),
      usd: parseFloat(usd),
      platform,
      fee: parseFloat(fee),
      payment_method: paymentMethod,
      client: parseInt(client),
      date: new Date().toISOString().split("T")[0],
    };

    onSave(newTransaction);
    onClose();
  };

  const handleNewClientSaved = async (newClient) => {
    await refreshClientes();        // Actualiza la lista
    setClient(newClient.id.toString());    // Selecciona automáticamente el nuevo cliente (en string por <select>)
    setAddClientOpen(false);       // Cierra el modal de cliente
    toast.success(`Cliente "${newClient.nombre}" agregado con éxito.`);
  };

  

  if (!isOpen) return null;

  const platforms = ["Apolo Pay", "Binance", "Bitget", "Bybit", "Dorado", "Kucoin", "Paxful", "Otro"];
  const paymentMethods = ["Banesco", "BOA", "Chase", "Facebank", "Mercantil", "Mony", "Paypal", "Zelle", "Zinli", "Wally Tech", "Otro"];

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-gray-900 text-white rounded-2xl shadow-2xl w-full max-w-2xl p-6 relative border border-gray-700">
        
        {/* Botón cerrar */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Cabecera */}
        <div className="border-b border-gray-700 pb-4 mb-6">
          <h2 className="text-2xl font-bold text-orange-400">Nueva Transacción</h2>
        </div>

        {/* Formulario */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-sm">
          {/* Tipo de transacción */}
          <div>
            <label className="text-gray-400 mb-1 block">Tipo de transacción</label>
            <select
              value={tipo}
              onChange={(e) => setTipo(e.target.value)}
              className="bg-gray-800 p-2 rounded-lg w-full"
            >
              <option>Compra</option>
              <option>Venta</option>
            </select>
          </div>

          {/* Cliente + Nuevo Cliente */}
          <div>
            <div className="flex justify-between items-center text-gray-400 mb-1">
              <span>Cliente</span>
              <button
                onClick={() => setAddClientOpen(true)}
                className="text-orange-400 hover:text-orange-300 text-xs flex items-center gap-1"
              >
                <UserRoundPlus className="w-5 h-5" />
                
              </button>
            </div>
            <select
              value={client}
              onChange={(e) => setClient(e.target.value)}
              className="bg-gray-800 p-2 rounded-lg w-full"
            >
              <option value="">Clientes</option>
              {clientesData?.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.nombre} ID {c.id}
                </option>
              ))}
            </select>
          </div>

          {/* Montos */}
          <div>
            <label className="text-gray-400 mb-1 block">Monto</label>
            <input
              type="number"
              value={usdt}
              onChange={(e) => setUsdt(e.target.value)}
              className="bg-gray-800 p-2 rounded-lg w-full"
              placeholder="USDT"
            />
          </div>

          <div>
            <label className="text-gray-400 mb-1 block">Monto</label>
            <input
              type="number"
              value={usd}
              onChange={(e) => setUsd(e.target.value)}
              className="bg-gray-800 p-2 rounded-lg w-full"
              placeholder="USD"
            />
          </div>

          {/* Plataformas */}
          <div className="col-span-2">
            <label className="text-gray-400 mb-2 block">Plataforma</label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {platforms.map((p) => (
                <button
                  key={p}
                  onClick={() => setPlatform(p)}
                  className={`flex items-center gap-2 p-2 rounded-lg border transition ${
                    platform === p
                      ? "bg-orange-800 border-orange-600"
                      : "bg-gray-800 border-gray-600 hover:bg-gray-700"
                  }`}
                >
                  <img src={platformIcons[p]} alt={p} className="w-5 h-5" />
                  <span className="text-sm">{p}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Métodos de pago */}
          <div className="col-span-2">
            <label className="text-gray-400 mb-2 block">Método de Pago</label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {paymentMethods.map((m) => (
                <button
                  key={m}
                  onClick={() => setPaymentMethod(m)}
                  className={`flex items-center gap-2 p-2 rounded-lg border transition ${
                    paymentMethod === m
                      ? "bg-orange-800 border-orange-600"
                      : "bg-gray-800 border-gray-600 hover:bg-gray-700"
                  }`}
                >
                  <img src={paymentIcons[m]} alt={m} className="w-5 h-5" />
                  <span className="text-sm">{m}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Fee */}
          <div>
            <label className="text-gray-400 mb-1 block">Fee (%)</label>
            <input
              value={fee}
              readOnly
              className="bg-gray-700 p-2 rounded-lg w-full cursor-not-allowed text-gray-300"
            />
          </div>
        </div>

        {/* Botón Guardar */}
        <div className="flex justify-end border-t border-gray-700 pt-6 mt-6">
          <button
            onClick={handleSubmit}
            className="bg-orange-700 hover:bg-orange-600 text-white font-bold px-6 py-2 rounded-lg transition"
          >
            Guardar
          </button>
        </div>
      </div>

      {/* Modal Agregar Cliente */}
      <AddClientModal
  isOpen={addClientOpen}
  onClose={() => setAddClientOpen(false)}
  onSuccess={handleNewClientSaved}
/>

    </div>
  );
}
