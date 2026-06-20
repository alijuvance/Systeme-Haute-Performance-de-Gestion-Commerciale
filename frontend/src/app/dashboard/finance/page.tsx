'use client';
import { useState, useEffect } from 'react';
import { Download } from 'lucide-react';

export default function FinancePage() {
  const [debts, setDebts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDebts = async () => {
      const res = await fetch('/api/analytics/debts', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      if (res.ok) setDebts(await res.json());
      setLoading(false);
    };
    fetchDebts();
  }, []);

  const exportCSV = () => {
    if (debts.length === 0) return;
    
    // Prepare CSV data
    const headers = ['Facture', 'Date', 'Client', 'Total (MGA)', 'Payé (MGA)', 'Reste à Payer (MGA)'];
    const rows = debts.map((d: any) => [
      d.invoiceNumber,
      new Date(d.date).toLocaleDateString(),
      d.customer?.companyName || d.customer?.fullName || 'Inconnu',
      d.totalAmount,
      d.amountPaid,
      d.totalAmount - d.amountPaid
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(r => r.join(','))
    ].join('\n');

    // Trigger download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `creances_clients_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const totalDebt = debts.reduce((acc: number, d: any) => acc + (d.totalAmount - d.amountPaid), 0);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Suivi des Créances Clients</h1>
          <p className="text-gray-500 text-sm mt-1">Factures B2B en attente de paiement complet</p>
        </div>
        <button onClick={exportCSV} className="flex items-center gap-2 bg-slate-800 text-white px-4 py-2 rounded-lg shadow hover:bg-slate-700 transition">
          <Download className="w-4 h-4" /> Export CSV
        </button>
      </div>

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
            {loading ? <tr><td colSpan={6} className="p-4 text-center">Chargement...</td></tr> : 
             debts.map((d: any) => (
              <tr key={d.id}>
                <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{d.invoiceNumber}</td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-500">{new Date(d.date).toLocaleDateString()}</td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-900 font-medium">{d.customer?.companyName || d.customer?.fullName}</td>
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
            ))}
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
    </div>
  );
}
