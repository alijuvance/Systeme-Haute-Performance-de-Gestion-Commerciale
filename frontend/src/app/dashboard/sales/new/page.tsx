'use client';

import { SaleForm } from '@/features/sales/components/SaleForm';

export default function NewSalePage() {
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
        Nouvelle Facture B2B
      </h1>
      <SaleForm />
    </div>
  );
}
