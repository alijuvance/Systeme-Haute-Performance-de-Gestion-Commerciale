'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Search, LayoutDashboard, ShoppingCart, Package, Users, 
  Truck, FileText, Warehouse, LineChart, Settings, Shield,
  Plus, ArrowRight, Command
} from 'lucide-react';

import { useAuth } from '@/contexts/AuthContext';

interface CommandItem {
  id: string;
  label: string;
  description?: string;
  icon: React.ReactNode;
  href?: string;
  action?: () => void;
  group: string;
  roles?: string[];
}

const defaultItems: CommandItem[] = [
  // Navigation
  { id: 'dashboard', label: 'Tableau de bord', icon: <LayoutDashboard className="w-4 h-4" />, href: '/dashboard', group: 'Navigation' },
  { id: 'sales', label: 'Ventes & Factures', icon: <ShoppingCart className="w-4 h-4" />, href: '/dashboard/sales', group: 'Navigation', roles: ['ADMIN', 'MANAGER', 'CASHIER', 'SALES'] },
  { id: 'products', label: 'Catalogue (Produits)', icon: <Package className="w-4 h-4" />, href: '/dashboard/products', group: 'Navigation', roles: ['ADMIN', 'MANAGER', 'CASHIER', 'SALES', 'INVENTORY'] },
  { id: 'stocks', label: 'Gestion des Stocks', icon: <Warehouse className="w-4 h-4" />, href: '/dashboard/stocks', group: 'Navigation', roles: ['ADMIN', 'MANAGER', 'INVENTORY'] },
  { id: 'customers', label: 'Clients', icon: <Users className="w-4 h-4" />, href: '/dashboard/customers', group: 'Navigation', roles: ['ADMIN', 'MANAGER', 'CASHIER', 'SALES'] },
  { id: 'suppliers', label: 'Fournisseurs', icon: <Truck className="w-4 h-4" />, href: '/dashboard/suppliers', group: 'Navigation', roles: ['ADMIN', 'MANAGER', 'INVENTORY'] },
  { id: 'purchases', label: 'Achats', icon: <FileText className="w-4 h-4" />, href: '/dashboard/purchases', group: 'Navigation', roles: ['ADMIN', 'MANAGER', 'INVENTORY'] },
  { id: 'finance', label: 'Finance', icon: <LineChart className="w-4 h-4" />, href: '/dashboard/finance', group: 'Navigation', roles: ['ADMIN'] },
  { id: 'users', label: 'Utilisateurs', icon: <Shield className="w-4 h-4" />, href: '/dashboard/users', group: 'Navigation', roles: ['ADMIN'] },
  { id: 'settings', label: 'Paramètres', icon: <Settings className="w-4 h-4" />, href: '/dashboard/settings', group: 'Navigation', roles: ['ADMIN'] },
  // Quick Actions
  { id: 'new-sale', label: 'Nouvelle Facture', description: 'Créer une facture B2B', icon: <Plus className="w-4 h-4" />, href: '/dashboard/sales/new', group: 'Actions rapides', roles: ['ADMIN', 'MANAGER', 'CASHIER', 'SALES'] },
  { id: 'pos', label: 'Ouvrir la Caisse POS', description: 'Interface de vente directe', icon: <ShoppingCart className="w-4 h-4" />, href: '/dashboard/pos', group: 'Actions rapides', roles: ['ADMIN', 'MANAGER', 'CASHIER', 'SALES'] },
];

