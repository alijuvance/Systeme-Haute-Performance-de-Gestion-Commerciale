import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { LineChart } from 'lucide-react';
import { formatCurrency } from '@/utils/formatters';
import { Card, CardHeader, CardTitle } from '@/components/shared/Card';

interface DashboardChartsProps {
  chartData: any[];
  isLoading: boolean;
}

export const DashboardCharts: React.FC<DashboardChartsProps> = ({ chartData, isLoading }) => {
  if (isLoading) {
    return (
      <Card padding="lg" className="h-96 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-zinc-400">
          <div className="w-5 h-5 border-2 border-zinc-200 border-t-zinc-600 rounded-full animate-spin" />
          <span className="text-[13px]">Chargement du graphique...</span>
        </div>
      </Card>
    );
  }

  return (
    <Card padding="lg" className="h-full">
      <CardHeader>
        <CardTitle>Évolution des Ventes</CardTitle>
      </CardHeader>
      
      <div className="h-[280px] w-full mt-2">
        {chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 5, right: 0, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#18181b" stopOpacity={0.08}/>
                  <stop offset="95%" stopColor="#18181b" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f4f4f5" />
              <XAxis 
                dataKey="date" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#a1a1aa', fontSize: 11, fontWeight: 500 }} 
                dy={12} 
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#a1a1aa', fontSize: 11, fontWeight: 500 }} 
                tickFormatter={(v) => new Intl.NumberFormat('fr-MG', { notation: "compact", compactDisplay: "short" }).format(v)} 
              />
              <Tooltip
                formatter={(value: any) => [formatCurrency(value), "Ventes"]}
                contentStyle={{ 
                  border: '1px solid #f4f4f5', 
                  boxShadow: '0 4px 12px rgba(0,0,0,0.05)', 
                  backgroundColor: '#ffffff', 
                  color: '#18181b', 
                  fontSize: '12px',
                  fontWeight: 500,
                  borderRadius: '8px',
                  padding: '8px 12px',
                }}
                itemStyle={{ color: '#18181b' }}
                cursor={{ stroke: '#e4e4e7', strokeWidth: 1, strokeDasharray: '4 4' }}
              />
              <Area 
                type="monotone" 
                dataKey="amount" 
                stroke="#18181b" 
                strokeWidth={2} 
                fillOpacity={1} 
                fill="url(#colorSales)" 
                activeDot={{ r: 4, strokeWidth: 2, fill: '#ffffff', stroke: '#18181b' }}
              />
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-zinc-400">
            <div className="w-10 h-10 bg-zinc-50 rounded-full flex items-center justify-center mb-3">
              <LineChart className="w-5 h-5 text-zinc-300" />
            </div>
            <p className="text-[13px]">Aucune donnée de vente disponible</p>
          </div>
        )}
      </div>
    </Card>
  );
};
