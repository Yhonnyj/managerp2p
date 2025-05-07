import DashboardStats from "./DashboardStats";
import ClientsSection from "./ClientsSection";
import OperationsSection from "./OperationsSection";

export default async function DashboardPage() {
  let data = null;

  try {
    const res = await fetch("http://127.0.0.1:8000/api/transaction/dashboard/summary/", {
      cache: "no-store",
    });

    // Manejo de errores: si no es 200 OK
    if (!res.ok) {
      const text = await res.text();
      console.error("❌ Error en el API del dashboard:", res.status, text);
      throw new Error("No se pudo cargar el resumen del dashboard.");
    }

    // Si todo va bien, parseamos el JSON
    data = await res.json();
  } catch (error) {
    console.error("❌ Error inesperado al obtener el dashboard:", error.message);
    // Aquí puedes decidir si lanzas el error o muestras un fallback en pantalla
    return (
      <div className="ml-64 min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-500 mb-4">Error al cargar el dashboard</h1>
          <p className="text-gray-400">Revisa la consola o verifica que el backend esté corriendo.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="ml-64 min-h-screen bg-gray-900 text-white overflow-y-auto">
      <div className="max-w-7xl mx-auto px-6 py-6">
        <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

        {/* 📊 Tarjetas resumen */}
        <DashboardStats data={data} />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          <ClientsSection />
          <OperationsSection />
        </div>
      </div>
    </div>
  );
}
