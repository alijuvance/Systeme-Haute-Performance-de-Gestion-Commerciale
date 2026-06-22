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
  accent?: string;
}

function KpiCard({ title, value, subtitle, icon, accent }: KpiCardProps) {
  return (
    <div className="bg-white border border-slate-200 p-5">
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-semibold text-slate-500">{title}</span>
        <div className="text-slate-400">{icon}</div>
      </div>
      <div className={`text-2xl font-bold tabular-nums ${accent || 'text-slate-900'}`}>{value}</div>
      <p className="text-xs text-slate-500 mt-1">{subtitle}</p>
    </div>
  );
}

export const DashboardKpis: React.FC<DashboardKpisProps> = ({ kpis, isLoading }) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {[1,2,3,4].map(i => (
          <div key={i} className="bg-white border border-slate-200 p-5 h-28 animate-pulse" />
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
        icon={<DollarSign className="h-5 w-5" />}
      />
      <KpiCard
        title="Marge Commerciale"
        value={formatCurrency(kpis?.commercialMargin)}
        subtitle="Revenus déduits des coûts"
        icon={<TrendingUp className="h-5 w-5" />}
        accent="text-emerald-700"
      />
      <KpiCard
        title="Créances Clients"
        value={formatCurrency(kpis?.totalReceivables)}
        subtitle="Restant à recouvrer"
        icon={<Users className="h-5 w-5" />}
        accent="text-amber-700"
      />
      <KpiCard
        title="Coût d'Achat (COGS)"
        value={formatCurrency(kpis?.totalCogs)}
        subtitle="Valeur totale des sorties"
        icon={<Package className="h-5 w-5" />}
      />
    </div>
  );
};
