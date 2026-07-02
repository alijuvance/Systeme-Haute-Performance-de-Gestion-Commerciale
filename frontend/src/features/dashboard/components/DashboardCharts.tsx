import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { LineChart } from 'lucide-react';
import { formatCurrency } from '@/utils/formatters';

interface DashboardChartsProps {
  chartData: any[];
  isLoading: boolean;
}

export const DashboardCharts: React.FC<DashboardChartsProps> = ({ chartData, isLoading }) => {
  if (isLoading) {
    return <div className="bg-white border border-slate-200 p-6 h-96 flex items-center justify-center text-slate-400 animate-pulse">Chargement du graphique...</div>;
  }

  return (
    <div className="bg-white border border-slate-200 p-6">
      <h2 className="text-base font-bold text-slate-900 mb-6">Évolution des Ventes</h2>
      <div className="h-80 w-full" style={{ minHeight: '300px' }}>
        {chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0f172a" stopOpacity={0.15}/>
                  <stop offset="95%" stopColor="#0f172a" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} width={80} tickFormatter={(v) => new Intl.NumberFormat('fr-MG', { notation: "compact", compactDisplay: "short" }).format(v)} />
              <Tooltip
                formatter={(value: any) => [formatCurrency(value), "Ventes"]}
                contentStyle={{ border: '1px solid #e2e8f0', boxShadow: '0 4px 12px rgba(0,0,0,0.08)', backgroundColor: '#ffffff', color: '#0f172a', fontSize: '13px' }}
              />
              <Area type="monotone" dataKey="amount" stroke="#0f172a" strokeWidth={2} fillOpacity={1} fill="url(#colorSales)" />
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-slate-400">
            <LineChart className="w-10 h-10 mb-3 opacity-30" />
            <p className="text-sm">Aucune donnée de vente disponible</p>
          </div>
        )}
      </div>
    </div>
  );
};
