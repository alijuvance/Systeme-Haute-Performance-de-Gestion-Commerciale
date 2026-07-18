'use client';
import React, { useState, useEffect } from 'react';
import { usePurchases } from '../hooks/usePurchases';
import { DataTable, ColumnDef } from '@/components/shared/DataTable';
import { Purchase, Depot } from '@/types';
import { Modal } from '@/components/shared/Modal';
import { Input } from '@/components/shared/Input';
import { Select } from '@/components/shared/Select';
import { Button } from '@/components/shared/Button';
import { Badge } from '@/components/shared/Badge';
import { formatCurrency, formatDate } from '@/utils/formatters';
import { CheckCircle, Truck, DollarSign, PackageCheck, AlertCircle } from 'lucide-react';
import { getDepots } from '@/features/stocks/api/getStocks';

export function PurchasesTable() {
  const { data, isLoading, error, recordPayment, receiveOrder } = usePurchases();
  const [depots, setDepots] = useState<Depot[]>([]);

  // Action Modals State
  const [payModalOpen, setPayModalOpen] = useState(false);
  const [receiveModalOpen, setReceiveModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Purchase | null>(null);
  
  // Form State
  const [amountInput, setAmountInput] = useState<number | string>('');
  const [depotIdInput, setDepotIdInput] = useState<string>('');
  const [receiptLines, setReceiptLines] = useState<{ productId: string; productName: string; qtyOrdered: number; qtyAlreadyReceived: number; qtyToReceive: number }[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    getDepots().then(setDepots).catch(console.error);
  }, []);

  const openPayModal = (order: Purchase) => {
    setSelectedOrder(order);
    setAmountInput(order.totalAmount - (order.amountPaid || 0));
    setPayModalOpen(true);
  };

  const openReceiveModal = (order: Purchase) => {
    setSelectedOrder(order);
    setDepotIdInput(depots.length > 0 ? depots[0].id : '');
    
    // Initialize lines
    const lines = order.lines?.map(l => ({
      productId: l.productId,
      productName: l.product?.name || 'Produit',
      qtyOrdered: l.quantity,
      qtyAlreadyReceived: l.quantityReceived || 0,
      qtyToReceive: Math.max(0, l.quantity - (l.quantityReceived || 0))
    })) || [];
    setReceiptLines(lines);

    setReceiveModalOpen(true);
  };

  const handlePay = async () => {
    if (!selectedOrder || !amountInput) return;
    setIsSubmitting(true);
    const success = await recordPayment(selectedOrder.id, Number(amountInput));
    setIsSubmitting(false);
    if (success) setPayModalOpen(false);
  };

  const handleReceive = async () => {
    if (!selectedOrder || !depotIdInput) return;
    setIsSubmitting(true);
    
    const linesPayload = receiptLines.map(l => ({
      productId: l.productId,
      quantityReceived: l.qtyToReceive
    }));

    const payload = {
      receivingDepotId: depotIdInput,
      lines: linesPayload
    };

    const success = await receiveOrder(selectedOrder.id, payload as any);
    setIsSubmitting(false);
    if (success) setReceiveModalOpen(false);
  };

  const handleQtyChange = (productId: string, value: number) => {
    setReceiptLines(prev => prev.map(l => {
      if (l.productId === productId) {
        return { ...l, qtyToReceive: Math.max(0, value) };
      }
      return l;
    }));
  };

  const columns: ColumnDef<Purchase>[] = [
    { key: 'ref', header: 'Référence', cell: (p) => <span className="font-medium text-gray-900">{p.orderNumber || p.id.slice(0, 8)}</span> },
    { key: 'date', header: 'Date', cell: (p) => <span className="text-gray-500">{formatDate(p.createdAt)}</span> },
    { key: 'supplier', header: 'Fournisseur', cell: (p) => <span className="text-gray-900">{p.supplier?.name || '—'}</span> },
    { key: 'total', header: 'Montant (MGA)', align: 'right', cell: (p) => <span className="tabular-nums font-medium text-gray-900">{formatCurrency(p.totalAmount)}</span> },
    { 
      key: 'financial_status', header: 'Paiement',
      cell: (p) => {
        const remaining = p.totalAmount - (p.amountPaid || 0);
        if (remaining <= 0) return <Badge variant="success" icon={<CheckCircle className="w-3 h-3"/>}>Payé</Badge>;
        if (p.amountPaid > 0) return <Badge variant="warning" icon={<DollarSign className="w-3 h-3"/>}>Partiel</Badge>;
        return <Badge variant="danger" icon={<AlertCircle className="w-3 h-3"/>}>Impayé</Badge>;
      }
    },
    {
      key: 'logistics_status', header: 'Logistique',
      cell: (p) => {
        const variant = p.status === 'RECEIVED' ? 'success' : p.status === 'PARTIAL_RECEIPT' ? 'warning' : p.status === 'SENT' ? 'info' : 'default';
        const icon = p.status === 'RECEIVED' ? <PackageCheck className="w-3 h-3"/> : p.status === 'SENT' ? <Truck className="w-3 h-3"/> : undefined;
        const text = p.status === 'RECEIVED' ? 'Reçu' : p.status === 'PARTIAL_RECEIPT' ? 'Reçu partiel' : p.status === 'SENT' ? 'En transit' : p.status === 'DRAFT' ? 'Brouillon' : p.status;
        return <Badge variant={variant} icon={icon}>{text}</Badge>;
      }
    },
    {
      key: 'actions', header: '', align: 'right',
      cell: (p) => (
        <div className="flex gap-2 justify-end opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          {p.totalAmount - (p.amountPaid || 0) > 0 && p.status !== 'CANCELLED' && (
            <button 
              onClick={() => openPayModal(p)}
              className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-lg transition"
            >
              Payer
            </button>
          )}
          {p.status !== 'RECEIVED' && p.status !== 'CANCELLED' && (
            <button 
              onClick={() => openReceiveModal(p)}
              className="px-2 py-1 text-xs font-medium bg-gray-900 text-white hover:bg-gray-800 rounded-lg transition"
            >
              Réceptionner
            </button>
          )}
        </div>
      )
    }
  ];

  if (error) return <div className="p-4 bg-red-50 text-red-600 rounded-xl mb-4 text-sm">{error}</div>;

  return (
    <>
      <DataTable data={data} columns={columns} keyExtractor={(p) => p.id} isLoading={isLoading} emptyMessage="Aucune commande d'achat pour le moment." />

      {/* Payment Modal */}
      <Modal isOpen={payModalOpen} onClose={() => setPayModalOpen(false)} title="Enregistrer un paiement">
        {selectedOrder && (
          <div className="space-y-5">
            <p className="text-gray-500 text-sm">Commande {selectedOrder.orderNumber} ({selectedOrder.supplier?.name})</p>
            
            <Input 
              label="Montant à payer (MGA)"
              type="number" 
              value={amountInput} 
              onChange={(e) => setAmountInput(e.target.value)}
              max={selectedOrder.totalAmount - (selectedOrder.amountPaid || 0)}
              icon={<DollarSign className="w-4 h-4" />}
            />
            <p className="text-xs text-gray-500">Reste à payer : {formatCurrency(selectedOrder.totalAmount - (selectedOrder.amountPaid || 0))}</p>

            <div className="flex justify-end gap-3 pt-5 mt-6 border-t border-gray-100">
              <Button variant="outline" onClick={() => setPayModalOpen(false)} disabled={isSubmitting}>Annuler</Button>
              <Button onClick={handlePay} isLoading={isSubmitting} disabled={!amountInput || Number(amountInput) <= 0}>Confirmer le paiement</Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Receive Modal */}
      <Modal isOpen={receiveModalOpen} onClose={() => setReceiveModalOpen(false)} title="Réception de Marchandises">
        {selectedOrder && (
          <div className="space-y-5">
            <p className="text-gray-500 text-sm">Commande {selectedOrder.orderNumber}</p>
            
            <Select
              label="Dépôt de réception"
              value={depotIdInput}
              onChange={(e) => setDepotIdInput(e.target.value)}
              options={[
                { value: '', label: 'Sélectionnez un dépôt', disabled: true },
                ...depots.map(d => ({ value: d.id, label: d.name }))
              ]}
            />

            <div className="bg-gray-50 rounded-lg p-4 max-h-[40vh] overflow-y-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-gray-500 uppercase border-b pb-2">
                  <tr>
                    <th className="pb-2">Produit</th>
                    <th className="pb-2 text-center">Commandé</th>
                    <th className="pb-2 text-center">Déjà reçu</th>
                    <th className="pb-2 text-right">À recevoir</th>
                  </tr>
                </thead>
                <tbody>
                  {receiptLines.map(line => (
                    <tr key={line.productId} className="border-b border-gray-100 last:border-0">
                      <td className="py-3 text-gray-900 font-medium">{line.productName}</td>
                      <td className="py-3 text-center text-gray-500">{line.qtyOrdered}</td>
                      <td className="py-3 text-center text-gray-500">{line.qtyAlreadyReceived}</td>
                      <td className="py-3 flex justify-end">
                        <Input 
                          type="number"
                          min="0"
                          max={line.qtyOrdered - line.qtyAlreadyReceived}
                          value={line.qtyToReceive}
                          onChange={(e) => handleQtyChange(line.productId, Number(e.target.value))}
                          className="w-24 text-center h-8"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex justify-end gap-3 pt-5 mt-6 border-t border-gray-100">
              <Button variant="outline" onClick={() => setReceiveModalOpen(false)} disabled={isSubmitting}>Annuler</Button>
              <Button onClick={handleReceive} isLoading={isSubmitting} disabled={!depotIdInput || receiptLines.reduce((acc, l) => acc + l.qtyToReceive, 0) === 0}>Enregistrer la réception</Button>
            </div>
          </div>
        )}
      </Modal>
    </>
  );
}
