'use client';
import { Search, Bell } from "lucide-react";
import { NotificationDropdown } from "./NotificationDropdown";
import { useAuth } from "@/contexts/AuthContext";
import api from '@/api/axios';

export function Header({ title }: { title: string }) {
  const { user } = useAuth();
  const initials = user?.fullName ? user.fullName.substring(0, 2).toUpperCase() : 'AD';

  return (
    <header className="h-[72px] bg-white/90 backdrop-blur-md sticky top-0 z-10 flex items-center justify-between px-8 border-b border-neutral-100">
      <h2 className="font-semibold text-neutral-900 text-xl tracking-tight">
        {title}
      </h2>

      <div className="flex items-center gap-3">
        {/* Search bar */}
        <div className="hidden md:flex items-center bg-neutral-100/80 hover:bg-neutral-100 px-4 py-2.5 rounded-2xl focus-within:bg-white focus-within:ring-1 focus-within:ring-neutral-200 focus-within:shadow-[0_1px_2px_rgba(0,0,0,0.04),0_4px_12px_rgba(0,0,0,0.04)] transition-all duration-200 w-64">
          <Search className="w-4 h-4 text-neutral-400 mr-2.5 flex-shrink-0" aria-hidden="true" />
          <input
            type="text"
            placeholder="Rechercher..."
            aria-label="Rechercher"
            className="bg-transparent border-none outline-none text-sm w-full text-neutral-700 placeholder-neutral-400"
          />
        </div>

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