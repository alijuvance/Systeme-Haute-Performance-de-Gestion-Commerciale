'use client';
import { useState } from 'react';
import { useSales } from '@/features/sales/hooks/useSales';
import { SalesTable } from '@/features/sales/components/SalesTable';
import { SalesKanban } from '@/features/sales/components/SalesKanban';
import { PageHeader } from '@/components/shared/PageHeader';
import { Button } from '@/components/shared/Button';
import { Card } from '@/components/shared/Card';
import { Input } from '@/components/shared/Input';
import { Select } from '@/components/shared/Select';
import { Tabs } from '@/components/shared/Tabs';
import Drawer from '@/components/shared/Drawer';
import { Plus, Search, Download, List, LayoutGrid } from 'lucide-react';
import { exportToExcel } from '@/utils/exportToExcel';
import { formatCurrency, formatDate } from '@/utils/formatters';
import { Sale } from '@/types';

export default function SalesPage() {
  const { 
    sales, isLoading, error, fetchSales,
    searchTerm, setSearchTerm,
    statusFilter, setStatusFilter
  } = useSales();
  
  const [view, setView] = useState('list');
  const [selectedSale, setSelectedSale] = useState<Sale | null>(null);

  const handleExport = () => {
    const dataToExport = sales.map(s => ({
      'N° Facture': s.invoiceNumber || s.reference,
      'Date': formatDate(s.date || s.createdAt),
      'Client': s.customer?.companyName || s.customer?.fullName || '—',
      'Montant Total (MGA)': s.totalAmount,
      'Montant Payé (MGA)': s.amountPaid,
      'Statut': s.status,
      'Type': s.type
    }));
    exportToExcel(dataToExport, `Ventes_${new Date().toISOString().split('T')[0]}`);
  };

  return (
    <>
      <PageHeader
        title="Ventes & Factures"
        description="Gérez vos ventes, factures et encaissements."
        actions={
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleExport} icon={<Download className="w-4 h-4" />}>
              Exporter
            </Button>
            <Button icon={<Plus className="w-4 h-4" />}>
              Nouvelle Vente
            </Button>
          </div>
        }
      />

      <Card padding="md" className="mb-6">
        <div className="flex flex-col md:flex-row gap-4 items-end justify-between">
          <div className="flex gap-4 flex-1">
            <div className="flex-1 min-w-[200px]">
              <Input
                label="Rechercher"
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="N° facture, client..."
                icon={<Search className="w-4 h-4" />}
              />
            </div>
            <div className="flex-1 min-w-[150px]">
              <Select
                label="Statut"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                options={[
                  { value: '', label: 'Tous' },
                  { value: 'PAID', label: 'Payé' },
                  { value: 'PARTIAL', label: 'Partiel' },
                  { value: 'DRAFT', label: 'Brouillon' },
                ]}
              />
            </div>
          </div>
          
          <div className="flex items-center">
            <Tabs 
              activeTab={view} 
              onChange={setView} 
              tabs={[
                { id: 'list', label: 'Liste', icon: <List className="w-4 h-4" /> },
                { id: 'kanban', label: 'Kanban', icon: <LayoutGrid className="w-4 h-4" /> }
              ]} 
              className="border-none mt-2 md:mt-0"
            />
          </div>
        </div>
      </Card>

      {view === 'list' ? (
        <SalesTable sales={sales} isLoading={isLoading} error={error} onRefresh={fetchSales} />
      ) : (
        <SalesKanban sales={sales} isLoading={isLoading} onSaleClick={setSelectedSale} />
      )}

      {/* Sale Details Drawer */}
      <Drawer
        isOpen={!!selectedSale}
        onClose={() => setSelectedSale(null)}
        title={`Détails Facture ${selectedSale?.invoiceNumber || selectedSale?.reference}`}
        width="2xl"
      >
        {selectedSale && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                <p className="text-sm text-gray-500 mb-1">Client</p>
                <p className="font-semibold text-gray-900">{selectedSale.customer?.companyName || selectedSale.customer?.fullName || 'Client Divers'}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                <p className="text-sm text-gray-500 mb-1">Total</p>
                <p className="font-semibold text-gray-900 text-lg tabular-nums text-indigo-600">{formatCurrency(selectedSale.totalAmount)}</p>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-3">Articles facturés</h3>
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Produit</th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-500">Qté</th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-500">Prix Unitaire</th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-500">Total</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {selectedSale.lines?.map((line: any) => (
                      <tr key={line.id}>
                        <td className="px-4 py-3 text-sm text-gray-900">{line.product?.name}</td>
                        <td className="px-4 py-3 text-sm text-right tabular-nums">{line.quantity}</td>
                        <td className="px-4 py-3 text-sm text-right tabular-nums">{formatCurrency(line.unitPrice)}</td>
                        <td className="px-4 py-3 text-sm text-right tabular-nums font-medium">{formatCurrency(line.quantity * line.unitPrice)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </Drawer>
    </>
  );
}
