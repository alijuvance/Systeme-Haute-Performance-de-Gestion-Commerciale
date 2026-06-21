'use client';
import Link from 'next/link';
import { useSales } from '@/features/sales/hooks/useSales';
import { SalesTable } from '@/features/sales/components/SalesTable';

export default function SalesPage() {
  const { sales, isLoading, error } = useSales();

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Ventes & Factures</h1>
        <div className="space-x-3">
          <Link href="/dashboard/pos" className="bg-green-600 text-white px-4 py-2 rounded shadow hover:bg-green-700">
            Caisse POS
          </Link>
          <Link href="/dashboard/sales/new" className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700">
            + Nouvelle Facture B2B
          </Link>
        </div>
      </div>

      <SalesTable sales={sales} isLoading={isLoading} error={error} />
    </div>
  );
}
