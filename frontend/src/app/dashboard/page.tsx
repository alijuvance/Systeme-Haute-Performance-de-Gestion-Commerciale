'use client';

import { useDashboard } from '@/features/dashboard/hooks/useDashboard';
import { DashboardKpis } from '@/features/dashboard/components/DashboardKpis';
import { DashboardCharts } from '@/features/dashboard/components/DashboardCharts';

export default function DashboardPage() {
  const { kpis, chartData, isLoading, error } = useDashboard();

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-500 tracking-tight">
            Tableau de bord
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1 font-medium">
            Voici ce qui se passe dans votre entreprise aujourd'hui.
          </p>
        </div>
      </div>

      {error && (
        <div className="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400" role="alert">
          <span className="font-medium">Erreur:</span> {error}
        </div>
      )}

      <DashboardKpis kpis={kpis} isLoading={isLoading} />
      <DashboardCharts chartData={chartData} isLoading={isLoading} />
    </div>
  );
}
