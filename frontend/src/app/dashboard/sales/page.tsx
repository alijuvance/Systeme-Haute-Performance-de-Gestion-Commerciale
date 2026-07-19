'use client';
import Link from 'next/link';
import { useSales } from '@/features/sales/hooks/useSales';
import { SalesTable } from '@/features/sales/components/SalesTable';
import { PageHeader } from '@/components/shared/PageHeader';
import { Button } from '@/components/shared/Button';
import { Card } from '@/components/shared/Card';
import { Input } from '@/components/shared/Input';
import { Select } from '@/components/shared/Select';
import { StatCard } from '@/components/shared/StatCard';
import { Progress } from '@/components/shared/Progress';
import { Plus, ShoppingCart, Search, Download, FileText, DollarSign, AlertCircle, TrendingUp } from 'lucide-react';
import { exportToExcel } from '@/utils/exportToExcel';
import { formatCurrency, formatDate } from '@/utils/formatters';
import { useMemo } from 'react';

export default function SalesPage() {
  const { 
    sales, isLoading, error,
    searchTerm, setSearchTerm,
    dateFilter, setDateFilter,
    typeFilter, setTypeFilter,
    statusFilter, setStatusFilter
  } = useSales();

  const handleExport = () => {
    const dataToExport = sales.map(s => ({
      'Facture N°': s.invoiceNumber || s.reference,
      'Date': formatDate(s.date || s.createdAt),
      'Type': s.type,
      'Client': s.customer?.companyName || s.customer?.fullName || 'Client Divers',
      'Total TTC (MGA)': s.totalAmount,
      'Payé (MGA)': s.amountPaid,
      'Reste (MGA)': s.totalAmount - (s.amountPaid || 0),
      'Statut': s.status
    }));
    exportToExcel(dataToExport, `Ventes_${new Date().toISOString().split('T')[0]}`);
  };

  // Calculate summary metrics
  const summary = useMemo(() => {
    let totalFactures = sales.length;
    let montantTotal = 0;
    let montantPaye = 0;
    let facturesImpayees = 0;

    sales.forEach(s => {
      montantTotal += s.totalAmount || 0;
      montantPaye += s.amountPaid || 0;
      if (s.status === 'PENDING' || s.status === 'PARTIAL') {
        facturesImpayees++;
      }
    });

    const tauxRecouvrement = montantTotal > 0 ? (montantPaye / montantTotal) * 100 : 0;

    return { totalFactures, montantTotal, montantPaye, facturesImpayees, tauxRecouvrement };
  }, [sales]);

  return (
    <>
      <PageHeader
        title="Ventes & Factures"
        description="Historique des ventes B2B et POS."
        actions={
          <>
            <Button variant="outline" icon={<Download className="w-4 h-4" />} onClick={handleExport}>
              Exporter
            </Button>
            <Link href="/dashboard/pos">
              <Button variant="outline" icon={<ShoppingCart className="w-4 h-4" />}>Caisse POS</Button>
            </Link>
            <Link href="/dashboard/sales/new">
              <Button icon={<Plus className="w-4 h-4" />}>Nouvelle Facture</Button>
            </Link>
          </>
        }
      />

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
        <StatCard
          title="Total Factures"
          value={summary.totalFactures.toString()}
          icon={<FileText className="h-4 w-4 text-gray-600" />}
          subtitle="Factures filtrées"
        />
        <StatCard
          title="Montant Total (TTC)"
          value={formatCurrency(summary.montantTotal)}
          icon={<DollarSign className="h-4 w-4 text-gray-600" />}
        />
        <Card padding="md" className="flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[13px] font-medium text-gray-500">Taux de Recouvrement</span>
            <div className="w-9 h-9 bg-emerald-50 rounded-lg flex items-center justify-center flex-shrink-0">
              <TrendingUp className="h-4 w-4 text-emerald-600" />
            </div>
          </div>
          <div className="flex-1">
            <div className="text-2xl font-semibold text-gray-900 tabular-nums mb-3">
              {summary.tauxRecouvrement.toFixed(1)}%
            </div>
            <Progress value={summary.tauxRecouvrement} variant="success" size="sm" />
          </div>
        </Card>
        <StatCard
          title="Factures Impayées"
          value={summary.facturesImpayees.toString()}
          icon={<AlertCircle className="h-4 w-4 text-red-600" />}
          iconBg="bg-red-50"
          accentColor="#dc2626"
          subtitle="PENDING ou PARTIAL"
        />
      </div>

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
      <SalesTable sales={sales} isLoading={isLoading} error={null} onRefresh={() => window.location.reload()} />
    </>
  );
}
