'use client';
import Link from 'next/link';
import { useSales } from '@/features/sales/hooks/useSales';
import { SalesTable } from '@/features/sales/components/SalesTable';
import { PageHeader } from '@/components/shared/PageHeader';
import { Button } from '@/components/shared/Button';
import { Plus, ShoppingCart, Search, Filter } from 'lucide-react';

export default function SalesPage() {
  const { 
    sales, isLoading, error,
    searchTerm, setSearchTerm,
    dateFilter, setDateFilter,
    typeFilter, setTypeFilter,
    statusFilter, setStatusFilter
  } = useSales();

  return (
    <>
      <PageHeader
        title="Ventes & Factures"
        description="Historique des ventes B2B et POS."
        actions={
          <div className="flex items-center gap-3">
            <Link href="/dashboard/pos">
              <Button variant="outline" icon={<ShoppingCart className="w-4 h-4" />}>Caisse POS</Button>
            </Link>
            <Link href="/dashboard/sales/new">
              <Button icon={<Plus className="w-4 h-4" />}>Nouvelle Facture B2B</Button>
            </Link>
          </div>
        }
      />

      {/* Filter bar */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 mb-6 flex flex-col md:flex-row gap-4 items-end">
        <div className="flex-1 min-w-[200px]">
          <label className="block text-sm font-semibold text-slate-700 mb-1">Rechercher</label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="N° de facture, client..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white transition-all"
            />
          </div>
        </div>

        <div className="flex-1 min-w-[150px]">
          <label className="block text-sm font-semibold text-slate-700 mb-1">Date</label>
          <input
            type="date"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white transition-all"
          />
        </div>

        <div className="flex-1 min-w-[150px]">
          <label className="block text-sm font-semibold text-slate-700 mb-1">Type</label>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white transition-all"
          >
            <option value="">Tous les types</option>
            <option value="B2B">Facture B2B</option>
            <option value="POS">Ticket POS</option>
          </select>
        </div>

        <div className="flex-1 min-w-[150px]">
          <label className="block text-sm font-semibold text-slate-700 mb-1">Statut</label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white transition-all"
          >
            <option value="">Tous les statuts</option>
            <option value="PAID">Payé</option>
            <option value="PARTIAL">Partiel</option>
            <option value="PENDING">Impayé</option>
          </select>
        </div>
        
        {/* Reset filters button */}
        {(searchTerm || dateFilter || typeFilter || statusFilter) && (
          <Button 
            variant="outline" 
            onClick={() => {
              setSearchTerm('');
              setDateFilter('');
              setTypeFilter('');
              setStatusFilter('');
            }}
          >
            Réinitialiser
          </Button>
        )}
      </div>

      {error && <div className="p-4 bg-red-50 text-red-600 border border-red-200 mb-4 rounded-xl">{error}</div>}
      <SalesTable sales={sales} isLoading={isLoading} error={null} />
    </>
  );
}
