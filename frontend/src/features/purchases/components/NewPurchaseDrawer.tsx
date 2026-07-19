'use client';
import React, { useState, useEffect, useCallback, useRef } from 'react';
import Drawer from '@/components/shared/Drawer';
import SearchSelect from '@/components/shared/SearchSelect';
import { Input } from '@/components/shared/Input';
import { Button } from '@/components/shared/Button';
import api from '@/api/axios';
import { useToast } from '@/components/providers/ToastProvider';
import { formatCurrency } from '@/utils/formatters';
import { Plus, Trash2, ShoppingBag, CheckCircle } from 'lucide-react';

interface NewPurchaseDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

interface OrderLine {
  productId: string;
  quantity: number;
  unitPrice: number;
}

export function NewPurchaseDrawer({ isOpen, onClose, onSuccess }: NewPurchaseDrawerProps) {
  const [suppliers, setSuppliers] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [supplierId, setSupplierId] = useState('');
  const [lines, setLines] = useState<OrderLine[]>([{ productId: '', quantity: 1, unitPrice: 0 }]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const formTouched = useRef(false);
  const toast = useToast();

  // Load reference data when drawer opens
  useEffect(() => {
    if (!isOpen) return;
    const fetchData = async () => {
      try {
        const [suppRes, prodRes] = await Promise.all([
          api.get('/api/suppliers'),
          api.get('/api/products'),
        ]);
        setSuppliers(suppRes.data?.data || suppRes.data || []);
        setProducts(prodRes.data?.data || prodRes.data || []);
      } catch (e) {
        console.error('Erreur chargement refs:', e);
      }
    };
    fetchData();
  }, [isOpen]);

  // Reset form when drawer closes
  useEffect(() => {
    if (!isOpen) {
      // Delay reset so animation completes first
      const t = setTimeout(() => {
        setSupplierId('');
        setLines([{ productId: '', quantity: 1, unitPrice: 0 }]);
        setIsSubmitting(false);
        setShowSuccess(false);
        formTouched.current = false;
      }, 350);
      return () => clearTimeout(t);
    }
  }, [isOpen]);

  const isDirty = supplierId !== '' || lines.some(l => l.productId !== '' || l.unitPrice > 0);

  const handleClose = useCallback(async () => {
    if (isDirty && !showSuccess) {
      const shouldClose = await toast.confirm({
        title: 'Données non enregistrées',
        message: 'Des données non enregistrées seront perdues. Voulez-vous vraiment fermer ?',
        variant: 'warning',
        confirmText: 'Fermer quand même',
      });
      if (!shouldClose) {
        return;
      }
    }
    onClose();
  }, [isDirty, showSuccess, onClose]);

  const addLine = () => {
    formTouched.current = true;
    setLines([...lines, { productId: '', quantity: 1, unitPrice: 0 }]);
  };

  const removeLine = (idx: number) => {
    formTouched.current = true;
    setLines(lines.filter((_, i) => i !== idx));
  };

  const updateLine = (idx: number, field: keyof OrderLine, value: any) => {
    formTouched.current = true;
    const newLines = [...lines];
    newLines[idx] = { ...newLines[idx], [field]: value };

    // Auto-fill unit price from product cost price
    if (field === 'productId') {
      const product = products.find((p: any) => p.id === value);
      if (product && newLines[idx].unitPrice === 0) {
        newLines[idx].unitPrice = product.costPrice || 0;
      }
    }

    setLines(newLines);
  };

  const totalAmount = lines.reduce((acc, line) => acc + (line.quantity * line.unitPrice), 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supplierId || lines.some(l => !l.productId || l.quantity <= 0)) {
      toast.warning('Veuillez remplir correctement la commande.');
      return;
    }

    try {
      setIsSubmitting(true);
      await api.post('/api/purchase-orders', { supplierId, lines });
      setShowSuccess(true);
      toast.success("Commande d'achat créée avec succès");
      // Wait a moment to show success, then close
      setTimeout(() => {
        onSuccess();
        onClose();
      }, 1200);
    } catch (err: any) {
      toast.error(err.response?.data?.message || err.message || 'Une erreur est survenue');
      setIsSubmitting(false);
    }
  };

  // Supplier options for SearchSelect
  const supplierOptions = suppliers.map((s: any) => ({
    id: s.id,
    label: s.name,
  }));

  // Product options for SearchSelect
  const productOptions = products.map((p: any) => ({
    id: p.id,
    label: `${p.name} — ${p.sku || ''}`,
  }));

  const footerContent = (
    <div className="flex items-center justify-between">
      <div className="text-lg font-bold text-slate-900">
        Total : {formatCurrency(totalAmount)}
      </div>
      <div className="flex gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={handleClose}
          disabled={isSubmitting}
        >
          Annuler
        </Button>
        <Button
          type="submit"
          form="new-purchase-form"
          disabled={isSubmitting || showSuccess}
          isLoading={isSubmitting}
        >
          {showSuccess ? (
            <span className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              Commande créée !
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <ShoppingBag className="w-4 h-4" />
              Valider la commande
            </span>
          )}
        </Button>
      </div>
    </div>
  );

  return (
    <Drawer
      isOpen={isOpen}
      onClose={handleClose}
      title="Nouveau Bon de Commande"
      description="Créez une commande d'achat fournisseur. Le stock sera mis à jour lors de la réception."
      width="2xl"
      footer={footerContent}
    >
      {showSuccess ? (
        <div className="flex flex-col items-center justify-center h-64 text-emerald-600 animate-pulse">
          <CheckCircle className="w-16 h-16 mb-4" />
          <p className="text-xl font-bold">Commande enregistrée avec succès</p>
        </div>
      ) : (
        <form id="new-purchase-form" onSubmit={handleSubmit} className="space-y-6">
          {/* Fournisseur */}
          <div>
            <SearchSelect
              label="Fournisseur"
              options={supplierOptions}
              value={supplierId}
              onChange={(v) => { formTouched.current = true; setSupplierId(v); }}
              placeholder="Rechercher un fournisseur..."
              required
            />
          </div>

          {/* Lignes de commande */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="text-sm font-semibold text-slate-700">Articles</label>
              <button
                type="button"
                onClick={addLine}
                className="flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-700 transition"
              >
                <Plus className="w-4 h-4" />
                Ajouter un article
              </button>
            </div>

            <div className="space-y-3">
              {lines.map((line, idx) => (
                <div
                  key={idx}
                  className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3 relative group"
                >
                  {/* Remove button */}
                  {lines.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeLine(idx)}
                      className="absolute top-3 right-3 p-1 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition opacity-0 group-hover:opacity-100"
                      title="Supprimer cette ligne"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}

                  {/* Product */}
                  <div>
                    <SearchSelect
                      label="Produit"
                      options={productOptions}
                      value={line.productId}
                      onChange={(v) => updateLine(idx, 'productId', v)}
                      placeholder="Rechercher un produit..."
                      required
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    {/* Quantity */}
                    <div>
                      <Input
                        type="number"
                        min="1"
                        label="Quantité *"
                        value={line.quantity}
                        onChange={(e) => updateLine(idx, 'quantity', Number(e.target.value))}
                      />
                    </div>

                    {/* Unit price */}
                    <div>
                      <Input
                        type="number"
                        min="0"
                        label="Prix unitaire (MGA)"
                        value={line.unitPrice}
                        onChange={(e) => updateLine(idx, 'unitPrice', Number(e.target.value))}
                      />
                    </div>

                    {/* Line total */}
                    <div>
                      <label className="block text-xs font-medium text-slate-500 mb-1">Sous-total</label>
                      <div className="px-3 py-2 bg-slate-100 border border-slate-200 rounded-lg text-sm font-semibold text-slate-800">
                        {formatCurrency(line.quantity * line.unitPrice)}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </form>
      )}
    </Drawer>
  );
}
