'use client';
import Link from 'next/link';
import { useSales } from '@/features/sales/hooks/useSales';
import { SalesTable } from '@/features/sales/components/SalesTable';
import { PageHeader } from '@/components/shared/PageHeader';
import { Button } from '@/components/shared/Button';
import { Card } from '@/components/shared/Card';
import { Input } from '@/components/shared/Input';
import { Select } from '@/components/shared/Select';
import { Plus, ShoppingCart, Search } from 'lucide-react';

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
          <>
            <Link href="/dashboard/pos">
              <Button variant="outline" icon={<ShoppingCart className="w-4 h-4" />}>Caisse POS</Button>
            </Link>
            <Link href="/dashboard/sales/new">
              <Button icon={<Plus className="w-4 h-4" />}>Nouvelle Facture</Button>
            </Link>
          </>
        }
      />

      {/* Filter bar */}
      <Card padding="md" className="mb-6">
        <div className="flex flex-col md:flex-row gap-4 items-end">
          <div className="flex-1 min-w-[200px]">
            <Input
              label="Rechercher"
              type="text"
              placeholder="N° de facture, client..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              icon={<Search className="w-4 h-4" />}
            />
          </div>

          <div className="flex-1 min-w-[150px]">
            <Input
              label="Date"
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
            />
          </div>

          <div className="flex-1 min-w-[150px]">
            <Select
              label="Type"
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              options={[
                { value: '', label: 'Tous les types' },
                { value: 'B2B', label: 'Facture B2B' },
                { value: 'POS', label: 'Ticket POS' },
              ]}
            />
          </div>

          <div className="flex-1 min-w-[150px]">
            <Select
              label="Statut"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              options={[
                { value: '', label: 'Tous les statuts' },
                { value: 'PAID', label: 'Payé' },
                { value: 'PARTIAL', label: 'Partiel' },
                { value: 'PENDING', label: 'Impayé' },
              ]}
            />
          </div>
          
          {/* Reset filters button */}
          {(searchTerm || dateFilter || typeFilter || statusFilter) && (
            <div className="mb-[1px]">
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
            </div>
          )}
        </div>
      </Card>

      {error && <div className="p-4 bg-red-50 text-red-600 rounded-xl text-sm mb-4">{error}</div>}
      <SalesTable sales={sales} isLoading={isLoading} error={null} />
    </>
  );
}
