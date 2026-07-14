import React from 'react';
import { FinanceKPIs, CashflowData } from '../hooks/useFinance';
import { formatCurrency } from '@/utils/formatters';
import { TrendingUp, TrendingDown, DollarSign, Wallet, ArrowRightLeft } from 'lucide-react';
import { Card } from '@/components/shared/Card';

interface FinanceOverviewProps {
  kpis: FinanceKPIs | null;
  cashflow: CashflowData[];
}

export const FinanceOverview: React.FC<FinanceOverviewProps> = ({ kpis, cashflow }) => {
  if (!kpis) return null;

  const maxAmount = Math.max(
    ...cashflow.map(d => Math.max(d.inflows, d.outflows)), 1000
  );

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <Card padding="md">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-gray-100 text-gray-900 rounded-xl">
              <Wallet className="w-5 h-5" />
            </div>
            <span className="text-xs font-medium px-2 py-1 bg-gray-100 text-gray-600 rounded-full">Actuel</span>
          </div>
          <h3 className="text-gray-500 text-sm font-medium">Trésorerie Nette</h3>
          <p className="text-2xl font-semibold text-gray-900 mt-1 tabular-nums tracking-tight">{formatCurrency(kpis.netCash)}</p>
        </Card>

        <Card padding="md">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
              <TrendingUp className="w-5 h-5" />
            </div>
            <span className="text-xs font-medium px-2 py-1 bg-emerald-50 text-emerald-700 rounded-full">À recevoir</span>
          </div>
          <h3 className="text-gray-500 text-sm font-medium">Créances Clients</h3>
          <p className="text-2xl font-semibold text-emerald-600 mt-1 tabular-nums tracking-tight">+{formatCurrency(kpis.totalReceivables)}</p>
        </Card>

        <Card padding="md">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-red-50 text-red-600 rounded-xl">
              <TrendingDown className="w-5 h-5" />
            </div>
            <span className="text-xs font-medium px-2 py-1 bg-red-50 text-red-700 rounded-full">À payer</span>
          </div>
          <h3 className="text-gray-500 text-sm font-medium">Dettes Fournisseurs</h3>
          <p className="text-2xl font-semibold text-red-600 mt-1 tabular-nums tracking-tight">-{formatCurrency(kpis.totalPayables)}</p>
        </Card>

        <Card padding="md">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
              <DollarSign className="w-5 h-5" />
            </div>
            <span className="text-xs font-medium px-2 py-1 bg-blue-50 text-blue-700 rounded-full">Global</span>
          </div>
          <h3 className="text-gray-500 text-sm font-medium">Marge Commerciale</h3>
          <p className="text-2xl font-semibold text-gray-900 mt-1 tabular-nums tracking-tight">{formatCurrency(kpis.commercialMargin)}</p>
        </Card>

      </div>

      <Card padding="lg">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-base font-semibold text-gray-900 flex items-center gap-2">
            <ArrowRightLeft className="w-4 h-4 text-gray-400" />
            Flux de Trésorerie
          </h2>
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-gray-900"></span>
              <span className="text-gray-600 text-xs font-medium">Entrées</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-gray-200"></span>
              <span className="text-gray-600 text-xs font-medium">Sorties</span>
            </div>
          </div>
        </div>

        {cashflow.length === 0 ? (
          <div className="h-64 flex items-center justify-center text-gray-400">
            Aucune donnée de trésorerie disponible.
          </div>
        ) : (
          <div className="flex items-end h-64 gap-2 overflow-x-auto pb-4 pt-8 border-b border-gray-100">
            {cashflow.map((item, index) => {
              const inHeight = Math.max((item.inflows / maxAmount) * 100, 2);
              const outHeight = Math.max((item.outflows / maxAmount) * 100, 2);
              
              return (
                <div key={index} className="flex flex-col items-center flex-1 min-w-[40px] group">
                  <div className="w-full flex justify-center items-end gap-1 h-full relative">
                    
                    {/* Tooltip on hover */}
                    <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs py-1.5 px-3 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10 shadow-lg">
                      <p className="font-medium mb-1">{item.date}</p>
                      <p className="text-emerald-400">In: {formatCurrency(item.inflows)}</p>
                      <p className="text-red-400">Out: {formatCurrency(item.outflows)}</p>
                    </div>

                    <div 
                      className="w-1/3 bg-gray-900 rounded-t-sm transition-all duration-300 group-hover:opacity-90"
                      style={{ height: `${inHeight}%` }}
                    />
                    <div 
                      className="w-1/3 bg-gray-200 rounded-t-sm transition-all duration-300 group-hover:opacity-90"
                      style={{ height: `${outHeight}%` }}
                    />
                  </div>
                  <span className="text-[10px] text-gray-400 mt-2 rotate-45 origin-left whitespace-nowrap">
                    {item.date.slice(5)}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </Card>
    </div>
  );
};
