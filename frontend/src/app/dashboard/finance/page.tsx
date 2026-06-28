'use client';
import { Download } from 'lucide-react';
import { useDebts } from '@/features/finance/hooks/useDebts';
import { DebtsTable } from '@/features/finance/components/DebtsTable';
import { Debt } from '@/features/finance/types';

export default function FinancePage() {
  const { debts, loading, error, totalDebt } = useDebts();

  const exportCSV = () => {
    if (debts.length === 0) return;
    
    // Prepare CSV data
    const headers = ['Facture', 'Date', 'Client', 'Total (MGA)', 'Payé (MGA)', 'Reste à Payer (MGA)'];
    const rows = debts.map((d: Debt) => [
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

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Suivi des Créances Clients</h1>
          <p className="text-gray-500 text-sm mt-1">Factures B2B en attente de paiement complet</p>
        </div>
        <button 
          onClick={exportCSV} 
          className="flex items-center gap-2 bg-slate-800 text-white px-4 py-2 rounded-lg shadow hover:bg-slate-700 transition"
        >
          <Download className="w-4 h-4" /> Export CSV
        </button>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6">
          {error}
        </div>
      )}

      <DebtsTable debts={debts} loading={loading} totalDebt={totalDebt} />
    </div>
  );
}
