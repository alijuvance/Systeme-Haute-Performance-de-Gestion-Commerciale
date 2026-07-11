import React from 'react';
import { Debt } from '../types';
import { DataTable, ColumnDef } from '@/components/shared/DataTable';
import { formatCurrency, formatDate } from '@/utils/formatters';
import { Badge } from '@/components/shared/Badge';
import { Card } from '@/components/shared/Card';

interface DebtsTableProps {
  debts: Debt[];
  loading: boolean;
  totalDebt: number;
}

export const DebtsTable: React.FC<DebtsTableProps> = ({ debts, loading, totalDebt }) => {
  const columns: ColumnDef<Debt>[] = [
    { key: 'invoice', header: 'Facture N°', cell: (d) => <span className="font-medium text-gray-900">{d.invoiceNumber}</span> },
    { key: 'date', header: 'Date', cell: (d) => <span className="text-gray-500">{formatDate(d.date)}</span> },
    { key: 'client', header: 'Client', cell: (d) => <span className="text-gray-900">{d.customer?.companyName || d.customer?.fullName}</span> },
    { key: 'total', header: 'Total', align: 'right', cell: (d) => <span className="tabular-nums font-medium text-gray-900">{formatCurrency(d.totalAmount)}</span> },
    { key: 'paid', header: 'Payé', align: 'right', cell: (d) => <span className="tabular-nums text-emerald-600">{formatCurrency(d.amountPaid)}</span> },
    { key: 'remaining', header: 'Reste à Payer', align: 'right', cell: (d) => <span className="tabular-nums font-semibold text-red-600">{formatCurrency(d.totalAmount - d.amountPaid)}</span> }
  ];

  return (
    <Card padding="none" className="overflow-hidden">
      <DataTable
        data={debts}
        columns={columns}
        keyExtractor={(d) => d.id}
        isLoading={loading}
        emptyMessage="Aucune créance client (dette) trouvée."
      />
      {!loading && debts.length > 0 && (
        <div className="bg-gray-50/80 px-6 py-4 flex justify-end gap-6 items-center border-t border-gray-100">
          <span className="text-sm font-semibold text-gray-900 uppercase tracking-wide">Total des Créances</span>
          <span className="text-xl font-bold text-red-600 tabular-nums">{formatCurrency(totalDebt)}</span>
        </div>
      )}
    </Card>
  );
};
