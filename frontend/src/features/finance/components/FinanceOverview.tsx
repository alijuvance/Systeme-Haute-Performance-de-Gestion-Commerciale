import React from 'react';
import { FinanceKPIs, CashflowData } from '../hooks/useFinance';
import { formatCurrency } from '@/utils/formatters';
import { TrendingUp, TrendingDown, DollarSign, Wallet, ArrowRightLeft } from 'lucide-react';

interface FinanceOverviewProps {
  kpis: FinanceKPIs | null;
  cashflow: CashflowData[];
}

export const FinanceOverview: React.FC<FinanceOverviewProps> = ({ kpis, cashflow }) => {
  if (!kpis) return null;

  // Trouver le max pour l'échelle du graphique (CSS natif)
  const maxAmount = Math.max(
    ...cashflow.map(d => Math.max(d.inflows, d.outflows)), 1000
  );

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
              <Wallet className="w-6 h-6" />
            </div>
            <span className="text-xs font-semibold px-2 py-1 bg-slate-100 text-slate-600 rounded-full">Actuel</span>
          </div>
          <h3 className="text-slate-500 text-sm font-medium">Trésorerie Nette</h3>
          <p className="text-2xl font-bold text-slate-900 mt-1">{formatCurrency(kpis.netCash)}</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
              <TrendingUp className="w-6 h-6" />
            </div>
            <span className="text-xs font-semibold px-2 py-1 bg-emerald-50 text-emerald-700 rounded-full">À recevoir</span>
          </div>
          <h3 className="text-slate-500 text-sm font-medium">Créances Clients</h3>
          <p className="text-2xl font-bold text-emerald-600 mt-1">+{formatCurrency(kpis.totalReceivables)}</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-red-50 text-red-600 rounded-xl">
              <TrendingDown className="w-6 h-6" />
            </div>
            <span className="text-xs font-semibold px-2 py-1 bg-red-50 text-red-700 rounded-full">À payer</span>
          </div>
          <h3 className="text-slate-500 text-sm font-medium">Dettes Fournisseurs</h3>
          <p className="text-2xl font-bold text-red-600 mt-1">-{formatCurrency(kpis.totalPayables)}</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-purple-50 text-purple-600 rounded-xl">
              <DollarSign className="w-6 h-6" />
            </div>
            <span className="text-xs font-semibold px-2 py-1 bg-purple-50 text-purple-700 rounded-full">Global</span>
          </div>
          <h3 className="text-slate-500 text-sm font-medium">Marge Commerciale</h3>
          <p className="text-2xl font-bold text-slate-900 mt-1">{formatCurrency(kpis.commercialMargin)}</p>
        </div>

      </div>

      {/* Cashflow Chart (Native CSS) */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <ArrowRightLeft className="w-5 h-5 text-slate-400" />
            Flux de Trésorerie
          </h2>
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-emerald-400"></span>
              <span className="text-slate-600">Entrées</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-red-400"></span>
              <span className="text-slate-600">Sorties</span>
            </div>
          </div>
        </div>

        {cashflow.length === 0 ? (
          <div className="h-64 flex items-center justify-center text-slate-400">
            Aucune donnée de trésorerie disponible.
          </div>
        ) : (
          <div className="flex items-end h-64 gap-2 overflow-x-auto pb-4 pt-8 border-b border-slate-100">
            {cashflow.map((item, index) => {
              const inHeight = Math.max((item.inflows / maxAmount) * 100, 2);
              const outHeight = Math.max((item.outflows / maxAmount) * 100, 2);
              
              return (
                <div key={index} className="flex flex-col items-center flex-1 min-w-[40px] group">
                  {/* Tooltip on hover */}
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute -mt-16 bg-slate-800 text-white text-xs p-2 rounded-lg pointer-events-none whitespace-nowrap z-10 shadow-lg">
                    <p className="font-semibold mb-1">{new Date(item.date).toLocaleDateString()}</p>
                    <p className="text-emerald-300">In: {formatCurrency(item.inflows)}</p>
                    <p className="text-red-300">Out: {formatCurrency(item.outflows)}</p>
                  </div>
                  
                  {/* Bars */}
                  <div className="flex gap-1 w-full justify-center h-full items-end">
                    <div 
                      className="w-1/3 bg-emerald-400 rounded-t-sm hover:bg-emerald-500 transition-colors" 
                      style={{ height: `${inHeight}%` }}
                    ></div>
                    <div 
                      className="w-1/3 bg-red-400 rounded-t-sm hover:bg-red-500 transition-colors" 
                      style={{ height: `${outHeight}%` }}
                    ></div>
                  </div>
                  {/* Label */}
                  <span className="text-[10px] text-slate-400 mt-2 rotate-45 origin-left">
                    {item.date.substring(5)}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
