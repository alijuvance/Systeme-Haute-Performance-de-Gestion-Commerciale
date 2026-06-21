import React from 'react';
import { formatCurrency, formatDate } from '@/utils/formatters';

interface SalesTableProps {
  sales: any[];
  isLoading: boolean;
  error: string | null;
}

export const SalesTable: React.FC<SalesTableProps> = ({ sales, isLoading, error }) => {
  if (error) {
    return <div className="text-red-500 p-4">{error}</div>;
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead className="bg-gray-50 dark:bg-gray-900">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Facture N°</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Date</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Type</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Client</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Montant Total</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Payé</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Statut</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
          {isLoading ? <tr><td colSpan={7} className="p-4 text-center animate-pulse">Chargement...</td></tr> : 
           sales.map((s: any) => (
            <tr key={s.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
              <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900 dark:text-white">{s.invoiceNumber}</td>
              <td className="px-6 py-4 whitespace-nowrap text-gray-500 dark:text-gray-300">{formatDate(s.date)}</td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${s.type === 'POS' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'}`}>
                  {s.type}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-gray-900 dark:text-gray-200">{s.customer?.companyName || s.customer?.fullName}</td>
              <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900 dark:text-white">
                {formatCurrency(s.totalAmount)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-gray-500 dark:text-gray-300">
                {formatCurrency(s.amountPaid)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
                  ${s.status === 'PAID' ? 'bg-green-100 text-green-800' : 
                    s.status === 'PARTIAL' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}`}>
                  {s.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
