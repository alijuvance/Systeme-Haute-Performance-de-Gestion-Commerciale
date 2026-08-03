"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { CommandPalette } from "@/components/shared/CommandPalette";

const PAGE_TITLES: Record<string, string> = {
  "/dashboard": "Tableau de bord",
  "/dashboard/finance": "Finance & Trésorerie",
  "/dashboard/products": "Catalogue & Stocks",
  "/dashboard/purchases": "Achats",
  "/dashboard/suppliers": "Fournisseurs",
  "/dashboard/sales": "Ventes & Factures",
  "/dashboard/customers": "Clients",
  "/dashboard/stocks": "Gestion des Stocks",
  "/dashboard/users": "Utilisateurs",
  "/dashboard/settings": "Paramètres",
  "/dashboard/pos": "Point de Vente",
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const pathname = usePathname();

  const title = PAGE_TITLES[pathname] || "ERP System";

  return (
    <div className="min-h-screen bg-[var(--background)] flex">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <div
        className={`flex-1 flex flex-col min-h-screen transition-[margin] duration-300 ease-[cubic-bezier(0.25,0.1,0.25,1)] ${
          sidebarOpen ? "ml-[260px]" : "ml-16"
        }`}
      >
        <Header title={title} />

        <main className="flex-1 px-6 py-6 lg:px-8">
          {children}
        </main>
      </div>

      {/* Global Command Palette */}
      <CommandPalette />
    </div>
  );
}
