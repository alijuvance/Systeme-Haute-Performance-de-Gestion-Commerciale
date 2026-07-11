import React from 'react';
import { TrendingUp, Users, DollarSign, Package } from 'lucide-react';
import { AnalyticsKpis } from '@/types';
import { formatCurrency } from '@/utils/formatters';

interface DashboardKpisProps {
  kpis: AnalyticsKpis | null;
  isLoading: boolean;
}

interface KpiCardProps {
  title: string;
  value: string;
  subtitle: string;
  icon: React.ReactNode;
  iconBg?: string;
  accent?: string;
}

function KpiCard({ title, value, subtitle, icon, iconBg = 'bg-gray-100', accent }: KpiCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm p-5 hover:shadow-md transition-shadow duration-200">
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-medium text-gray-500">{title}</span>
        <div className={`w-9 h-9 ${iconBg} rounded-lg flex items-center justify-center`}>
          {icon}
        </div>
      </div>
      <div className={`text-2xl font-semibold tabular-nums ${accent || 'text-gray-900'}`}>{value}</div>
      <p className="text-xs text-gray-400 mt-1.5">{subtitle}</p>
    </div>
  );
}

export const DashboardKpis: React.FC<DashboardKpisProps> = ({ kpis, isLoading }) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {[1,2,3,4].map(i => (
          <div key={i} className="bg-white rounded-xl shadow-sm p-5 h-28 animate-pulse">
            <div className="flex justify-between mb-3">
              <div className="h-4 bg-gray-100 rounded-full w-24" />
              <div className="h-9 w-9 bg-gray-100 rounded-lg" />
            </div>
            <div className="h-7 bg-gray-100 rounded-lg w-32" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
      <KpiCard
        title="Chiffre d'Affaires"
        value={formatCurrency(kpis?.totalRevenue)}
        subtitle="Total des ventes enregistrées"
        icon={<DollarSign className="h-4 w-4 text-gray-600" />}
      />
      <KpiCard
        title="Marge Commerciale"
        value={formatCurrency(kpis?.commercialMargin)}
        subtitle="Revenus déduits des coûts"
        icon={<TrendingUp className="h-4 w-4 text-emerald-600" />}
        iconBg="bg-emerald-50"
        accent="text-emerald-700"
      />
      <KpiCard
        title="Créances Clients"
        value={formatCurrency(kpis?.totalReceivables)}
        subtitle="Restant à recouvrer"
        icon={<Users className="h-4 w-4 text-amber-600" />}
        iconBg="bg-amber-50"
        accent="text-amber-700"
      />
      <KpiCard
        title="Coût d'Achat (COGS)"
        value={formatCurrency(kpis?.totalCogs)}
        subtitle="Valeur totale des sorties"
        icon={<Package className="h-4 w-4 text-gray-600" />}
      />
    </div>
  );
};
