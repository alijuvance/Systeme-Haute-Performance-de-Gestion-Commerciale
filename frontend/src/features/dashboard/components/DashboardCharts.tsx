import React from 'react';
import { Card } from '@/components/ui/card';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { LineChart } from 'lucide-react';
import { formatCurrency } from '@/utils/formatters';

interface DashboardChartsProps {
  chartData: any[];
  isLoading: boolean;
}

export const DashboardCharts: React.FC<DashboardChartsProps> = ({ chartData, isLoading }) => {
  if (isLoading) {
    return <Card className="p-8 pb-10 h-96 flex items-center justify-center animate-pulse text-gray-500">Chargement du graphique...</Card>;
  }

  return (
    <Card className="p-8 pb-10">
      <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-8 flex items-center">
        <div className="w-2 h-8 bg-blue-500 rounded-full mr-3"></div>
        Évolution des Ventes
      </h2>
      <div className="h-96 w-full">
        {chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.6}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.1)" />
              <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} dy={15} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} width={80} tickFormatter={(value) => new Intl.NumberFormat('fr-MG', { notation: "compact", compactDisplay: "short" }).format(value)} />
              <Tooltip 
                formatter={(value: any) => [formatCurrency(value), "Ventes"]}
                contentStyle={{ borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 10px 40px -10px rgba(0,0,0,0.3)', backgroundColor: 'rgba(15, 23, 42, 0.8)', backdropFilter: 'blur(10px)', color: 'white' }}
              />
              <Area type="monotone" dataKey="amount" stroke="#3b82f6" strokeWidth={4} fillOpacity={1} fill="url(#colorSales)" />
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-gray-400">
            <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-white/5 flex items-center justify-center mb-4">
              <LineChart className="w-8 h-8 opacity-50" />
            </div>
            <p className="font-medium">Aucune donnée de vente pour le graphique</p>
          </div>
        )}
      </div>
    </Card>
  );
};
