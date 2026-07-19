import React from 'react';
import { TrendingUp, Users, DollarSign, Package } from 'lucide-react';
import { AnalyticsKpis } from '@/types';
import { formatCurrency } from '@/utils/formatters';
import { SummaryCard } from '@/components/shared/SummaryCard';

interface DashboardKpisProps {
  kpis: AnalyticsKpis | null;
  isLoading: boolean;
}

export const DashboardKpis: React.FC<DashboardKpisProps> = ({ kpis, isLoading }) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {[1,2,3,4].map(i => (
          <div key={i} className="bg-white rounded-xl shadow-sm p-5 h-32 animate-pulse">
            <div className="flex justify-between mb-3">
              <div className="h-4 bg-gray-100 rounded-full w-24" />
              <div className="h-9 w-9 bg-gray-100 rounded-lg" />
            </div>
            <div className="h-7 bg-gray-100 rounded-lg w-32 mt-4" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
      <SummaryCard
        title="Chiffre d'Affaires"
        value={formatCurrency(kpis?.totalRevenue)}
        icon={<DollarSign className="h-5 w-5" />}
        trend={{ value: 12.5, isPositive: true }}
      />
      <SummaryCard
        title="Marge Commerciale"
        value={formatCurrency(kpis?.commercialMargin)}
        icon={<TrendingUp className="h-5 w-5 text-emerald-600" />}
        trend={{ value: 8.2, isPositive: true }}
      />
      <SummaryCard
        title="Créances Clients"
        value={formatCurrency(kpis?.totalReceivables)}
        icon={<Users className="h-5 w-5 text-amber-600" />}
        trend={{ value: 3.1, isPositive: false }}
      />
      <SummaryCard
        title="Coût d'Achat (COGS)"
        value={formatCurrency(kpis?.totalCogs)}
        icon={<Package className="h-5 w-5" />}
        trend={{ value: 0, isPositive: false }}
      />
    </div>
  );
};
