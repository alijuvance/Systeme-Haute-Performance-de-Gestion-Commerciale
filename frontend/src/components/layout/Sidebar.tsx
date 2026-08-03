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
  Truck,
  FileText,
  LineChart,
  Warehouse,
  Shield,
  ChevronDown,
  PanelLeftClose,
  PanelLeft,
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
// Logo — Geometric modern icon
// ═══════════════════════════════════════════════════════

function AppLogo({ collapsed }: { collapsed: boolean }) {
  return (
    <div className="flex items-center gap-2.5 overflow-hidden">
      <div className="w-8 h-8 rounded-lg bg-zinc-900 flex items-center justify-center flex-shrink-0">
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <rect x="1" y="1" width="7" height="7" rx="1.5" fill="#ffffff" />
          <rect x="10" y="1" width="7" height="7" rx="1.5" fill="#a1a1aa" />
          <rect x="1" y="10" width="7" height="7" rx="1.5" fill="#a1a1aa" />
          <rect x="10" y="10" width="7" height="7" rx="1.5" fill="#ffffff" />
        </svg>
      </div>
      <span
        className={`
          font-semibold text-[15px] text-zinc-900 tracking-tight whitespace-nowrap
          transition-all duration-200
          ${collapsed ? "w-0 opacity-0" : "w-auto opacity-100"}
        `}
      >
        FANJAVA
      </span>
    </div>
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
  const collapsed = !sidebarOpen;

  const [openSections, setOpenSections] = useState<Record<string, boolean>>({});

  const toggleSection = (itemName: string) => {
    setOpenSections(prev => ({ ...prev, [itemName]: !prev[itemName] }));
  };

  // ─── Navigation structure ───
  const allSections: NavSection[] = [
    {
      label: 'Principal',
      items: [
        { name: "Tableau de bord", href: "/dashboard", icon: LayoutDashboard },
      ],
    },
    {
      label: 'Gestion',
      items: [
        {
          name: "Ventes", href: "/dashboard/sales", icon: ShoppingCart,
          roles: ['ADMIN', 'MANAGER', 'CASHIER', 'SALES'],
          children: [
            { name: "Toutes les ventes", href: "/dashboard/sales" },
            { name: "Nouvelle vente", href: "/dashboard/sales/new" },
          ],
        },
        { name: "Produits", href: "/dashboard/products", icon: Package, roles: ['ADMIN', 'MANAGER', 'CASHIER', 'SALES', 'INVENTORY'] },
        { name: "Stocks", href: "/dashboard/stocks", icon: Warehouse, roles: ['ADMIN', 'MANAGER', 'INVENTORY'] },
        { name: "Clients", href: "/dashboard/customers", icon: Users, roles: ['ADMIN', 'MANAGER', 'CASHIER', 'SALES'] },
        { name: "Fournisseurs", href: "/dashboard/suppliers", icon: Truck, roles: ['ADMIN', 'MANAGER', 'INVENTORY'] },
        { name: "Achats", href: "/dashboard/purchases", icon: FileText, roles: ['ADMIN', 'MANAGER', 'INVENTORY'] },
      ],
    },
    {
      label: 'Administration',
      items: [
        { name: "Finance", href: "/dashboard/finance", icon: LineChart, roles: ['ADMIN'] },
        { name: "Utilisateurs", href: "/dashboard/users", icon: Shield, roles: ['ADMIN'] },
        { name: "Paramètres", href: "/dashboard/settings", icon: Settings, roles: ['ADMIN'] },
      ],
    },
  ];

  const filteredSections = allSections
    .map(section => ({
      ...section,
      items: section.items.filter(item => !item.roles || item.roles.includes(role)),
    }))
    .filter(section => section.items.length > 0);

  const isActive = (href: string) => pathname === href;
  const isSectionActive = (item: NavItem) => {
    if (isActive(item.href)) return true;
    if (item.children) return item.children.some(child => isActive(child.href));
    return false;
  };

  const handleLogout = async () => {
    const ok = await toast.confirm({
      title: 'Déconnexion',
      message: 'Voulez-vous vraiment vous déconnecter ?',
      confirmText: 'Déconnecter',
      cancelText: 'Annuler',
      variant: 'warning',
    });
    if (ok) logout();
  };

  const displayName = user?.fullName || 'Utilisateur';
  const initials = displayName.substring(0, 2).toUpperCase();

  return (
    <aside
      className={`
        ${sidebarOpen ? "w-[260px]" : "w-16"}
        transition-all duration-300 ease-[cubic-bezier(0.25,0.1,0.25,1)]
        bg-white
        flex flex-col fixed h-full z-20
        border-r border-zinc-100
      `}
      aria-label="Sidebar de navigation"
    >
      {/* ═══════════ Logo + Toggle ═══════════ */}
      <div className="h-14 flex items-center justify-between px-4">
        <AppLogo collapsed={collapsed} />
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-1.5 text-zinc-400 hover:text-zinc-600 hover:bg-zinc-50 rounded-md transition-all duration-150"
          aria-label={sidebarOpen ? "Réduire la sidebar" : "Développer la sidebar"}
        >
          {sidebarOpen ? (
            <PanelLeftClose className="w-4 h-4" />
          ) : (
            <PanelLeft className="w-4 h-4" />
          )}
        </button>
      </div>

      {/* ═══════════ Navigation ═══════════ */}
      <nav className="flex-1 overflow-y-auto py-3 px-2.5 scrollbar-hide" aria-label="Navigation principale">
        {filteredSections.map((section) => (
          <div key={section.label} className="mb-4">
            {/* Section label */}
            <div
              className={`
                px-2.5 mb-1 text-[10px] font-semibold uppercase tracking-[0.08em] text-zinc-400
                transition-all duration-200
                ${sidebarOpen ? "opacity-100" : "opacity-0 h-0 mb-0 overflow-hidden"}
              `}
            >
              {section.label}
            </div>

            {/* Section items */}
            <div className="flex flex-col gap-px">
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
                          w-full flex items-center gap-2.5 px-2.5 py-[7px]
                          rounded-md transition-all duration-150 group cursor-pointer
                          ${active
                            ? "bg-zinc-100/80 text-zinc-900"
                            : "text-zinc-500 hover:text-zinc-700 hover:bg-zinc-50"
                          }
                        `}
                      >
                        <Icon className="w-4 h-4 flex-shrink-0" strokeWidth={1.75} />
                        <span className={`
                          text-[13px] whitespace-nowrap overflow-hidden transition-all duration-200
                          ${active ? "font-medium" : "font-normal"}
                          ${sidebarOpen ? "flex-1 opacity-100 text-left" : "w-0 opacity-0"}
                        `}>
                          {item.name}
                        </span>
                        {item.badge && sidebarOpen && (
                          <span className="px-1.5 py-0.5 text-[10px] font-medium text-zinc-500 bg-zinc-100 rounded-full tabular-nums">
                            {item.badge}
                          </span>
                        )}
                        {sidebarOpen && (
                          <ChevronDown
                            className={`w-3.5 h-3.5 text-zinc-400 transition-transform duration-200 ${isExpanded ? "rotate-0" : "-rotate-90"}`}
                          />
                        )}
                      </button>
                    ) : (
                      <Link
                        href={item.href}
                        className={`
                          flex items-center gap-2.5 px-2.5 py-[7px]
                          rounded-md transition-all duration-150 group
                          ${active
                            ? "bg-zinc-100/80 text-zinc-900"
                            : "text-zinc-500 hover:text-zinc-700 hover:bg-zinc-50"
                          }
                        `}
                      >
                        <Icon className="w-4 h-4 flex-shrink-0" strokeWidth={1.75} />
                        <span className={`
                          text-[13px] whitespace-nowrap overflow-hidden transition-all duration-200
                          ${active ? "font-medium" : "font-normal"}
                          ${sidebarOpen ? "flex-1 opacity-100" : "w-0 opacity-0"}
                        `}>
                          {item.name}
                        </span>
                        {item.badge && sidebarOpen && (
                          <span className="px-1.5 py-0.5 text-[10px] font-medium text-zinc-500 bg-zinc-100 rounded-full tabular-nums">
                            {item.badge}
                          </span>
                        )}
                      </Link>
                    )}

                    {/* ─── Submenu ─── */}
                    {hasChildren && isExpanded && sidebarOpen && (
                      <div className="ml-[22px] mt-0.5 mb-0.5 pl-3 border-l border-zinc-200 animate-submenu-open overflow-hidden">
                        {item.children!.map((child) => {
                          const childActive = isActive(child.href);
                          return (
                            <Link
                              key={child.href}
                              href={child.href}
                              className={`
                                block py-[5px] px-2.5 text-[13px] rounded-md transition-all duration-150
                                ${childActive
                                  ? "text-zinc-900 font-medium bg-zinc-50"
                                  : "text-zinc-400 hover:text-zinc-700 hover:bg-zinc-50"
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

      {/* ═══════════ Footer ═══════════ */}
      <div className="border-t border-zinc-100 p-2.5">
        {/* User info */}
        <div className={`flex items-center gap-2.5 px-2 py-2 rounded-md transition-all duration-150 ${sidebarOpen ? "" : "justify-center"}`}>
          <div className="w-7 h-7 rounded-md bg-zinc-900 text-white flex items-center justify-center text-[10px] font-semibold flex-shrink-0">
            {initials}
          </div>
          <div className={`overflow-hidden transition-all duration-200 ${sidebarOpen ? "w-auto opacity-100" : "w-0 opacity-0"}`}>
            <p className="text-[13px] font-medium text-zinc-900 whitespace-nowrap truncate max-w-[160px]">{displayName}</p>
            <p className="text-[11px] text-zinc-400 whitespace-nowrap">{typeof role === 'string' ? role : ''}</p>
          </div>
        </div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className={`
            w-full flex items-center gap-2.5 px-2 py-2
            rounded-md transition-all duration-150 group
            text-zinc-400 hover:text-red-600 hover:bg-red-50/50
            ${!sidebarOpen ? "justify-center" : ""}
          `}
          aria-label="Se déconnecter"
        >
          <LogOut className="w-4 h-4 flex-shrink-0 transition-colors duration-150" strokeWidth={1.75} />
          <span className={`text-[13px] font-normal whitespace-nowrap overflow-hidden transition-all duration-200 ${sidebarOpen ? "w-auto opacity-100" : "w-0 opacity-0"}`}>
            Déconnexion
          </span>
        </button>
      </div>
    </aside>
  );
}