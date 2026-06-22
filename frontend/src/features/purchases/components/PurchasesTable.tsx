'use client';
import React from 'react';
import { usePurchases } from '../hooks/usePurchases';
import { DataTable, ColumnDef } from '@/components/shared/DataTable';
import { PageHeader } from '@/components/shared/PageHeader';
import { formatCurrency, formatDate } from '@/utils/formatters';

export function PurchasesTable() {
  const { data, isLoading, error } = usePurchases();

  const columns: ColumnDef<any>[] = [
    { key: 'ref', header: 'Référence', cell: (p) => <span className="font-medium text-slate-900">{p.reference || p.id?.slice(0, 8)}</span> },
    { key: 'date', header: 'Date', cell: (p) => formatDate(p.orderDate || p.createdAt) },
    { key: 'supplier', header: 'Fournisseur', cell: (p) => p.supplier?.name || '—' },
    { key: 'total', header: 'Montant', align: 'right', cell: (p) => formatCurrency(p.totalCost) },
    {
      key: 'status', header: 'Statut',
      cell: (p) => (
        <span className={`inline-block px-2 py-0.5 text-xs font-semibold border ${p.status === 'RECEIVED' ? 'text-emerald-700 bg-emerald-50 border-emerald-200' : p.status === 'ORDERED' ? 'text-blue-700 bg-blue-50 border-blue-200' : 'text-slate-600 bg-slate-50 border-slate-200'}`}>
          {p.status || 'N/A'}
        </span>
      )
    }
  ];

  if (error) return <div className="p-4 bg-red-50 text-red-600 border border-red-200">{error}</div>;

  return (
    <>
      <PageHeader title="Achats" description="Commandes d'achat et approvisionnement." />
      <DataTable data={data} columns={columns} keyExtractor={(p) => p.id} isLoading={isLoading} />
    </>
  );
}
