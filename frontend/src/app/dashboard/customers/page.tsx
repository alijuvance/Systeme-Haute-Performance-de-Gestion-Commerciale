'use client';
import { useCustomers } from '@/features/customers/hooks/useCustomers';
import { CustomersTable } from '@/features/customers/components/CustomersTable';
import { Plus } from 'lucide-react';

export default function CustomerPage() {
  const { data, isLoading, error } = useCustomers();

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Gestion des Clients</h1>
        <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-xl shadow hover:bg-blue-700 transition-colors">
          <Plus className="w-4 h-4" /> Nouveau
        </button>
      </div>

      <CustomersTable data={data} isLoading={isLoading} error={error} />
    </div>
  );
}
