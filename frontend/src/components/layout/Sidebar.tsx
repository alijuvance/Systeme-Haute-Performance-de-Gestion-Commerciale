'use client';

import { useState } from 'react';
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/providers/ToastProvider";
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
  Shield,
  ChevronDown,
  ChevronRight,
  User,
} from "lucide-react";

// ═══════════════════════════════════════════════════════
// Types
// ═══════════════════════════════════════════════════════

interface NavChild {
  name: string;
  href: string;
}

interface NavItem {
  name: string;
  href: string;
  icon: React.ElementType;
  roles?: string[];
  badge?: number;
  children?: NavChild[];
}

interface NavSection {
  label: string;
  items: NavItem[];
}

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

// ═══════════════════════════════════════════════════════
// Logo Component (Geometric icon inspired by Brainwave)
// ═══════════════════════════════════════════════════════

function AppLogo() {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <rect x="2" y="2" width="12" height="12" rx="3" fill="#171717" />
      <rect x="18" y="2" width="12" height="12" rx="3" fill="#a3a3a3" />
      <rect x="2" y="18" width="12" height="12" rx="3" fill="#a3a3a3" />
      <rect x="18" y="18" width="12" height="12" rx="3" fill="#171717" />
    </svg>
  );
}

// ═══════════════════════════════════════════════════════
// Main Sidebar Component
// ═══════════════════════════════════════════════════════

