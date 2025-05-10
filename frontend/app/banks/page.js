"use client";

import { useState } from "react";
import useSWR from "swr";
import Sidebar from "../../components/Sidebar";
import BankModal from "../../components/ui/BankModal";
import BankDetailsModal from "../../components/ui/BankDetailsModal";
import BankEditModal from "../../components/ui/BankEditModal";
import { getBanks } from "../api/bank";
import { CopyPlus, BadgeDollarSign, CircleDollarSign } from "lucide-react";

const sections = [
  { title: "Dólares (USD)", currency: "$" },
  { title: "Efectivo (USD)", currency: "$" },
  { title: "Efectivo (CAD)", currency: "C$" },
  { title: "Dólares Canadienses (CAD)", currency: "C$" },
  { title: "Tether (USDT)", currency: "USD₮" },
  { title: "Guaraní Paraguayo (PYG)", currency: "₲" },
  { title: "Bancos Digitales (USD)", currency: "$" },
  { title: "Emirates Dirham (AED)", currency: "د.إ" },
];

// 🔄 Tasa PYG → USD
const fetchPygRate = async () => {
  const res = await fetch("https://open.er-api.com/v6/latest/PYG");
  const data = await res.json();
  return data.rates?.USD || 0;
};

// 🔄 Tasa CAD → USD
const fetchCadRate = async () => {
  const res = await fetch("https://open.er-api.com/v6/latest/CAD");
  const data = await res.json();
  return data.rates?.USD || 0;
};

