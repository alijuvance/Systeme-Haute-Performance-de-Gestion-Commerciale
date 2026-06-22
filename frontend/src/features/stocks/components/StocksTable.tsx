'use client';
import React from 'react';
import { useStocks } from '../hooks/useStocks';
import { DataTable, ColumnDef } from '@/components/shared/DataTable';
import { PageHeader } from '@/components/shared/PageHeader';

export function StocksTable() {
  const { data, isLoading, error } = useStocks();

  const columns: ColumnDef<any>[] = [
    { key: 'product', header: 'Produit', cell: (s) => <span className="font-medium text-slate-900">{s.product?.name || '—'}</span> },
    { key: 'depot', header: 'Dépôt', cell: (s) => s.depot?.name || '—' },
    { key: 'qty', header: 'Quantité', align: 'right', cell: (s) => <span className="tabular-nums">{s.quantity}</span> },
    {
      key: 'status', header: 'État',
      cell: (s) => {
        const alert = s.product?.minimumStockAlert || 0;
        const isLow = s.quantity <= alert && alert > 0;
        return (
          <span className={`inline-block px-2 py-0.5 text-xs font-semibold border ${isLow ? 'text-red-700 bg-red-50 border-red-200' : 'text-emerald-700 bg-emerald-50 border-emerald-200'}`}>
            {isLow ? 'Stock bas' : 'Normal'}
          </span>
        );
      }
    }
  ];

  if (error) return <div className="p-4 bg-red-50 text-red-600 border border-red-200">{error}</div>;

  return (
    <>
      <PageHeader title="Niveaux de Stock" description="Vue en temps réel des stocks par dépôt." />
      <DataTable data={data} columns={columns} keyExtractor={(s) => s.id} isLoading={isLoading} />
    </>
  );
}
