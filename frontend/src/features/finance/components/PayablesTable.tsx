import React from 'react';
import { formatCurrency, formatDate } from '@/utils/formatters';
import { DataTable, ColumnDef } from '@/components/shared/DataTable';
import { Card } from '@/components/shared/Card';

interface PayablesTableProps {
  payables: any[];
  isLoading: boolean;
}

export const PayablesTable: React.FC<PayablesTableProps> = ({ payables, isLoading }) => {
  const columns: ColumnDef<any>[] = [
    { key: 'orderNumber', header: 'Commande N°', cell: (p) => <span className="font-medium text-gray-900">{p.orderNumber}</span> },
    { key: 'date', header: 'Date', cell: (p) => <span className="text-gray-500">{formatDate(p.date)}</span> },
    { key: 'supplier', header: 'Fournisseur', cell: (p) => <span className="text-gray-900">{p.supplier?.name || '—'}</span> },
    { key: 'total', header: 'Total (MGA)', align: 'right', cell: (p) => <span className="tabular-nums font-medium text-gray-900">{formatCurrency(p.totalAmount)}</span> },
    { key: 'paid', header: 'Déjà Payé', align: 'right', cell: (p) => <span className="tabular-nums text-emerald-600">{formatCurrency(p.amountPaid)}</span> },
    {
      key: 'remaining', header: 'Reste à payer', align: 'right',
      cell: (p) => (
        <span className="tabular-nums font-semibold text-red-600">
          {formatCurrency(p.totalAmount - p.amountPaid)}
        </span>
      )
    },
  ];

  return (
    <Card padding="none" className="overflow-hidden">
      <DataTable data={payables} columns={columns} keyExtractor={(p) => p.id} isLoading={isLoading} emptyMessage="Aucune dette fournisseur en attente." />
    </Card>
  );
};
