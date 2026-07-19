'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Search, LayoutDashboard, ShoppingCart, Package, Users, 
  Truck, FileText, Warehouse, LineChart, Settings, Shield,
  Plus, ArrowRight, Command
} from 'lucide-react';

interface CommandItem {
  id: string;
  label: string;
  description?: string;
  icon: React.ReactNode;
  href?: string;
  action?: () => void;
  group: string;
}

const defaultItems: CommandItem[] = [
  // Navigation
  { id: 'dashboard', label: 'Tableau de bord', icon: <LayoutDashboard className="w-4 h-4" />, href: '/dashboard', group: 'Navigation' },
  { id: 'sales', label: 'Ventes & Factures', icon: <ShoppingCart className="w-4 h-4" />, href: '/dashboard/sales', group: 'Navigation' },
  { id: 'products', label: 'Catalogue (Produits)', icon: <Package className="w-4 h-4" />, href: '/dashboard/products', group: 'Navigation' },
  { id: 'stocks', label: 'Gestion des Stocks', icon: <Warehouse className="w-4 h-4" />, href: '/dashboard/stocks', group: 'Navigation' },
  { id: 'customers', label: 'Clients', icon: <Users className="w-4 h-4" />, href: '/dashboard/customers', group: 'Navigation' },
  { id: 'suppliers', label: 'Fournisseurs', icon: <Truck className="w-4 h-4" />, href: '/dashboard/suppliers', group: 'Navigation' },
  { id: 'purchases', label: 'Achats', icon: <FileText className="w-4 h-4" />, href: '/dashboard/purchases', group: 'Navigation' },
  { id: 'finance', label: 'Finance', icon: <LineChart className="w-4 h-4" />, href: '/dashboard/finance', group: 'Navigation' },
  { id: 'users', label: 'Utilisateurs', icon: <Shield className="w-4 h-4" />, href: '/dashboard/users', group: 'Navigation' },
  { id: 'settings', label: 'Paramètres', icon: <Settings className="w-4 h-4" />, href: '/dashboard/settings', group: 'Navigation' },
  // Quick Actions
  { id: 'new-sale', label: 'Nouvelle Facture', description: 'Créer une facture B2B', icon: <Plus className="w-4 h-4" />, href: '/dashboard/sales/new', group: 'Actions rapides' },
  { id: 'pos', label: 'Ouvrir la Caisse POS', description: 'Interface de vente directe', icon: <ShoppingCart className="w-4 h-4" />, href: '/dashboard/pos', group: 'Actions rapides' },
];

export function CommandPalette() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

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

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  // Filter items
  const filteredItems = query
    ? defaultItems.filter(item => 
        item.label.toLowerCase().includes(query.toLowerCase()) ||
        (item.description && item.description.toLowerCase().includes(query.toLowerCase()))
      )
    : defaultItems;

  // Group items
  const groups = filteredItems.reduce<Record<string, CommandItem[]>>((acc, item) => {
    if (!acc[item.group]) acc[item.group] = [];
    acc[item.group].push(item);
    return acc;
  }, {});

  const flatItems = Object.values(groups).flat();

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
        className="fixed inset-0 bg-black/50 backdrop-blur-sm animate-fade-in" 
        onClick={() => setIsOpen(false)} 
      />
      
      {/* Panel */}
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden animate-scale-in border border-gray-200">
        {/* Search input */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-100">
          <Search className="w-5 h-5 text-gray-400 flex-shrink-0" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Rechercher une page, une action..."
            value={query}
            onChange={(e) => { setQuery(e.target.value); setSelectedIndex(0); }}
            onKeyDown={handleKeyDown}
            className="flex-1 text-sm text-gray-900 placeholder-gray-400 bg-transparent outline-none"
          />
          <kbd className="hidden sm:inline-flex items-center gap-1 px-1.5 py-0.5 text-[10px] font-medium text-gray-400 bg-gray-50 border border-gray-200 rounded">
            ESC
          </kbd>
        </div>

        {/* Results */}
        <div className="max-h-[320px] overflow-y-auto py-2">
          {flatItems.length === 0 && (
            <div className="px-4 py-8 text-center text-sm text-gray-400">
              Aucun résultat pour "{query}"
            </div>
          )}

          {Object.entries(groups).map(([groupName, items]) => (
            <div key={groupName}>
              <div className="px-4 py-1.5 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
                {groupName}
              </div>
              {items.map((item) => {
                const globalIdx = flatItems.indexOf(item);
                return (
                  <button
                    key={item.id}
                    onClick={() => executeItem(item)}
                    onMouseEnter={() => setSelectedIndex(globalIdx)}
                    className={`
                      w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors duration-100
                      ${selectedIndex === globalIdx ? 'bg-gray-50' : ''}
                    `}
                  >
                    <span className={`
                      flex items-center justify-center w-8 h-8 rounded-lg flex-shrink-0
                      ${selectedIndex === globalIdx ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-500'}
                      transition-colors duration-100
                    `}>
                      {item.icon}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{item.label}</p>
                      {item.description && (
                        <p className="text-xs text-gray-400 truncate">{item.description}</p>
                      )}
                    </div>
                    {selectedIndex === globalIdx && (
                      <ArrowRight className="w-4 h-4 text-gray-400 flex-shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-4 py-2.5 border-t border-gray-100 bg-gray-50/50">
          <div className="flex items-center gap-3 text-[11px] text-gray-400">
            <span className="inline-flex items-center gap-1">
              <kbd className="px-1 py-0.5 bg-white border border-gray-200 rounded text-[10px]">↑↓</kbd>
              naviguer
            </span>
            <span className="inline-flex items-center gap-1">
              <kbd className="px-1 py-0.5 bg-white border border-gray-200 rounded text-[10px]">↵</kbd>
              ouvrir
            </span>
          </div>
          <div className="flex items-center gap-1 text-[11px] text-gray-400">
            <Command className="w-3 h-3" /> K
          </div>
        </div>
      </div>
    </div>
  );
}
