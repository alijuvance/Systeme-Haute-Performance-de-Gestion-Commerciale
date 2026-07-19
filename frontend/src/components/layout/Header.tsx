'use client';
import { Search, Command } from "lucide-react";
import { NotificationDropdown } from "./NotificationDropdown";
import { useAuth } from "@/contexts/AuthContext";
import api from '@/api/axios';

export function Header({ title }: { title: string }) {
  const { user } = useAuth();
  const initials = user?.fullName ? user.fullName.substring(0, 2).toUpperCase() : 'AD';

  const openCommandPalette = () => {
    // Dispatch Ctrl+K event to trigger the CommandPalette
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', ctrlKey: true }));
  };

  return (
    <header className="h-[72px] bg-white/90 backdrop-blur-md sticky top-0 z-10 flex items-center justify-between px-8 border-b border-neutral-100">
      <h2 className="font-semibold text-neutral-900 text-xl tracking-tight">
        {title}
      </h2>

      <div className="flex items-center gap-3">
        {/* Command Palette trigger (search bar) */}
        <button
          onClick={openCommandPalette}
          className="hidden md:flex items-center bg-neutral-100/80 hover:bg-neutral-100 px-4 py-2.5 rounded-2xl transition-all duration-200 w-64 group"
          aria-label="Recherche rapide"
        >
          <Search className="w-4 h-4 text-neutral-400 mr-2.5 flex-shrink-0" aria-hidden="true" />
          <span className="text-sm text-neutral-400 flex-1 text-left">Rechercher...</span>
          <kbd className="hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-medium text-neutral-400 bg-white/80 border border-neutral-200 rounded-md ml-2">
            <Command className="w-2.5 h-2.5" />K
          </kbd>
        </button>

        {/* Notifications */}
        <NotificationDropdown />

        {/* Avatar */}
        <button
          type="button"
          aria-label={user?.fullName ? `Profil de ${user.fullName}` : 'Profil utilisateur'}
          className="w-9 h-9 rounded-2xl bg-neutral-900 text-white flex items-center justify-center font-medium text-xs cursor-pointer overflow-hidden ring-1 ring-neutral-200 shadow-sm hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2 transition-opacity"
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