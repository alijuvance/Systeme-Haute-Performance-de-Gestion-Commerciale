import React from 'react';
import { Sale } from '@/types';
import { formatCurrency, formatDate } from '@/utils/formatters';
import { Card } from '@/components/shared/Card';
import { Badge } from '@/components/shared/Badge';

interface SalesKanbanProps {
  sales: Sale[];
  isLoading: boolean;
  onSaleClick: (sale: Sale) => void;
}

export const SalesKanban: React.FC<SalesKanbanProps> = ({ sales, isLoading, onSaleClick }) => {
  if (isLoading) {
    return (
      <div className="flex gap-4 overflow-x-auto pb-4">
        {[1, 2, 3].map(col => (
          <div key={col} className="min-w-[320px] bg-gray-50 rounded-xl p-4 animate-pulse">
            <div className="h-6 bg-gray-200 rounded w-1/3 mb-4" />
            <div className="space-y-3">
              {[1, 2].map(card => (
                <div key={card} className="h-32 bg-white rounded-lg shadow-sm" />
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }

  const columns = [
    { id: 'DRAFT', label: 'Brouillon', color: 'border-gray-200' },
    { id: 'PARTIAL', label: 'Paiement Partiel', color: 'border-amber-200' },
    { id: 'PAID', label: 'Payé', color: 'border-emerald-200' },
    { id: 'CANCELLED', label: 'Annulé', color: 'border-red-200' },
  ];

  const getSalesByStatus = (status: string) => sales.filter(s => s.status === status);

  return (
    <div className="flex gap-6 overflow-x-auto pb-6">
      {columns.map(col => {
        const colSales = getSalesByStatus(col.id);
        
        return (
          <div key={col.id} className="min-w-[320px] max-w-[320px] flex flex-col bg-gray-50/80 rounded-2xl p-4 border border-gray-100">
            <div className="flex items-center justify-between mb-4 px-1">
              <h3 className="font-semibold text-gray-700 flex items-center gap-2">
                {col.label}
                <span className="bg-gray-200 text-gray-600 text-xs py-0.5 px-2 rounded-full">
                  {colSales.length}
                </span>
              </h3>
            </div>
            
            <div className="flex flex-col gap-3 flex-1 overflow-y-auto">
              {colSales.map(sale => (
                <div 
                  key={sale.id}
                  onClick={() => onSaleClick(sale)}
                  className={`bg-white rounded-xl p-4 shadow-sm border-l-4 ${col.color} cursor-pointer hover:shadow-md transition-all duration-200 group`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-medium text-gray-900 group-hover:text-indigo-600 transition-colors">
                      {sale.invoiceNumber || sale.reference}
                    </span>
                    <Badge variant={sale.type === 'POS' ? 'info' : 'default'}>{sale.type}</Badge>
                  </div>
                  <p className="text-sm text-gray-600 mb-3 line-clamp-1">
                    {sale.customer?.companyName || sale.customer?.fullName || 'Client divers'}
                  </p>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-400">{formatDate(sale.date || sale.createdAt)}</span>
                    <span className="font-semibold text-gray-900 tabular-nums">
                      {formatCurrency(sale.totalAmount)}
                    </span>
                  </div>
                </div>
              ))}
              
              {colSales.length === 0 && (
                <div className="text-center p-6 border-2 border-dashed border-gray-200 rounded-xl text-gray-400 text-sm">
                  Aucune facture
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
