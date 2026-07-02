'use client';
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Users, 
  Settings, 
  LogOut, 
  Menu,
  Truck,
  FileText,
  LineChart,
  Warehouse,
  Shield
} from "lucide-react";

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

export function Sidebar({ sidebarOpen, setSidebarOpen }: SidebarProps) {
  const pathname = usePathname();

  const { user } = useAuth();
  const role = user?.role?.name || user?.role || 'MANAGER'; // Par défaut, sécurité

  const allNavItems = [
    { name: "Tableau de bord", href: "/dashboard", icon: LayoutDashboard },
    { name: "Ventes & Factures", href: "/dashboard/sales", icon: ShoppingCart, roles: ['ADMIN', 'MANAGER'] },
    { name: "Catalogue (Produits)", href: "/dashboard/products", icon: Package, roles: ['ADMIN', 'MANAGER'] },
    { name: "Gestion des Stocks", href: "/dashboard/stocks", icon: Warehouse, roles: ['ADMIN'] },
    { name: "Clients B2B", href: "/dashboard/customers", icon: Users, roles: ['ADMIN', 'MANAGER'] },
    { name: "Fournisseurs", href: "/dashboard/suppliers", icon: Truck, roles: ['ADMIN'] },
    { name: "Achats", href: "/dashboard/purchases", icon: FileText, roles: ['ADMIN'] },
    { name: "Finance", href: "/dashboard/finance", icon: LineChart, roles: ['ADMIN'] },
    { name: "Utilisateurs", href: "/dashboard/users", icon: Shield, roles: ['ADMIN'] },
    { name: "Paramètres", href: "/dashboard/settings", icon: Settings, roles: ['ADMIN'] },
  ];

  const navItems = allNavItems.filter(item => !item.roles || item.roles.includes(role));

  return (
    <aside className={`${sidebarOpen ? "w-64" : "w-16"} transition-all duration-300 bg-white border-r border-slate-200 flex flex-col fixed h-full z-20`}>
      <div className="h-16 flex items-center justify-between px-4 border-b border-slate-200 bg-slate-50">
        <div className={`font-bold text-lg text-slate-900 overflow-hidden transition-all whitespace-nowrap ${sidebarOpen ? "w-auto opacity-100" : "w-0 opacity-0"}`}>
          FANJAVA
        </div>
        <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-1.5 text-slate-500 hover:text-slate-900 transition-colors">
          <Menu className="w-5 h-5" />
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto py-4 flex flex-col gap-1 px-2 scrollbar-hide">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          
          return (
            <Link 
              key={item.href} 
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 transition-colors group ${
                isActive 
                  ? "bg-slate-100 text-slate-900 font-semibold" 
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              }`}
            >
              <Icon className={`w-4 h-4 flex-shrink-0 ${isActive ? "text-slate-900" : "text-slate-400 group-hover:text-slate-600"}`} />
              <span className={`text-sm whitespace-nowrap overflow-hidden transition-all ${sidebarOpen ? "w-auto opacity-100" : "w-0 opacity-0"}`}>
                {item.name}
              </span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-200">
        <Link href="/login" className="flex items-center gap-3 px-2 py-2.5 text-slate-600 hover:text-red-600 hover:bg-red-50 transition-colors">
          <LogOut className="w-4 h-4" />
          <span className={`text-sm font-medium whitespace-nowrap overflow-hidden transition-all ${sidebarOpen ? "w-auto opacity-100" : "w-0 opacity-0"}`}>
            Déconnexion
          </span>
        </Link>
      </div>
    </aside>
  );
}
