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
    return (
      <div className="bg-white rounded-xl shadow-sm p-6 h-96 flex items-center justify-center">
        <div className="flex items-center gap-2 text-gray-400">
          <div className="w-4 h-4 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
          <span className="text-sm">Chargement du graphique...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h2 className="text-base font-semibold text-gray-900 mb-6">Évolution des Ventes</h2>
      <div className="h-80 w-full" style={{ minHeight: '300px' }}>
        {chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#111827" stopOpacity={0.12}/>
                  <stop offset="95%" stopColor="#111827" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
              <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 12 }} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 12 }} width={80} tickFormatter={(v) => new Intl.NumberFormat('fr-MG', { notation: "compact", compactDisplay: "short" }).format(v)} />
              <Tooltip
                formatter={(value: any) => [formatCurrency(value), "Ventes"]}
                contentStyle={{ 
                  border: 'none', 
                  boxShadow: '0 4px 12px rgba(0,0,0,0.08)', 
                  backgroundColor: '#ffffff', 
                  color: '#111827', 
                  fontSize: '13px',
                  borderRadius: '12px',
                  padding: '10px 14px',
                }}
              />
              <Area type="monotone" dataKey="amount" stroke="#111827" strokeWidth={2} fillOpacity={1} fill="url(#colorSales)" />
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-gray-400">
            <LineChart className="w-10 h-10 mb-3 opacity-30" />
            <p className="text-sm">Aucune donnée de vente disponible</p>
          </div>
        )}
      </div>
    </div>
  );
};