export function Sidebar({ sidebarOpen, setSidebarOpen }: SidebarProps) {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const toast = useToast();
  const role = user?.role?.name || user?.role || 'MANAGER';

  // --- Sous-menus ouverts (tracked by section label) ---
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({});

  const toggleSection = (itemName: string) => {
    setOpenSections(prev => ({ ...prev, [itemName]: !prev[itemName] }));
  };

  // ─── Navigation structure groupée par sections ───
  const allSections: NavSection[] = [
    {
      label: 'NAVIGATION',
      items: [
        { name: "Tableau de bord", href: "/dashboard", icon: LayoutDashboard },
      ],
    },
    {
      label: 'GESTION',
      items: [
        { 
          name: "Ventes & Factures", href: "/dashboard/sales", icon: ShoppingCart, 
          roles: ['ADMIN', 'MANAGER', 'CASHIER', 'SALES'],
          children: [
            { name: "Liste des factures", href: "/dashboard/sales" },
            { name: "Nouvelle facture", href: "/dashboard/sales/new" },
          ],
        },
        { name: "Catalogue (Produits)", href: "/dashboard/products", icon: Package, roles: ['ADMIN', 'MANAGER', 'CASHIER', 'SALES', 'INVENTORY'] },
        { name: "Gestion des Stocks", href: "/dashboard/stocks", icon: Warehouse, roles: ['ADMIN', 'MANAGER', 'INVENTORY'] },
        { name: "Clients", href: "/dashboard/customers", icon: Users, roles: ['ADMIN', 'MANAGER', 'CASHIER', 'SALES'] },
        { name: "Fournisseurs", href: "/dashboard/suppliers", icon: Truck, roles: ['ADMIN', 'MANAGER', 'INVENTORY'] },
        { name: "Achats", href: "/dashboard/purchases", icon: FileText, roles: ['ADMIN', 'MANAGER', 'INVENTORY'] },
      ],
    },
    {
      label: 'ADMINISTRATION',
      items: [
        { name: "Finance", href: "/dashboard/finance", icon: LineChart, roles: ['ADMIN'] },
        { name: "Utilisateurs", href: "/dashboard/users", icon: Shield, roles: ['ADMIN'] },
        { name: "Paramètres", href: "/dashboard/settings", icon: Settings, roles: ['ADMIN'] },
      ],
    },
  ];

  // --- Filtre par rôle ---
  const filteredSections = allSections
    .map(section => ({
      ...section,
      items: section.items.filter(item => !item.roles || item.roles.includes(role)),
    }))
    .filter(section => section.items.length > 0);

  // --- Check active state ---
  const isActive = (href: string) => pathname === href;
  const isSectionActive = (item: NavItem) => {
    if (isActive(item.href)) return true;
    if (item.children) return item.children.some(child => isActive(child.href));
    return false;
  };

  // --- Logout handler (with confirmation toast) ---
  const handleLogout = async () => {
    const ok = await toast.confirm({
      title: 'Déconnexion',
      message: 'Voulez-vous vraiment vous déconnecter ?',
      confirmText: 'Déconnecter',
      cancelText: 'Annuler',
      variant: 'warning',
    });
    if (ok) {
      logout();
    }
  };

  // --- Username display ---
  const displayName = user?.fullName || 'Utilisateur';
  const initials = displayName.substring(0, 2).toUpperCase();

  return (
    <aside
      className={`
        ${sidebarOpen ? "w-[272px]" : "w-16"} 
        transition-all duration-300 ease-in-out
        bg-white 
        flex flex-col fixed h-full z-20
        shadow-[1px_0_12px_rgba(0,0,0,0.03)]
      `}
      aria-label="Sidebar de navigation"
    >
      {/* ═══════════ Logo + App name ═══════════ */}
      <div className="h-[72px] flex items-center justify-between px-5 border-b border-neutral-100">
        <div className="flex items-center gap-3 overflow-hidden">
          <AppLogo />
          <span 
            className={`
              font-bold text-xl text-neutral-900 tracking-tight whitespace-nowrap
              transition-all duration-300
              ${sidebarOpen ? "w-auto opacity-100" : "w-0 opacity-0"}
            `}
          >
            FANJAVA
          </span>
        </div>
        <button 
          onClick={() => setSidebarOpen(!sidebarOpen)} 
          className="p-2 text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 rounded-xl transition-all duration-200"
          aria-label={sidebarOpen ? "Réduire la sidebar" : "Développer la sidebar"}
        >
          <Menu className="w-5 h-5" />
        </button>
      </div>

      {/* ═══════════ Navigation ═══════════ */}
      <nav className="flex-1 overflow-y-auto py-5 px-3 scrollbar-hide" aria-label="Navigation principale">
        {filteredSections.map((section) => (
          <div key={section.label} className="mb-6">
            {/* Section label */}
            <div
              className={`
                px-3 mb-2.5 text-[11px] font-semibold uppercase tracking-widest text-neutral-400
                transition-all duration-300
                ${sidebarOpen ? "opacity-100" : "opacity-0 h-0 mb-0 overflow-hidden"}
              `}
            >
              {section.label}
            </div>

            {/* Section items */}
            <div className="flex flex-col gap-1">
              {section.items.map((item) => {
                const Icon = item.icon;
                const active = isSectionActive(item);
                const hasChildren = item.children && item.children.length > 0;
                const isExpanded = openSections[item.name] ?? active;

                return (
                  <div key={item.href}>
                    {/* ─── Main item ─── */}
                    {hasChildren ? (
                      <button
                        onClick={() => toggleSection(item.name)}
                        aria-expanded={isExpanded}
                        className={`
                          w-full flex items-center gap-3 px-2.5 py-2.5 
                          rounded-2xl transition-all duration-200 group cursor-pointer
                          ${active
                            ? "bg-neutral-100" 
                            : "hover:bg-neutral-50"
                          }
                        `}
                      >
                        <span className={`
                          flex items-center justify-center w-8 h-8 rounded-xl flex-shrink-0 transition-all duration-200
                          ${active
                            ? "bg-white shadow-[0_1px_2px_rgba(0,0,0,0.06),0_1px_6px_rgba(0,0,0,0.06)] text-neutral-900"
                            : "text-neutral-400 group-hover:text-neutral-600"
                          }
                        `}>
                          <Icon className="w-[18px] h-[18px]" strokeWidth={2} />
                        </span>
                        <span className={`
                          text-sm whitespace-nowrap overflow-hidden transition-all duration-300
                          ${active ? "text-neutral-900 font-semibold" : "text-neutral-600 group-hover:text-neutral-900"}
                          ${sidebarOpen ? "flex-1 opacity-100 text-left" : "w-0 opacity-0"}
                        `}>
                          {item.name}
                        </span>
                        {/* Badge */}
                        {item.badge && sidebarOpen && (
                          <span className="px-2.5 py-1 text-xs font-medium text-neutral-500 bg-white rounded-xl border border-neutral-200">
                            {item.badge}
                          </span>
                        )}
                        {/* Chevron */}
                        {sidebarOpen && (
                          <ChevronDown 
                            className={`w-4 h-4 text-neutral-400 transition-transform duration-200 ${isExpanded ? "rotate-0" : "-rotate-90"}`} 
                          />
                        )}
                      </button>
                    ) : (
                      <Link
                        href={item.href}
                        className={`
                          flex items-center gap-3 px-2.5 py-2.5 
                          rounded-2xl transition-all duration-200 group
                          ${active
                            ? "bg-neutral-100" 
                            : "hover:bg-neutral-50"
                          }
                        `}
                      >
                        <span className={`
                          flex items-center justify-center w-8 h-8 rounded-xl flex-shrink-0 transition-all duration-200
                          ${active
                            ? "bg-white shadow-[0_1px_2px_rgba(0,0,0,0.06),0_1px_6px_rgba(0,0,0,0.06)] text-neutral-900"
                            : "text-neutral-400 group-hover:text-neutral-600"
                          }
                        `}>
                          <Icon className="w-[18px] h-[18px]" strokeWidth={2} />
                        </span>
                        <span className={`
                          text-sm whitespace-nowrap overflow-hidden transition-all duration-300
                          ${active ? "text-neutral-900 font-semibold" : "text-neutral-600 group-hover:text-neutral-900"}
                          ${sidebarOpen ? "flex-1 opacity-100" : "w-0 opacity-0"}
                        `}>
                          {item.name}
                        </span>
                        {/* Badge */}
                        {item.badge && sidebarOpen && (
                          <span className="px-2.5 py-1 text-xs font-medium text-neutral-500 bg-white rounded-xl border border-neutral-200">
                            {item.badge}
                          </span>
                        )}
                      </Link>
                    )}

                    {/* ─── Children (submenu) with vertical line indicator ─── */}
                    {hasChildren && isExpanded && sidebarOpen && (
                      <div className="ml-[30px] mt-1 mb-1 pl-4 border-l-2 border-neutral-200 animate-submenu-open overflow-hidden">
                        {item.children!.map((child) => {
                          const childActive = isActive(child.href);
                          return (
                            <Link
                              key={child.href}
                              href={child.href}
                              className={`
                                block py-2 px-3 text-sm rounded-xl transition-all duration-200
                                ${childActive
                                  ? "text-neutral-900 font-semibold bg-neutral-50" 
                                  : "text-neutral-500 hover:text-neutral-900 hover:bg-neutral-50"
                                }
                              `}
                            >
                              {child.name}
                            </Link>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* ═══════════ Footer: User + Logout ═══════════ */}
      <div className="border-t border-neutral-100 p-3">
        {/* User info */}
        <div className={`flex items-center gap-3 px-2.5 py-2.5 mb-1 rounded-2xl transition-all duration-200 ${sidebarOpen ? "" : "justify-center"}`}>
          <div className="w-8 h-8 rounded-xl bg-neutral-900 text-white flex items-center justify-center text-xs font-semibold flex-shrink-0">
            {initials}
          </div>
          <div className={`overflow-hidden transition-all duration-300 ${sidebarOpen ? "w-auto opacity-100" : "w-0 opacity-0"}`}>
            <p className="text-sm font-medium text-neutral-900 whitespace-nowrap truncate max-w-[160px]">{displayName}</p>
            <p className="text-xs text-neutral-400 whitespace-nowrap">{typeof role === 'string' ? role : ''}</p>
          </div>
        </div>

        {/* Logout button */}
        <button 
          onClick={handleLogout} 
          className={`
            w-full flex items-center gap-3 px-2.5 py-2.5 
            rounded-2xl transition-all duration-200 group
            text-neutral-500 hover:text-red-600 hover:bg-red-50
            ${!sidebarOpen ? "justify-center" : ""}
          `}
          aria-label="Se déconnecter"
        >
          <span className="flex items-center justify-center w-8 h-8 rounded-xl flex-shrink-0">
            <LogOut className="w-[18px] h-[18px] transition-colors duration-200 group-hover:text-red-500" strokeWidth={2} />
          </span>
          <span className={`text-sm font-medium whitespace-nowrap overflow-hidden transition-all duration-300 ${sidebarOpen ? "w-auto opacity-100" : "w-0 opacity-0"}`}>
            Déconnexion
          </span>
        </button>
      </div>
    </aside>
  );
}