export default function BanksPage() {
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedBank, setSelectedBank] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("");

  const { data: banks = [], mutate } = useSWR("banks", getBanks);
  const { data: pygToUsdRate, isLoading: loadingRate } = useSWR("pygToUsdRate", fetchPygRate);
  const { data: cadToUsdRate, isLoading: loadingCadRate } = useSWR("cadToUsdRate", fetchCadRate);

  if (
    loadingRate ||
    loadingCadRate ||
    typeof pygToUsdRate !== "number" ||
    typeof cadToUsdRate !== "number"
  )
    return null;

  const filteredBanks = banks.filter((bank) => {
    const term = search.toLowerCase();
    return (
      bank.name.toLowerCase().includes(term) ||
      bank.holder.toLowerCase().includes(term)
    );
  });

  const banksData = sections.map((section) => ({
    ...section,
    banks: filteredBanks.filter((bank) => bank.category === section.title),
  }));

  const calculateBankBalance = (bank) => {
    if (!bank?.transactions?.length) return 0;
    return bank.transactions.reduce((total, tx) => {
      const amount = parseFloat(tx.amount);
      return tx.type === "Ingreso" ? total + amount : total - amount;
    }, 0);
  };

  const getTotalByCurrency = (currencyCode) => {
    return banksData.reduce((total, section) => {
      if (section.currency === currencyCode) {
        return total + section.banks.reduce((acc, bank) => acc + calculateBankBalance(bank), 0);
      }
      return total;
    }, 0);
  };

  const formatBalance = (balance) => {
    return Number(balance).toLocaleString(undefined, {
      minimumFractionDigits: 2,
    });
  };

  return (
    <div className="flex min-h-screen bg-gray-900 text-white">
      <Sidebar />
      <div className="flex-1 p-8 ml-64">
        <h1 className="text-3xl font-bold mb-8">Bancos</h1>

        {/* TARJETAS DE RESUMEN */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
  {["$", "USD₮", "C$", "₲"].map((currency, idx) => {
    let total = getTotalByCurrency(currency);
    let usdEquiv = 0;

    if (currency === "$") {
      const pygSection = banksData.find((s) => s.currency === "₲");
      const pygBalance = pygSection
        ? pygSection.banks.reduce(
            (acc, bank) => acc + calculateBankBalance(bank),
            0
          )
        : 0;
      total += pygBalance * pygToUsdRate;

      const cadSections = banksData.filter((s) => s.currency === "C$");
      const cadBalance = cadSections.reduce((sum, section) => {
        return (
          sum +
          section.banks.reduce(
            (acc, bank) => acc + calculateBankBalance(bank),
            0
          )
        );
      }, 0);
      total += cadBalance * cadToUsdRate;
    }

    if (currency === "₲") {
      const pygSection = banksData.find((s) => s.currency === "₲");
      const pygBalance = pygSection
        ? pygSection.banks.reduce(
            (acc, bank) => acc + calculateBankBalance(bank),
            0
          )
        : 0;
      usdEquiv = pygBalance * pygToUsdRate;
    }

    if (currency === "C$") {
      const cadSections = banksData.filter((s) => s.currency === "C$");
      const cadBalance = cadSections.reduce((sum, section) => {
        return (
          sum +
          section.banks.reduce(
            (acc, bank) => acc + calculateBankBalance(bank),
            0
          )
        );
      }, 0);
      usdEquiv = cadBalance * cadToUsdRate;
    }

    return (
      <div
        key={idx}
        className="relative group flex flex-col items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 rounded-2xl p-6 shadow-lg hover:shadow-2xl hover:scale-105 transition-all"
      >
        <p className="text-sm text-gray-400">Total {currency}</p>
        <p className="text-2xl font-bold text-orange-400 mt-2">
          {currency}
          {formatBalance(total)}
        </p>

        {/* Tooltip extra solo para ₲ y C$ */}
        {(currency === "₲" || currency === "C$") && (
         <div className="absolute bottom-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity text-xs bg-gray-800 text-white px-2 py-1 rounded shadow-md pointer-events-none flex items-center gap-1">
         <CircleDollarSign className="w-4 h-4 text-white" />
         ${formatBalance(usdEquiv)} USD
       </div>
        )}
      </div>
    );
  })}
</div>


        {/* BUSCADOR */}
        <input
          type="text"
          placeholder="Buscar banco o titular"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full p-3 mb-8 rounded-lg bg-gray-800 text-white border border-gray-700"
        />

        {/* LISTA DE BANCOS POR SECCIÓN */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {banksData.map((section) => (
            <div
              key={section.title}
              className="bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all"
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-bold text-white">{section.title}</h2>
                <button
                  onClick={() => {
                    setSelectedCategory(section.title);
                    setModalOpen(true);
                  }}
                  className="bg-orange-600 hover:bg-orange-500 text-white p-2 rounded-lg"
                >
                  <CopyPlus className="w-5 h-5" />
                </button>
              </div>

              <div className="max-h-[300px] overflow-y-auto">
                {section.banks.length === 0 ? (
                  <p className="text-center text-gray-400">No hay bancos.</p>
                ) : (
                  <>
                    <div className="flex justify-between px-2 mb-2 text-gray-400 text-sm font-semibold">
                      <span>Banco</span>
                      <span>Balance</span>
                    </div>
                    {section.banks.map((bank, index) => (
                      <div
                        key={index}
                        className="flex justify-between items-center py-2 border-b border-gray-700 cursor-pointer hover:bg-gray-800 px-2 rounded"
                        onClick={() => {
                          setSelectedBank(bank);
                          setDetailsModalOpen(true);
                        }}
                      >
                        <div className="flex items-center gap-3">
                          {bank.icon && (
                            <img
                              src={bank.icon}
                              alt={bank.name}
                              className="w-10 h-10 rounded-full object-cover"
                            />
                          )}
                          <div>
                            <p className="font-semibold text-white">{bank.name}</p>
                            <p className="text-sm text-gray-400">{bank.holder}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-orange-400">
                            {section.currency}
                            {formatBalance(calculateBankBalance(bank))}
                          </p>

                          {section.currency === "₲" && (
                            <div className="relative group inline-block ml-1">
                              <BadgeDollarSign className="w-4 h-4 text-white" />
                              <div className="absolute bottom-full mb-1 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                ${formatBalance(calculateBankBalance(bank) * pygToUsdRate)} USD
                              </div>
                            </div>
                          )}

                          {section.currency === "C$" && (
                            <div className="relative group inline-block ml-1">
                              <BadgeDollarSign className="w-4 h-4 text-white" />
                              <div className="absolute bottom-full mb-1 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                ${formatBalance(calculateBankBalance(bank) * cadToUsdRate)} USD
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </>
                )}
              </div>

              <div className="text-right text-orange-400 font-bold mt-4">
                Total: {section.currency}
                {formatBalance(
                  section.banks.reduce(
                    (acc, bank) => acc + calculateBankBalance(bank),
                    0
                  )
                )}
              </div>
            </div>
          ))}
        </div>

        {/* MODALES */}
        <BankModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          onSave={async () => {
            await mutate();
            setModalOpen(false);
          }}
          selectedCategory={selectedCategory}
        />

        {selectedBank && (
          <BankDetailsModal
            isOpen={detailsModalOpen}
            onClose={() => setDetailsModalOpen(false)}
            bank={selectedBank}
            onUpdate={() => mutate()}
          />
        )}

        {selectedBank && (
          <BankEditModal
            isOpen={editModalOpen}
            onClose={() => setEditModalOpen(false)}
            bank={selectedBank}
            onSave={() => mutate()}
          />
        )}
      </div>
    </div>
  );
}
