"use client";
import { SWRConfig } from "swr";
import ClientsChart from "./ClientsChart";
import ClientsList from "./ClientsList";

export default function ClientsSectionWrapper({ fallback }) {
  return (
    <SWRConfig value={{ fallback }}>
      <div className="space-y-6">
        <ClientsChart />
        <ClientsList />
      </div>
    </SWRConfig>
  );
}
