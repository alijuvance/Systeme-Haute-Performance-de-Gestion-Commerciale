import React, { useState, useEffect } from 'react';
import { X, Undo2 } from 'lucide-react';
import { Sale } from '@/types';
import { formatCurrency, formatDate } from '@/utils/formatters';
import { getCreditNotesByInvoice, createCreditNote, CreditNote, CreditNoteLine } from '../api/creditNotesApi';
import { useToast } from '@/components/providers/ToastProvider';
import { Input } from '@/components/shared/Input';

interface CreditNoteModalProps {
  sale: Sale;
  onClose: () => void;
  onSuccess: () => void;
}

export const CreditNoteModal: React.FC<CreditNoteModalProps> = ({ sale, onClose, onSuccess }) => {
  const [creditNotes, setCreditNotes] = useState<CreditNote[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const toast = useToast();

  const [reason, setReason] = useState('');
  const [lines, setLines] = useState<{ productId: string; productName: string; quantityToReturn: number; maxQuantity: number; unitPrice: number }[]>([]);

  useEffect(() => {
    const fetchCreditNotes = async () => {
      try {
        const data = await getCreditNotesByInvoice(sale.id);
        setCreditNotes(data);
        
        // Initialize lines based on invoice lines
        // For a real app, we should subtract already returned quantities.
        const initialLines = sale.lines?.map((line: any) => ({
          productId: line.productId,
          productName: line.product?.name || line.productId,
          quantityToReturn: 0,
          maxQuantity: line.quantity,
          unitPrice: line.unitPrice
        })) || [];
        setLines(initialLines);

      } catch (error) {
        console.error(error);
        toast.error('Erreur lors du chargement des avoirs');
      } finally {
        setIsLoading(false);
      }
    };
    fetchCreditNotes();
  }, [sale.id]);

  const handleQuantityChange = (productId: string, qty: number) => {
    setLines(prev => prev.map(l => {
      if (l.productId === productId) {
        const validQty = Math.max(0, Math.min(l.maxQuantity, qty));
        return { ...l, quantityToReturn: validQty };
      }
      return l;
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const returnLines = lines.filter(l => l.quantityToReturn > 0).map(l => ({
      productId: l.productId,
      quantity: l.quantityToReturn,
      unitPrice: l.unitPrice
    }));

    if (returnLines.length === 0) {
      toast.error('Veuillez sélectionner au moins un article à retourner');
      return;
    }

    try {
      setIsSubmitting(true);
      await createCreditNote({
        invoiceId: sale.id,
        reason,
        lines: returnLines
      });
      toast.success('Avoir créé avec succès');
      onSuccess();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Erreur lors de la création');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full max-w-4xl shadow-xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Retours & Avoirs - Facture {sale.invoiceNumber}</h2>
            <p className="text-sm text-gray-500 mt-1">Total Facture: {formatCurrency(sale.totalAmount)}</p>
          </div>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 flex flex-col lg:flex-row gap-6">
          {/* Formulaire Nouvel Avoir */}
          <div className="flex-[2]">
            <h3 className="text-sm font-medium text-gray-900 mb-4 border-b pb-2">Créer un nouvel avoir</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              
              <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 mb-4">
                <table className="w-full text-sm text-left text-gray-500">
                  <thead className="text-xs text-gray-700 uppercase bg-gray-100">
                    <tr>
                      <th className="px-4 py-2 rounded-tl-lg rounded-bl-lg">Produit</th>
                      <th className="px-4 py-2">Prix Unitaire</th>
                      <th className="px-4 py-2">Qté Facturée</th>
                      <th className="px-4 py-2 rounded-tr-lg rounded-br-lg w-32">Qté à Retourner</th>
                    </tr>
                  </thead>
                  <tbody>
                    {lines.map((line) => (
                      <tr key={line.productId} className="bg-white border-b border-gray-50">
                        <td className="px-4 py-3 font-medium text-gray-900">{line.productName}</td>
                        <td className="px-4 py-3">{formatCurrency(line.unitPrice)}</td>
                        <td className="px-4 py-3">{line.maxQuantity}</td>
                        <td className="px-4 py-3">
                          <Input
                            type="number"
                            min="0"
                            max={line.maxQuantity}
                            value={line.quantityToReturn === 0 ? '' : line.quantityToReturn}
                            onChange={(e) => handleQuantityChange(line.productId, Number(e.target.value))}
                            className="w-full h-8 px-2 text-center"
                            placeholder="0"
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="mt-4 text-right">
                  <span className="text-sm text-gray-500 mr-2">Valeur de l'avoir estimée:</span>
                  <span className="text-lg font-bold text-gray-900">
                    {formatCurrency(lines.reduce((acc, l) => acc + (l.quantityToReturn * l.unitPrice), 0))}
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Motif du retour (Optionnel)</label>
                <Input
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Ex: Produit défectueux, Erreur de commande..."
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting || lines.reduce((acc, l) => acc + l.quantityToReturn, 0) === 0}
                className="w-full py-2.5 px-4 bg-orange-600 text-white font-medium rounded-xl hover:bg-orange-700 disabled:opacity-50 transition-colors"
              >
                {isSubmitting ? 'Génération...' : 'Générer l\'Avoir'}
              </button>
            </form>
          </div>

          {/* Historique */}
          <div className="flex-1 lg:border-l lg:pl-6">
            <h3 className="text-sm font-medium text-gray-900 mb-4 border-b pb-2">Avoirs existants</h3>
            {isLoading ? (
              <p className="text-sm text-gray-500">Chargement...</p>
            ) : creditNotes.length === 0 ? (
              <p className="text-sm text-gray-500 italic">Aucun avoir pour cette facture.</p>
            ) : (
              <div className="space-y-3">
                {creditNotes.map(cn => (
                  <div key={cn.id} className="p-3 bg-gray-50 rounded-lg border border-gray-100 text-sm">
                    <div className="flex justify-between items-start mb-1">
                      <span className="font-semibold text-gray-900">{cn.creditNoteNumber}</span>
                      <span className="font-bold text-orange-600">{formatCurrency(cn.totalAmount)}</span>
                    </div>
                    <div className="flex justify-between items-center mt-1">
                      <span className="text-xs text-gray-500">{formatDate(cn.createdAt)}</span>
                      <span className="px-2 py-0.5 bg-white border border-gray-200 text-gray-600 text-xs rounded-md">
                        {cn.status}
                      </span>
                    </div>
                    {cn.reason && <p className="text-xs text-gray-500 mt-2 italic">Motif: {cn.reason}</p>}
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
