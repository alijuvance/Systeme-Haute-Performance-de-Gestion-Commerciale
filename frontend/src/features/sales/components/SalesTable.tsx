import React from 'react';
import { formatCurrency, formatDate } from '@/utils/formatters';
import { DataTable, ColumnDef } from '@/components/shared/DataTable';
import { Printer } from 'lucide-react';
import { generateInvoicePdf } from '@/utils/pdfGenerator';

interface SalesTableProps {
  sales: any[];
  isLoading: boolean;
  error: string | null;
}

export const SalesTable: React.FC<SalesTableProps> = ({ sales, isLoading, error }) => {
  if (error) return <div className="p-4 bg-red-50 text-red-600 border border-red-200">{error}</div>;

  const columns: ColumnDef<any>[] = [
    { key: 'invoice', header: 'Facture N°', cell: (s) => <span className="font-medium text-slate-900">{s.invoiceNumber}</span> },
    { key: 'date', header: 'Date', cell: (s) => formatDate(s.date) },
    {
      key: 'type', header: 'Type',
      cell: (s) => (
        <span className={`inline-block px-2 py-0.5 text-xs font-semibold border ${s.type === 'POS' ? 'text-purple-700 bg-purple-50 border-purple-200' : 'text-blue-700 bg-blue-50 border-blue-200'}`}>
          {s.type}
        </span>
      )
    },
    { key: 'client', header: 'Client', cell: (s) => s.customer?.companyName || s.customer?.fullName || '—' },
    { key: 'total', header: 'Montant', align: 'right', cell: (s) => formatCurrency(s.totalAmount) },
    { key: 'paid', header: 'Payé', align: 'right', cell: (s) => formatCurrency(s.amountPaid) },
    {
      key: 'status', header: 'Statut',
      cell: (s) => (
        <span className={`inline-block px-2 py-0.5 text-xs font-semibold border ${
          s.status === 'PAID' ? 'text-emerald-700 bg-emerald-50 border-emerald-200' :
          s.status === 'PARTIAL' ? 'text-amber-700 bg-amber-50 border-amber-200' :
          'text-red-700 bg-red-50 border-red-200'}`}>
          {s.status === 'PAID' ? 'Payé' : s.status === 'PARTIAL' ? 'Partiel' : 'Impayé'}
        </span>
      )
    },
    {
      key: 'actions', header: '', align: 'right',
      cell: (s) => (
        <button 
          onClick={() => generateInvoicePdf(s)}
          className="p-2 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded transition"
          title="Imprimer / PDF"
        >
          <Printer className="w-4 h-4" />
        </button>
      )
    }
  ];

  return <DataTable data={sales} columns={columns} keyExtractor={(s) => s.id} isLoading={isLoading} emptyMessage="Aucune vente trouvée avec ces filtres." />;
};
