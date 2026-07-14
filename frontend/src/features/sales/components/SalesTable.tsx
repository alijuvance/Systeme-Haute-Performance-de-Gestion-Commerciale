import React from 'react';
import { formatCurrency, formatDate } from '@/utils/formatters';
import { DataTable, ColumnDef } from '@/components/shared/DataTable';
import { Badge } from '@/components/shared/Badge';
import { Printer } from 'lucide-react';
import { generateInvoicePdf } from '@/utils/pdfGenerator';

interface SalesTableProps {
  sales: any[];
  isLoading: boolean;
  error: string | null;
}

export const SalesTable: React.FC<SalesTableProps> = ({ sales, isLoading, error }) => {
  if (error) return <div className="p-4 bg-red-50 text-red-600 rounded-xl text-sm">{error}</div>;

  const columns: ColumnDef<any>[] = [
    { key: 'invoice', header: 'Facture N°', cell: (s) => <span className="font-medium text-gray-900">{s.invoiceNumber}</span> },
    { key: 'date', header: 'Date', cell: (s) => <span className="text-gray-500">{formatDate(s.date)}</span> },
    {
      key: 'type', header: 'Type',
      cell: (s) => (
        <Badge variant={s.type === 'POS' ? 'info' : 'default'}>
          {s.type}
        </Badge>
      )
    },
    { key: 'client', header: 'Client', cell: (s) => s.customer?.companyName || s.customer?.fullName || '—' },
    { key: 'total', header: 'Montant', align: 'right', cell: (s) => <span className="font-medium tabular-nums">{formatCurrency(s.totalAmount)}</span> },
    { key: 'paid', header: 'Payé', align: 'right', cell: (s) => <span className="tabular-nums text-gray-500">{formatCurrency(s.amountPaid)}</span> },
    {
      key: 'status', header: 'Statut',
      cell: (s) => (
        <Badge variant={
          s.status === 'PAID' ? 'success' :
          s.status === 'PARTIAL' ? 'warning' : 'danger'
        }>
          {s.status === 'PAID' ? 'Payé' : s.status === 'PARTIAL' ? 'Partiel' : 'Impayé'}
        </Badge>
      )
    },
    {
      key: 'actions', header: '', align: 'right',
      cell: (s) => (
        <button 
          onClick={() => generateInvoicePdf(s)}
          className="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all duration-200"
          title="Imprimer / PDF"
        >
          <Printer className="w-4 h-4" />
        </button>
      )
    }
  ];

  return <DataTable data={sales} columns={columns} keyExtractor={(s) => s.id} isLoading={isLoading} emptyMessage="Aucune vente trouvée avec ces filtres." />;
};
