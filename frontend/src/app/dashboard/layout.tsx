"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const pathname = usePathname();

  const getTitle = () => {
    switch (pathname) {
      case "/dashboard": return "Tableau de bord";
      case "/dashboard/finance": return "Finance & Trésorerie";
      case "/dashboard/products": return "Catalogue & Stocks";
      case "/dashboard/purchases": return "Achats (Commandes)";
      case "/dashboard/suppliers": return "Fournisseurs";
      case "/dashboard/sales": return "Ventes & Factures";
      case "/dashboard/users": return "Utilisateurs";
      case "/dashboard/settings": return "Paramètres";
      default: return "ERP System";
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex text-slate-900">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <div className={`flex-1 flex flex-col min-h-screen transition-all duration-300 ${sidebarOpen ? "ml-64" : "ml-16"}`}>
        <Header title={getTitle()} />

        <main className="p-6 flex-1">
          {children}
        </main>
      </div>
    </div>
  );
}
