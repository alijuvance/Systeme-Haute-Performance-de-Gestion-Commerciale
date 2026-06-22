'use client';
import Link from 'next/link';
import { useSales } from '@/features/sales/hooks/useSales';
import { SalesTable } from '@/features/sales/components/SalesTable';
import { PageHeader } from '@/components/shared/PageHeader';
import { Button } from '@/components/shared/Button';
import { Plus, ShoppingCart } from 'lucide-react';

export default function SalesPage() {
  const { sales, isLoading, error } = useSales();

  return (
    <>
      <PageHeader
        title="Ventes & Factures"
        description="Historique des ventes B2B et POS."
        actions={
          <div className="flex items-center gap-3">
            <Link href="/dashboard/pos">
              <Button variant="outline" icon={<ShoppingCart className="w-4 h-4" />}>Caisse POS</Button>
            </Link>
            <Link href="/dashboard/sales/new">
              <Button icon={<Plus className="w-4 h-4" />}>Nouvelle Facture B2B</Button>
            </Link>
          </div>
        }
      />
      {error && <div className="p-4 bg-red-50 text-red-600 border border-red-200 mb-4">{error}</div>}
      <SalesTable sales={sales} isLoading={isLoading} error={null} />
    </>
  );
}
