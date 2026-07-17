import React, { useState, useEffect } from 'react';
import { X, DollarSign } from 'lucide-react';
import { Sale } from '@/types';
import { formatCurrency, formatDate } from '@/utils/formatters';
import { getPaymentsByInvoice, createPayment, Payment } from '../api/paymentsApi';
import { useToast } from '@/components/providers/ToastProvider';
import { Input } from '@/components/shared/Input';

interface PaymentModalProps {
  sale: Sale;
  onClose: () => void;
  onSuccess: () => void;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({ sale, onClose, onSuccess }) => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const toast = useToast();

  const remainingAmount = sale.totalAmount - sale.amountPaid;

  const [amount, setAmount] = useState<number | ''>(remainingAmount > 0 ? remainingAmount : '');
  const [method, setMethod] = useState('CASH');
  const [reference, setReference] = useState('');
  const [note, setNote] = useState('');

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const data = await getPaymentsByInvoice(sale.id);
        setPayments(data);
      } catch (error) {
        console.error(error);
        toast.error('Erreur lors du chargement des paiements');
      } finally {
        setIsLoading(false);
      }
    };
    fetchPayments();
  }, [sale.id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || Number(amount) <= 0) {
      toast.error('Le montant doit être supérieur à 0');
      return;
    }
    if (Number(amount) > remainingAmount + 0.01) {
      toast.error('Le montant ne peut pas dépasser le reste à payer');
      return;
    }

    try {
      setIsSubmitting(true);
      await createPayment({
        invoiceId: sale.id,
        amount: Number(amount),
        method,
        reference,
        note
      });
      toast.success('Paiement enregistré avec succès');
      onSuccess();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Erreur lors de l\'enregistrement');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full max-w-2xl shadow-xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Paiements - Facture {sale.invoiceNumber}</h2>
            <p className="text-sm text-gray-500 mt-1">Client: {sale.customer?.companyName || sale.customer?.fullName}</p>
          </div>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 flex flex-col md:flex-row gap-6">
          {/* Nouveau paiement */}
          <div className="flex-1">
            <h3 className="text-sm font-medium text-gray-900 mb-4 border-b pb-2">Enregistrer un paiement</h3>
            
            <div className="bg-indigo-50 rounded-xl p-4 mb-6">
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm text-indigo-900">Total Facture:</span>
                <span className="font-semibold text-indigo-900">{formatCurrency(sale.totalAmount)}</span>
              </div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm text-indigo-900">Déjà payé:</span>
                <span className="font-medium text-indigo-700">{formatCurrency(sale.amountPaid)}</span>
              </div>
              <div className="flex justify-between items-center mt-3 pt-3 border-t border-indigo-100">
                <span className="text-sm font-medium text-indigo-900">Reste à payer:</span>
                <span className="text-xl font-bold text-indigo-700">{formatCurrency(remainingAmount)}</span>
              </div>
            </div>

            {remainingAmount > 0 ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Montant à payer</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <DollarSign className="h-4 w-4 text-gray-400" />
                    </div>
                    <Input
                      type="number"
                      step="0.01"
                      required
                      value={amount}
                      onChange={(e) => setAmount(e.target.value ? Number(e.target.value) : '')}
                      className="pl-9"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Méthode de paiement</label>
                  <select
                    value={method}
                    onChange={(e) => setMethod(e.target.value)}
                    className="w-full px-4 py-2 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none"
                  >
                    <option value="CASH">Espèces</option>
                    <option value="BANK_TRANSFER">Virement Bancaire</option>
                    <option value="MOBILE_MONEY">Mobile Money</option>
                    <option value="CHECK">Chèque</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Référence (Optionnel)</label>
                  <Input
                    value={reference}
                    onChange={(e) => setReference(e.target.value)}
                    placeholder="Ex: Ref virement, Numéro chèque"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Note (Optionnel)</label>
                  <Input
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="Commentaire..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-2.5 px-4 bg-indigo-600 text-white font-medium rounded-xl hover:bg-indigo-700 disabled:opacity-50 transition-colors"
                >
                  {isSubmitting ? 'Enregistrement...' : 'Enregistrer'}
                </button>
              </form>
            ) : (
              <div className="text-center p-6 bg-green-50 rounded-xl border border-green-100">
                <p className="text-green-800 font-medium">Cette facture est entièrement payée.</p>
              </div>
            )}
          </div>

          {/* Historique */}
          <div className="flex-1 md:border-l md:pl-6">
            <h3 className="text-sm font-medium text-gray-900 mb-4 border-b pb-2">Historique des paiements</h3>
            {isLoading ? (
              <p className="text-sm text-gray-500">Chargement...</p>
            ) : payments.length === 0 ? (
              <p className="text-sm text-gray-500 italic">Aucun paiement enregistré pour cette facture.</p>
            ) : (
              <div className="space-y-3">
                {payments.map(p => (
                  <div key={p.id} className="p-3 bg-gray-50 rounded-lg border border-gray-100 text-sm">
                    <div className="flex justify-between items-start mb-1">
                      <span className="font-semibold text-gray-900">{formatCurrency(p.amount)}</span>
                      <span className="text-xs text-gray-500">{formatDate(p.createdAt)}</span>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="px-2 py-0.5 bg-white border border-gray-200 text-gray-600 text-xs rounded-md">
                        {p.method}
                      </span>
                      {p.reference && <span className="text-xs text-gray-500 truncate">Ref: {p.reference}</span>}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
