import React, { useState } from 'react';
import { formatCurrency, formatDate } from '@/utils/formatters';
import { DataTable, ColumnDef } from '@/components/shared/DataTable';
import { Badge } from '@/components/shared/Badge';
import { Printer, CreditCard, Undo2 } from 'lucide-react';
import { generateInvoicePdf } from '../utils/generateInvoicePdf';
import { Sale } from '@/types';
import { PaymentModal } from './PaymentModal';
import { CreditNoteModal } from './CreditNoteModal';

interface SalesTableProps {
  sales: Sale[];
  isLoading: boolean;
  error: string | null;
  onRefresh?: () => void;
}

export const SalesTable: React.FC<SalesTableProps> = ({ sales, isLoading, error, onRefresh }) => {
  const [selectedSaleForPayment, setSelectedSaleForPayment] = useState<Sale | null>(null);
  const [selectedSaleForCreditNote, setSelectedSaleForCreditNote] = useState<Sale | null>(null);

  if (error) return <div className="p-4 bg-red-50 text-red-600 rounded-xl text-sm">{error}</div>;

  const columns: ColumnDef<Sale>[] = [
    { key: 'invoice', header: 'Facture N°', cell: (s) => <span className="font-medium text-gray-900">{s.invoiceNumber || s.reference}</span> },
    { key: 'date', header: 'Date', cell: (s) => <span className="text-gray-500">{formatDate(s.date || s.createdAt)}</span> },
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
        <div className="flex justify-end gap-2">
          <button 
            onClick={() => setSelectedSaleForPayment(s)}
            className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all duration-200"
            title="Paiements"
          >
            <CreditCard className="w-4 h-4" />
          </button>
          <button 
            onClick={() => setSelectedSaleForCreditNote(s)}
            className="p-2 text-gray-400 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-all duration-200"
            title="Retours & Avoirs"
          >
            <Undo2 className="w-4 h-4" />
          </button>
          <button 
            onClick={() => generateInvoicePdf(s)}
            className="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all duration-200"
            title="Imprimer / PDF"
          >
            <Printer className="w-4 h-4" />
          </button>
        </div>
      )
    }
  ];

  return (
    <>
      <DataTable data={sales} columns={columns} keyExtractor={(s) => s.id} isLoading={isLoading} emptyMessage="Aucune vente trouvée avec ces filtres." />
      {selectedSaleForPayment && (
        <PaymentModal
          sale={selectedSaleForPayment}
          onClose={() => setSelectedSaleForPayment(null)}
          onSuccess={() => {
            if (onRefresh) onRefresh();
          }}
        />
      )}
      {selectedSaleForCreditNote && (
        <CreditNoteModal
          sale={selectedSaleForCreditNote}
          onClose={() => setSelectedSaleForCreditNote(null)}
          onSuccess={() => {
            if (onRefresh) onRefresh();
          }}
        />
      )}
    </>
  );
};
