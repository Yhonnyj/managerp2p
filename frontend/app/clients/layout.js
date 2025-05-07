import Sidebar from "../../components/Sidebar"; // ✅ Ruta correcta

export default function DashboardLayout({ children }) {
  return (
    <div className="flex min-h-screen bg-gray-900 text-white">
      <Sidebar /> {/* ✅ Sidebar fijo */}
      <div className="flex-1 flex flex-col ml-64">
        <main className="flex-1 p-6 bg-gray-900">{children}</main>
      </div>
    </div>
  );
}
