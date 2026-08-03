'use client';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Search, Command, ChevronRight } from "lucide-react";
import { NotificationDropdown } from "./NotificationDropdown";
import { useAuth } from "@/contexts/AuthContext";
import api from '@/api/axios';

const BREADCRUMB_LABELS: Record<string, string> = {
  dashboard: "Accueil",
  finance: "Finance",
  products: "Produits",
  purchases: "Achats",
  suppliers: "Fournisseurs",
  sales: "Ventes",
  customers: "Clients",
  stocks: "Stocks",
  users: "Utilisateurs",
  settings: "Paramètres",
  pos: "Point de Vente",
  new: "Nouveau",
};

export function Header({ title }: { title: string }) {
  const { user } = useAuth();
  const pathname = usePathname();
  const initials = user?.fullName ? user.fullName.substring(0, 2).toUpperCase() : 'AD';

  // Build breadcrumbs from pathname
  const segments = pathname.split('/').filter(Boolean);
  const breadcrumbs = segments.map((seg, i) => ({
    label: BREADCRUMB_LABELS[seg] || seg,
    href: '/' + segments.slice(0, i + 1).join('/'),
    isLast: i === segments.length - 1,
  }));

  const openCommandPalette = () => {
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', ctrlKey: true }));
  };

  return (
    <header className="h-14 bg-white/80 backdrop-blur-xl sticky top-0 z-10 flex items-center justify-between px-6 lg:px-8 border-b border-zinc-100/80">
      {/* Left: Breadcrumbs */}
      <nav className="flex items-center gap-1 text-[13px]" aria-label="Fil d'Ariane">
        {breadcrumbs.map((crumb, i) => (
          <span key={crumb.href} className="flex items-center gap-1">
            {i > 0 && <ChevronRight className="w-3 h-3 text-zinc-300" />}
            {crumb.isLast ? (
              <span className="font-medium text-zinc-900">{crumb.label}</span>
            ) : (
              <Link
                href={crumb.href}
                className="text-zinc-400 hover:text-zinc-600 transition-colors duration-150"
              >
                {crumb.label}
              </Link>
            )}
          </span>
        ))}
      </nav>

      {/* Right: Actions */}
      <div className="flex items-center gap-2">
        {/* Command Palette trigger */}
        <button
          onClick={openCommandPalette}
          className="hidden md:flex items-center bg-zinc-50 hover:bg-zinc-100 border border-zinc-200/60 px-3 py-1.5 rounded-lg transition-all duration-150 w-56 group"
          aria-label="Recherche rapide"
        >
          <Search className="w-3.5 h-3.5 text-zinc-400 mr-2 flex-shrink-0" aria-hidden="true" />
          <span className="text-[13px] text-zinc-400 flex-1 text-left">Rechercher...</span>
          <kbd className="hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-medium text-zinc-400 bg-white border border-zinc-200 rounded ml-2">
            <Command className="w-2.5 h-2.5" />K
          </kbd>
        </button>

        {/* Notifications */}
        <NotificationDropdown />

        {/* Avatar */}
        <button
          type="button"
          aria-label={user?.fullName ? `Profil de ${user.fullName}` : 'Profil utilisateur'}
          className="w-8 h-8 rounded-lg bg-zinc-900 text-white flex items-center justify-center font-medium text-[10px] cursor-pointer overflow-hidden ring-1 ring-zinc-200/50 hover:ring-zinc-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-zinc-900 transition-all duration-150"
        >
          {user?.avatar ? (
            <img
              src={`${api.defaults.baseURL}${user.avatar}`}
              alt={user.fullName}
              className="w-full h-full object-cover"
            />
          ) : (
            <span>{initials}</span>
          )}
        </button>
      </div>
    </header>
  );
}