'use client';
import { useState } from 'react';
import { LayoutDashboard, ShoppingCart, Loader2, Plus } from 'lucide-react';
import { PurchasesTable } from '@/features/purchases/components/PurchasesTable';
import { PurchasesOverview } from '@/features/purchases/components/PurchasesOverview';
import { NewPurchaseDrawer } from '@/features/purchases/components/NewPurchaseDrawer';
import { usePurchaseAnalytics } from '@/features/purchases/hooks/usePurchaseAnalytics';
import { Button } from '@/components/shared/Button';

export default function PurchasePage() {
  const [activeTab, setActiveTab] = useState<'overview' | 'orders'>('overview');
  const { kpis, isLoading, refreshKPIs } = usePurchaseAnalytics();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleOrderCreated = () => {
    refreshKPIs();
    // The PurchasesTable will also need a refresh — 
    // we switch to the orders tab so the user sees the new entry
    setActiveTab('orders');
  };

  return (
    <div className="flex flex-col h-full space-y-6">
      
      {/* Header & Tabs */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Achats & Logistique</h1>
          <p className="text-slate-500 text-sm mt-1">Gestion des commandes fournisseurs et approvisionnement.</p>
        </div>

        <div className="flex items-center gap-4 w-full md:w-auto">
          {/* Tabs */}
          <div className="flex bg-slate-100 p-1 rounded-xl flex-1 md:flex-none overflow-x-auto">
            <button
              onClick={() => setActiveTab('overview')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'overview' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span className="hidden sm:inline">Vue d&apos;ensemble</span>
            </button>
            <button
              onClick={() => setActiveTab('orders')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'orders' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              <ShoppingCart className="w-4 h-4" />
              <span className="hidden sm:inline">Commandes</span>
            </button>
          </div>

          <Button icon={<Plus className="w-4 h-4"/>} onClick={() => setDrawerOpen(true)}>
            Nouvelle Commande
          </Button>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1">
        {isLoading && activeTab === 'overview' ? (
          <div className="flex flex-col items-center justify-center h-64 text-slate-400">
            <Loader2 className="w-8 h-8 animate-spin mb-4" />
            <p>Chargement des statistiques d&apos;achats...</p>
          </div>
        ) : (
          <>
            {activeTab === 'overview' && (
              <PurchasesOverview kpis={kpis} />
            )}
            
            {activeTab === 'orders' && (
              <PurchasesTable />
            )}
          </>
        )}
      </div>

      {/* Drawer de création */}
      <NewPurchaseDrawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        onSuccess={handleOrderCreated}
      />

    </div>
  );
}
