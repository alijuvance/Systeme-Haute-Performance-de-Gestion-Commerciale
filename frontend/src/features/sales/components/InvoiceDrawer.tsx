'use client';

import React from 'react';
import { Plus, Minus, X, Package2, Tag } from 'lucide-react';
import Drawer from '@/components/shared/Drawer';
import { formatCurrency } from '@/utils/formatters';

// ── Types ────────────────────────────────────────────────────────────────────

interface InvoiceLine {
  productId: string;
  quantity: number;
  unitPrice: number;
}

interface Product {
  id: string;
  name: string;
  sku: string;
  categoryId: string;
  defaultPrice: number;
}

interface Category {
  id: string;
  name: string;
}

interface InvoiceDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  lines: InvoiceLine[];
  products: Product[];
  categories: Category[];
  onIncrement: (index: number) => void;
  onDecrement: (index: number) => void;
  onRemove: (index: number) => void;
  onQuantityChange: (index: number, quantity: number) => void;
  totalAmount: number;
}

// ── Component ────────────────────────────────────────────────────────────────

export default function InvoiceDrawer({
  isOpen,
  onClose,
  lines,
  products,
  categories,
  onIncrement,
  onDecrement,
  onRemove,
  onQuantityChange,
  totalAmount,
}: InvoiceDrawerProps) {
  const activeLines = lines.filter((line) => line.productId);

  const getProduct = (productId: string): Product | undefined =>
    products.find((p) => p.id === productId);

  const getCategoryName = (categoryId: string): string =>
    categories.find((c) => c.id === categoryId)?.name ?? '';

  return (
    <Drawer isOpen={isOpen} onClose={onClose} title="Récapitulatif de la facture">
      <div className="flex h-full flex-col">
        {/* ── Line list ─────────────────────────────────────────────── */}
        {activeLines.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-3 py-20 text-slate-400">
            <Package2 className="h-12 w-12 stroke-[1.5]" />
            <p className="text-sm font-medium">Aucun produit ajouté</p>
          </div>
        ) : (
          <div className="flex-1 space-y-3">
            {lines.map((line, index) => {
              if (!line.productId) return null;

              const product = getProduct(line.productId);
              if (!product) return null;

              const categoryName = getCategoryName(product.categoryId);
              const subtotal = line.quantity * line.unitPrice;

              return (
                <div
                  key={`${line.productId}-${index}`}
                  className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md"
                >
                  {/* Top row: product info + remove button */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-slate-900 truncate">
                        {product.name}
                      </p>
                      <div className="mt-1 flex items-center gap-2 text-xs text-slate-500">
                        <span>{product.sku}</span>
                        {categoryName && (
                          <>
                            <span className="text-slate-300">•</span>
                            <span className="inline-flex items-center gap-1">
                              <Tag className="h-3 w-3" />
                              {categoryName}
                            </span>
                          </>
                        )}
                      </div>
                      <p className="mt-1 text-sm text-slate-600">
                        P.U. : {formatCurrency(line.unitPrice)}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => onRemove(index)}
                      className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-red-50 hover:text-red-500"
                      aria-label={`Supprimer ${product.name}`}
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>

                  {/* Bottom row: quantity controls + subtotal */}
                  <div className="mt-3 flex items-center justify-between">
                    {/* Quantity controls */}
                    <div className="inline-flex items-center">
                      <button
                        type="button"
                        onClick={() => onDecrement(index)}
                        disabled={line.quantity <= 1}
                        className="inline-flex h-8 w-8 items-center justify-center rounded-l-lg border border-slate-200 bg-slate-100 text-slate-700 transition-colors hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-40"
                        aria-label="Diminuer la quantité"
                      >
                        <Minus className="h-3.5 w-3.5" />
                      </button>

                      <input
                        type="number"
                        min={1}
                        value={line.quantity}
                        onChange={(e) => {
                          const val = parseInt(e.target.value, 10);
                          if (!isNaN(val) && val > 0) {
                            onQuantityChange(index, val);
                          }
                        }}
                        className="h-8 w-14 border-y border-slate-200 bg-white text-center text-sm text-slate-900 outline-none focus:border-slate-400 [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                        aria-label="Quantité"
                      />

                      <button
                        type="button"
                        onClick={() => onIncrement(index)}
                        className="inline-flex h-8 w-8 items-center justify-center rounded-r-lg border border-slate-200 bg-slate-100 text-slate-700 transition-colors hover:bg-slate-200"
                        aria-label="Augmenter la quantité"
                      >
                        <Plus className="h-3.5 w-3.5" />
                      </button>
                    </div>

                    {/* Line subtotal */}
                    <p className="text-right font-bold text-slate-900">
                      {formatCurrency(subtotal)}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ── Sticky total footer ───────────────────────────────────── */}
        {activeLines.length > 0 && (
          <div className="sticky bottom-0 -mx-6 -mb-4 border-t border-slate-200 bg-white px-6 py-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-slate-600">Total facture</span>
              <span className="text-xl font-bold text-slate-900">
                {formatCurrency(totalAmount)}
              </span>
            </div>
          </div>
        )}
      </div>
    </Drawer>
  );
}
