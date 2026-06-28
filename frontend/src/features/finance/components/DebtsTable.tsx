import React from 'react';
import { Debt } from '../types';

interface DebtsTableProps {
  debts: Debt[];
  loading: boolean;
  totalDebt: number;
}

export const DebtsTable: React.FC<DebtsTableProps> = ({ debts, loading, totalDebt }) => {
  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Facture N°</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Client</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total (MGA)</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Payé (MGA)</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-red-500 uppercase">Reste à Payer</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {loading ? (
            <tr>
              <td colSpan={6} className="p-4 text-center">Chargement...</td>
            </tr>
          ) : (
            debts.map((d) => (
              <tr key={d.id}>
                <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{d.invoiceNumber}</td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-500">{new Date(d.date).toLocaleDateString()}</td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-900 font-medium">
                  {d.customer?.companyName || d.customer?.fullName}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                  {new Intl.NumberFormat('fr-MG', { style: 'currency', currency: 'MGA' }).format(d.totalAmount)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-green-600">
                  {new Intl.NumberFormat('fr-MG', { style: 'currency', currency: 'MGA' }).format(d.amountPaid)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap font-bold text-red-600">
                  {new Intl.NumberFormat('fr-MG', { style: 'currency', currency: 'MGA' }).format(d.totalAmount - d.amountPaid)}
                </td>
              </tr>
            ))
          )}
        </tbody>
        <tfoot className="bg-gray-50">
          <tr>
            <td colSpan={5} className="px-6 py-4 text-right font-bold text-gray-900">Total des Créances :</td>
            <td className="px-6 py-4 font-bold text-red-600 text-lg">
              {new Intl.NumberFormat('fr-MG', { style: 'currency', currency: 'MGA' }).format(totalDebt)}
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
};
