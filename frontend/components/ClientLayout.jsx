"use client";

import { usePathname } from "next/navigation";
import Sidebar from "./Sidebar";
import { Toaster } from "react-hot-toast";

export default function ClientLayout({ children }) {
  const pathname = usePathname();

  const hideSidebarRoutes = ["/login", "/register", "/forgot-password"];
  const shouldHideSidebar = hideSidebarRoutes.some(route =>
    pathname?.startsWith(route)
  );

  return (
    <>
      {shouldHideSidebar ? (
        <main className="flex min-h-screen w-full items-center justify-center bg-gray-900">
          {children}
        </main>
      ) : (
        <div className="flex">
          <Sidebar />
          <main className="flex-1 min-h-screen bg-gray-900">{children}</main>
        </div>
      )}

      <Toaster
        position="top-right"
        reverseOrder={false}
        toastOptions={{
          duration: 3000,
          style: {
            background: "#1f2937",
            color: "#fff",
            border: "1px solid #fb923c",
            padding: "12px 16px",
            fontSize: "14px",
          },
          success: {
            style: {
              background: "#15803d",
              color: "#fff",
              border: "1px solid #22c55e",
            },
            iconTheme: {
              primary: "#22c55e",
              secondary: "#1f2937",
            },
          },
          error: {
            style: {
              background: "#b91c1c",
              color: "#fff",
              border: "1px solid #ef4444",
            },
            iconTheme: {
              primary: "#ef4444",
              secondary: "#1f2937",
            },
          },
        }}
      />
    </>
  );
}
