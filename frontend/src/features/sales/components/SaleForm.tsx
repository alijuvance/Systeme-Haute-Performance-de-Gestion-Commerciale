'use client';

import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useSaleForm } from '../hooks/useSaleForm';
import { formatCurrency } from '@/utils/formatters';
import { Button } from '@/components/shared/Button';
import SearchSelect from '@/components/shared/SearchSelect';
import InvoiceDrawer from './InvoiceDrawer';
import {
  Search, Package2, Tag, Plus, Minus,
  AlertCircle, Loader2, ChevronRight, ShoppingCart,
} from 'lucide-react';

export const SaleForm: React.FC = () => {
  const router = useRouter();
  const {
    form, fields, onSubmit,
    customers, products, depots, categories, isLoadingRef,
    addProductToInvoice, incrementLine, decrementLine,
    setLineQuantity, removeLine,
    totalAmount, submitError,
  } = useSaleForm();

  const { register, formState: { errors, isSubmitting } } = form;

  // --- Product search state ---
  const [productSearch, setProductSearch] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);

  // --- Drawer state ---
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // --- Watched lines for drawer ---
  const watchedLines = form.watch('lines');

  // --- Filtered products ---
  const filteredProducts = useMemo(() => {
    return products.filter((p: any) => {
      const matchesSearch = !productSearch ||
        p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
        p.sku.toLowerCase().includes(productSearch.toLowerCase());
      const matchesCategory = !selectedCategoryId || p.categoryId === selectedCategoryId;
      return matchesSearch && matchesCategory;
    });
  }, [products, productSearch, selectedCategoryId]);

  // --- Helper: get quantity of a product in the current invoice ---
  const getProductQty = (productId: string): number => {
    const line = watchedLines.find(l => l.productId === productId);
    return line?.quantity || 0;
  };

  // --- Customer options for SearchSelect ---
  const customerOptions = customers.map((c: any) => ({
    id: c.id,
    label: c.companyName || c.fullName,
    sublabel: c.email || c.phone || '',
  }));

  // --- Depot options for SearchSelect ---
  const depotOptions = depots.map((d: any) => ({
    id: d.id,
    label: d.name,
    sublabel: d.location || '',
  }));

  // --- Total items count ---
  const totalItems = watchedLines.reduce((acc, l) => acc + (l.quantity || 0), 0);

  if (isLoadingRef) {
    return (
      <div className="flex items-center justify-center p-12 text-slate-500">
        <Loader2 className="w-5 h-5 animate-spin mr-3" />
        Chargement des données...
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      {submitError && (
        <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
          <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
          <div>
            <p className="font-semibold">Erreur lors de la création</p>
            <p className="mt-1">{submitError}</p>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════ */}
      {/* SECTION 1: Client & Dépôt — Autocomplete Search   */}
      {/* ═══════════════════════════════════════════════════ */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        <SearchSelect
          label="Client B2B"
          placeholder="Rechercher un client..."
          options={customerOptions}
          value={form.watch('customerId')}
          onChange={(id) => form.setValue('customerId', id, { shouldValidate: true })}
          error={errors.customerId?.message}
          required
        />
        <SearchSelect
          label="Dépôt d'expédition"
          placeholder="Rechercher un dépôt..."
          options={depotOptions}
          value={form.watch('depotId')}
          onChange={(id) => form.setValue('depotId', id, { shouldValidate: true })}
          error={errors.depotId?.message}
          required
        />
      </div>

      {/* ═══════════════════════════════════════════════════ */}
      {/* SECTION 2: Lignes de facture — Two-card layout     */}
      {/* ═══════════════════════════════════════════════════ */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

        {/* ────────── Carte Gauche: Recherche & Sélection ────────── */}
        <div className="lg:col-span-3 bg-white border border-slate-200 rounded-xl flex flex-col">
          <div className="p-5 border-b border-slate-100">
            <h2 className="text-base font-bold text-slate-900 mb-4">Catalogue produits</h2>

            {/* Search bar */}
            <div className="relative mb-3">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Rechercher un produit par nom ou SKU..."
                value={productSearch}
                onChange={(e) => setProductSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white transition-all"
              />
            </div>

            {/* Category pills */}
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setSelectedCategoryId(null)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                  selectedCategoryId === null
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                Tous
              </button>
              {categories.map((cat: any) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedCategoryId(cat.id)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                    selectedCategoryId === cat.id
                      ? 'bg-slate-900 text-white shadow-sm'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          {/* Products list */}
          <div className="flex-1 overflow-y-auto p-4 space-y-2 max-h-[420px]">
            {filteredProducts.length === 0 ? (
              <div className="h-full min-h-[200px] flex flex-col items-center justify-center text-slate-400 gap-2">
                <Package2 className="w-10 h-10 opacity-40" />
                <p className="text-sm">Aucun produit trouvé</p>
              </div>
            ) : (
              filteredProducts.map((product: any) => {
                const categoryName = categories.find((c: any) => c.id === product.categoryId)?.name || 'Non classé';
                const qtyInCart = getProductQty(product.id);

                return (
                  <div
                    key={product.id}
                    className="group flex items-center justify-between p-3.5 rounded-xl border border-slate-100 bg-white hover:border-slate-300 hover:shadow-sm transition-all"
                  >
                    {/* Product info */}
                    <div className="flex flex-col gap-1 flex-1 min-w-0">
                      <span className="font-semibold text-slate-900 text-sm truncate">
                        {product.name}
                      </span>
                      <div className="flex items-center gap-2 text-xs text-slate-500">
                        <span className="flex items-center gap-1">
                          <Tag className="w-3 h-3 flex-shrink-0" /> {product.sku}
                        </span>
                        <span className="px-1.5 py-0.5 rounded bg-slate-50 border border-slate-100 text-[10px]">
                          {categoryName}
                        </span>
                      </div>
                    </div>

                    {/* Price + Add button */}
                    <div className="flex items-center gap-3 ml-3">
                      <span className="font-bold text-slate-900 tabular-nums text-sm whitespace-nowrap">
                        {formatCurrency(product.defaultPrice)}
                      </span>
                      <button
                        type="button"
                        onClick={() => addProductToInvoice(product.id)}
                        className={`flex items-center justify-center w-8 h-8 rounded-lg transition-all ${
                          qtyInCart > 0
                            ? 'bg-slate-900 text-white hover:bg-slate-700'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                        title="Ajouter à la facture"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                      {qtyInCart > 0 && (
                        <span className="bg-slate-900 text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center -ml-2 -mt-5">
                          {qtyInCart}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* ────────── Carte Droite: Récap rapide & Totaux ────────── */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-xl flex flex-col">
          <div className="p-5 border-b border-slate-100 flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900">Facture en cours</h2>
            <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2 py-1 rounded-full">
              {totalItems} article{totalItems !== 1 ? 's' : ''}
            </span>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-2 max-h-[320px]">
            {watchedLines.length === 0 ? (
              <div className="h-full min-h-[180px] flex flex-col items-center justify-center text-slate-400 gap-2">
                <ShoppingCart className="w-8 h-8 opacity-40" />
                <p className="text-sm">Aucun produit ajouté</p>
                <p className="text-xs">Cliquez sur (+) pour ajouter des produits</p>
              </div>
            ) : (
              watchedLines.map((line, index) => {
                const product = products.find((p: any) => p.id === line.productId);
                const lineTotal = (line.quantity || 0) * (line.unitPrice || 0);
                if (!product) return null;

                return (
                  <div key={`line-${index}`} className="flex items-center gap-3 p-3 rounded-lg border border-slate-100 bg-slate-50/50">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-900 truncate">{product.name}</p>
                      <p className="text-xs text-slate-500">{formatCurrency(line.unitPrice)} / unité</p>
                    </div>

                    {/* Quantity controls */}
                    <div className="flex items-center">
                      <button
                        type="button"
                        onClick={() => decrementLine(index)}
                        disabled={line.quantity <= 1}
                        className="w-7 h-7 flex items-center justify-center rounded-l-lg bg-slate-100 hover:bg-slate-200 disabled:opacity-40 transition-colors"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <input
                        type="number"
                        min={1}
                        value={line.quantity}
                        onChange={(e) => setLineQuantity(index, parseInt(e.target.value) || 1)}
                        className="w-10 h-7 text-center text-xs font-semibold border-y border-slate-200 bg-white focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => incrementLine(index)}
                        className="w-7 h-7 flex items-center justify-center rounded-r-lg bg-slate-100 hover:bg-slate-200 transition-colors"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    <span className="text-sm font-bold text-slate-900 tabular-nums whitespace-nowrap w-24 text-right">
                      {formatCurrency(lineTotal)}
                    </span>
                  </div>
                );
              })
            )}
          </div>

          {/* Total + Acompte + Drawer button */}
          <div className="p-5 border-t border-slate-200 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-slate-600">Total facture</span>
              <span className="text-xl font-bold text-slate-900 tabular-nums">
                {formatCurrency(totalAmount)}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <label className="text-sm font-medium text-slate-600 whitespace-nowrap">Acompte (MGA)</label>
              <input
                type="number"
                min={0}
                max={totalAmount}
                {...register('amountPaid', { valueAsNumber: true })}
                className={`flex-1 border p-2 rounded-lg text-right font-semibold text-sm bg-white focus:outline-none focus:ring-2 focus:ring-slate-900 ${errors.amountPaid ? 'border-red-400' : 'border-slate-200'}`}
              />
            </div>
            {errors.amountPaid && <p className="text-xs text-red-500">{errors.amountPaid.message}</p>}

            {/* Drawer open button */}
            {watchedLines.length > 0 && (
              <button
                type="button"
                onClick={() => setIsDrawerOpen(true)}
                className="w-full flex items-center justify-between px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 hover:bg-slate-100 transition-colors group"
              >
                <span className="text-sm font-medium text-slate-700 group-hover:text-slate-900">
                  Voir le récapitulatif complet
                </span>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-slate-700 transition-colors" />
              </button>
            )}
          </div>

          {errors.lines?.message && (
            <div className="px-5 pb-4">
              <p className="text-xs text-red-500 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" /> {errors.lines.message}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════ */}
      {/* SECTION 3: Boutons Annuler / Valider               */}
      {/* ═══════════════════════════════════════════════════ */}
      <div className="flex justify-end gap-3">
        <Button type="button" variant="outline" onClick={() => router.push('/dashboard/sales')}>Annuler</Button>
        <Button type="submit" isLoading={isSubmitting}>Valider la Facture</Button>
      </div>

      {/* ═══════════════════════════════════════════════════ */}
      {/* Drawer récapitulatif                               */}
      {/* ═══════════════════════════════════════════════════ */}
      <InvoiceDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        lines={watchedLines}
        products={products}
        categories={categories}
        onIncrement={incrementLine}
        onDecrement={decrementLine}
        onRemove={removeLine}
        onQuantityChange={setLineQuantity}
        totalAmount={totalAmount}
      />
    </form>
  );
};
