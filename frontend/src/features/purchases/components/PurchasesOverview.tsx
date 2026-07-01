import React from 'react';
import { PurchaseKPIs } from '../hooks/usePurchaseAnalytics';
import { formatCurrency } from '@/utils/formatters';
import { ShoppingBag, Truck, CreditCard, ClipboardList } from 'lucide-react';

interface PurchasesOverviewProps {
  kpis: PurchaseKPIs | null;
}

export const PurchasesOverview: React.FC<PurchasesOverviewProps> = ({ kpis }) => {
  if (!kpis) return null;

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
              <ShoppingBag className="w-6 h-6" />
            </div>
            <span className="text-xs font-semibold px-2 py-1 bg-slate-100 text-slate-600 rounded-full">Ce mois</span>
          </div>
          <h3 className="text-slate-500 text-sm font-medium">Dépenses du mois</h3>
          <p className="text-2xl font-bold text-slate-900 mt-1">{formatCurrency(kpis.monthSpent)}</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-amber-50 text-amber-600 rounded-xl">
              <Truck className="w-6 h-6" />
            </div>
            <span className="text-xs font-semibold px-2 py-1 bg-amber-50 text-amber-700 rounded-full">Logistique</span>
          </div>
          <h3 className="text-slate-500 text-sm font-medium">À réceptionner</h3>
          <p className="text-2xl font-bold text-amber-600 mt-1">{kpis.pendingReceiptCount} commande(s)</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-red-50 text-red-600 rounded-xl">
              <CreditCard className="w-6 h-6" />
            </div>
            <span className="text-xs font-semibold px-2 py-1 bg-red-50 text-red-700 rounded-full">Finance</span>
          </div>
          <h3 className="text-slate-500 text-sm font-medium">Reste à payer</h3>
          <p className="text-2xl font-bold text-red-600 mt-1">{formatCurrency(kpis.totalUnpaidAmount)}</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-purple-50 text-purple-600 rounded-xl">
              <ClipboardList className="w-6 h-6" />
            </div>
            <span className="text-xs font-semibold px-2 py-1 bg-purple-50 text-purple-700 rounded-full">Global</span>
          </div>
          <h3 className="text-slate-500 text-sm font-medium">Commandes actives</h3>
          <p className="text-2xl font-bold text-slate-900 mt-1">{kpis.activeOrdersCount}</p>
        </div>

      </div>

      {/* Decorative / Info Banner */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
        <div className="relative z-10">
          <h2 className="text-xl font-bold mb-2">Cycle d'Approvisionnement</h2>
          <p className="text-slate-300 max-w-2xl text-sm leading-relaxed">
            Une gestion efficace des achats nécessite une coordination parfaite entre la logistique et la finance.
            N'oubliez pas d'enregistrer vos réceptions dans les dépôts et de marquer les commandes comme payées
            pour garder votre trésorerie à jour.
          </p>
        </div>
        <div className="absolute right-0 top-0 w-64 h-full bg-white opacity-5 transform skew-x-12 translate-x-20"></div>
      </div>
    </div>
  );
};
