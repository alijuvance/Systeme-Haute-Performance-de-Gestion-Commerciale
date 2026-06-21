'use client';
import { useStocks } from '@/features/stocks/hooks/useStocks';
import { StocksTable } from '@/features/stocks/components/StocksTable';
import { Plus } from 'lucide-react';

export default function StockPage() {
  const { data, isLoading, error } = useStocks();

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Gestion des Stocks</h1>
        <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-xl shadow hover:bg-blue-700 transition-colors">
          <Plus className="w-4 h-4" /> Nouveau
        </button>
      </div>

      <StocksTable data={data} isLoading={isLoading} error={error} />
    </div>
  );
}
