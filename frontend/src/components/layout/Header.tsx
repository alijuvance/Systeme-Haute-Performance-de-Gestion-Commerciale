'use client';
import { Search } from "lucide-react";
import { NotificationDropdown } from "./NotificationDropdown";

export function Header({ title }: { title: string }) {
  return (
    <header className="h-16 bg-white border-b border-slate-200 sticky top-0 z-10 flex items-center justify-between px-6">
      <h2 className="font-semibold text-slate-900 text-lg">
        {title}
      </h2>
      
      <div className="flex items-center gap-6">
        <div className="hidden md:flex items-center bg-slate-50 border border-slate-200 px-3 py-1.5 focus-within:border-slate-400 focus-within:bg-white transition-colors rounded-lg">
          <Search className="w-4 h-4 text-slate-400 mr-2" />
          <input type="text" placeholder="Rechercher..." className="bg-transparent border-none outline-none text-sm w-48 text-slate-700 placeholder-slate-400" />
        </div>

        <NotificationDropdown />
        
        <div className="w-8 h-8 bg-slate-900 text-white flex items-center justify-center font-medium text-xs cursor-pointer rounded-full">
          AD
        </div>
      </div>
    </header>
  );
}
