import { useEffect, useState } from "react";

export default function FilterModal({ onClose, onApply, initialFilters = {} }) {
  const [bancos, setBancos] = useState([]);
  const [filtros, setFiltros] = useState({
    desde: initialFilters.desde || "",
    hasta: initialFilters.hasta || "",
    tipo: initialFilters.tipo || "",
    banco: initialFilters.banco || "",
    monto: initialFilters.monto || "",
  });

  useEffect(() => {
    const fetchBancos = async () => {
      const token = localStorage.getItem("accessToken");
      const res = await fetch("http://127.0.0.1:8000/api/banks/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      setBancos(data.results || []);
    };

    fetchBancos();
  }, []);

  const handleChange = (e) => {
    setFiltros({ ...filtros, [e.target.name]: e.target.value });
  };

  const aplicar = () => {
    onApply(filtros);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-[rgba(0,0,0,0.6)] flex items-center justify-center z-50">
      <div className="bg-gray-900 rounded-2xl shadow-lg w-full max-w-xl p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-white">Buscador Avanzado</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-red-400 text-xl font-bold">×</button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input label="Desde" name="desde" type="date" value={filtros.desde} onChange={handleChange} />
          <Input label="Hasta" name="hasta" type="date" value={filtros.hasta} onChange={handleChange} />
          <Input label="Monto mínimo" name="monto" type="number" value={filtros.monto} onChange={handleChange} />
          <Select label="Tipo" name="tipo" value={filtros.tipo} options={["Ingreso", "Egreso"]} onChange={handleChange} />
          <Select
            label="Banco"
            name="banco"
            value={filtros.banco}
            options={bancos.map(b => b.name)}
            onChange={handleChange}
            span={2}
          />
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 text-white">
            Cancelar
          </button>
          <button onClick={aplicar} className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold">
            Aplicar filtros
          </button>
        </div>
      </div>
    </div>
  );
}

function Input({ label, ...props }) {
  return (
    <div>
      <label className="block text-sm text-gray-300 mb-1">{label}</label>
      <input {...props} className="w-full bg-gray-800 text-white border rounded-lg px-3 py-2" />
    </div>
  );
}

function Select({ label, name, value, options, onChange, span = 1 }) {
  return (
    <div className={`sm:col-span-${span}`}>
      <label className="block text-sm text-gray-300 mb-1">{label}</label>
      <select
        name={name}
        value={value}
        onChange={onChange}
        className="w-full bg-gray-800 text-white border rounded-lg px-3 py-2"
      >
        <option value="">Todos</option>
        {options.map((opt, i) => (
          <option key={i} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    </div>
  );
}