export function CommandPalette() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const { user } = useAuth();
  const currentRole = user?.role?.name || user?.role || 'MANAGER';

  // Keyboard shortcut: Ctrl+K or Cmd+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen(prev => !prev);
      }
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Focus input when opened + lock body scroll
  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      document.body.style.overflow = 'hidden';
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  // Filter items by role
  const roleAllowedItems = defaultItems.filter(item => 
    !item.roles || item.roles.includes(currentRole as string)
  );

  // Filter items by search query
  const filteredItems = query
    ? roleAllowedItems.filter(item => 
        item.label.toLowerCase().includes(query.toLowerCase()) ||
        (item.description && item.description.toLowerCase().includes(query.toLowerCase()))
      )
    : roleAllowedItems;

  // Group items
  const groups = filteredItems.reduce<Record<string, CommandItem[]>>((acc, item) => {
    if (!acc[item.group]) acc[item.group] = [];
    acc[item.group].push(item);
    return acc;
  }, {});

  const flatItems = Object.values(groups).flat();

  // Scroll selected item into view
  useEffect(() => {
    if (!listRef.current) return;
    const selected = listRef.current.querySelector(`[data-index="${selectedIndex}"]`);
    if (selected) selected.scrollIntoView({ block: 'nearest' });
  }, [selectedIndex]);

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => Math.min(prev + 1, flatItems.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => Math.max(prev - 1, 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const item = flatItems[selectedIndex];
      if (item) executeItem(item);
    }
  };

  const executeItem = (item: CommandItem) => {
    setIsOpen(false);
    if (item.href) router.push(item.href);
    if (item.action) item.action();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh]">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-zinc-950/40 backdrop-blur-[2px] animate-fade-in" 
        onClick={() => setIsOpen(false)} 
      />
      
      {/* Panel */}
      <div className="relative w-full max-w-lg bg-white rounded-xl shadow-[var(--shadow-xl)] overflow-hidden animate-scale-in border border-zinc-200/60">
        {/* Search input */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-zinc-100">
          <Search className="w-4 h-4 text-zinc-400 flex-shrink-0" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Rechercher une page, une action..."
            value={query}
            onChange={(e) => { setQuery(e.target.value); setSelectedIndex(0); }}
            onKeyDown={handleKeyDown}
            className="flex-1 text-[13px] text-zinc-900 placeholder-zinc-400 bg-transparent outline-none"
          />
          <kbd className="hidden sm:inline-flex items-center gap-1 px-1.5 py-0.5 text-[10px] font-medium text-zinc-400 bg-zinc-50 border border-zinc-200 rounded-md">
            ESC
          </kbd>
        </div>

        {/* Results */}
        <div ref={listRef} className="max-h-[320px] overflow-y-auto py-1.5 scrollbar-hide">
          {flatItems.length === 0 && (
            <div className="px-4 py-8 text-center text-[13px] text-zinc-400">
              Aucun résultat pour &quot;{query}&quot;
            </div>
          )}

          {Object.entries(groups).map(([groupName, items]) => (
            <div key={groupName}>
              <div className="px-4 py-1.5 text-[10px] font-semibold text-zinc-400 uppercase tracking-[0.08em]">
                {groupName}
              </div>
              {items.map((item) => {
                const globalIdx = flatItems.indexOf(item);
                return (
                  <button
                    key={item.id}
                    data-index={globalIdx}
                    onClick={() => executeItem(item)}
                    onMouseEnter={() => setSelectedIndex(globalIdx)}
                    className={`
                      w-full flex items-center gap-3 px-4 py-2 text-left transition-colors duration-100
                      ${selectedIndex === globalIdx ? 'bg-zinc-50' : ''}
                    `}
                  >
                    <span className={`
                      flex items-center justify-center w-7 h-7 rounded-md flex-shrink-0
                      ${selectedIndex === globalIdx ? 'bg-zinc-900 text-white' : 'bg-zinc-100 text-zinc-500'}
                      transition-colors duration-100
                    `}>
                      {item.icon}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-[13px] font-medium text-zinc-900 truncate">{item.label}</p>
                      {item.description && (
                        <p className="text-[11px] text-zinc-400 truncate">{item.description}</p>
                      )}
                    </div>
                    {selectedIndex === globalIdx && (
                      <ArrowRight className="w-3.5 h-3.5 text-zinc-400 flex-shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-4 py-2 border-t border-zinc-100 bg-zinc-50/50">
          <div className="flex items-center gap-3 text-[10px] text-zinc-400">
            <span className="inline-flex items-center gap-1">
              <kbd className="px-1 py-0.5 bg-white border border-zinc-200 rounded text-[10px]">↑↓</kbd>
              naviguer
            </span>
            <span className="inline-flex items-center gap-1">
              <kbd className="px-1 py-0.5 bg-white border border-zinc-200 rounded text-[10px]">↵</kbd>
              ouvrir
            </span>
          </div>
          <div className="flex items-center gap-1 text-[10px] text-zinc-400">
            <Command className="w-3 h-3" /> K
          </div>
        </div>
      </div>
    </div>
  );
}
