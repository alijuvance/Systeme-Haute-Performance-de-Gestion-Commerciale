import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, Users, DollarSign, Package } from 'lucide-react';
import { AnalyticsKpis } from '@/types';
import { formatCurrency } from '@/utils/formatters';

interface DashboardKpisProps {
  kpis: AnalyticsKpis | null;
  isLoading: boolean;
}

export const DashboardKpis: React.FC<DashboardKpisProps> = ({ kpis, isLoading }) => {
  if (isLoading) {
    return <div className="animate-pulse flex gap-6">Chargement des KPIs...</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
      <Card className="relative overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-semibold text-gray-600 dark:text-gray-300">Chiffre d'Affaires</CardTitle>
          <div className="p-2 bg-blue-100 dark:bg-blue-500/20 rounded-xl">
            <DollarSign className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-black text-gray-800 dark:text-white mt-2">{formatCurrency(kpis?.totalRevenue)}</div>
          <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mt-1 flex items-center">
              <span className="text-green-500 mr-1 flex items-center"><TrendingUp className="w-3 h-3 mr-1"/>+12.5%</span> par rapport au mois dernier
          </p>
        </CardContent>
      </Card>

      <Card className="relative overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-semibold text-gray-600 dark:text-gray-300">Marge Commerciale</CardTitle>
          <div className="p-2 bg-emerald-100 dark:bg-emerald-500/20 rounded-xl">
            <TrendingUp className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-black text-emerald-600 dark:text-emerald-400 mt-2">{formatCurrency(kpis?.commercialMargin)}</div>
          <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mt-1 flex items-center">
            Revenus déduits des coûts d'achats
          </p>
        </CardContent>
      </Card>

      <Card className="relative overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-br from-rose-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-semibold text-gray-600 dark:text-gray-300">Créances Clients</CardTitle>
          <div className="p-2 bg-rose-100 dark:bg-rose-500/20 rounded-xl">
            <Users className="h-5 w-5 text-rose-600 dark:text-rose-400" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-black text-rose-600 dark:text-rose-400 mt-2">{formatCurrency(kpis?.totalReceivables)}</div>
          <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mt-1">
            Restant à recouvrer
          </p>
        </CardContent>
      </Card>

      <Card className="relative overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-semibold text-gray-600 dark:text-gray-300">Coût d'Achat (COGS)</CardTitle>
          <div className="p-2 bg-purple-100 dark:bg-purple-500/20 rounded-xl">
            <Package className="h-5 w-5 text-purple-600 dark:text-purple-400" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-black text-gray-800 dark:text-white mt-2">{formatCurrency(kpis?.totalCogs)}</div>
          <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mt-1">
            Valeur totale des sorties
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
