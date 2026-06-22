'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useSaleForm } from '../hooks/useSaleForm';
import { formatCurrency } from '@/utils/formatters';
import { Button } from '@/components/shared/Button';
import { Plus, Trash2, AlertCircle, Loader2 } from 'lucide-react';

export const SaleForm: React.FC = () => {
  const router = useRouter();
  const {
    form, fields, onSubmit,
    customers, products, depots, isLoadingRef,
    addLine, removeLine, handleProductChange,
    totalAmount, submitError,
  } = useSaleForm();

  const { register, formState: { errors, isSubmitting } } = form;

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
        <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 text-red-700 text-sm">
          <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
          <div>
            <p className="font-semibold">Erreur lors de la création</p>
            <p className="mt-1">{submitError}</p>
          </div>
        </div>
      )}

      {/* Client & Dépôt */}
      <div className="bg-white border border-slate-200 p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1">Client B2B <span className="text-red-500">*</span></label>
          <select
            {...register('customerId')}
            className={`w-full border p-2 text-sm bg-white focus:outline-none focus:ring-1 focus:ring-slate-400 ${errors.customerId ? 'border-red-400' : 'border-slate-300'}`}
          >
            <option value="">Sélectionner un client...</option>
            {customers.map((c: any) => (
              <option key={c.id} value={c.id}>{c.companyName || c.fullName}</option>
            ))}
          </select>
          {errors.customerId && <p className="mt-1 text-xs text-red-500">{errors.customerId.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1">Dépôt d&apos;expédition <span className="text-red-500">*</span></label>
          <select
            {...register('depotId')}
            className={`w-full border p-2 text-sm bg-white focus:outline-none focus:ring-1 focus:ring-slate-400 ${errors.depotId ? 'border-red-400' : 'border-slate-300'}`}
          >
            <option value="">Dépôt source...</option>
            {depots.map((d: any) => (
              <option key={d.id} value={d.id}>{d.name}</option>
            ))}
          </select>
          {errors.depotId && <p className="mt-1 text-xs text-red-500">{errors.depotId.message}</p>}
        </div>
      </div>

      {/* Invoice Lines */}
      <div className="bg-white border border-slate-200 p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-base font-bold text-slate-900">Lignes de la facture</h2>
          <button type="button" onClick={addLine} className="flex items-center gap-1.5 text-slate-600 text-sm font-medium hover:text-slate-900 transition-colors">
            <Plus className="w-4 h-4" /> Ajouter un produit
          </button>
        </div>

        {errors.lines?.message && (
          <p className="mb-3 text-xs text-red-500 flex items-center gap-1">
            <AlertCircle className="w-3 h-3" /> {errors.lines.message}
          </p>
        )}

        <div className="overflow-x-auto border border-slate-200">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="text-left text-xs font-semibold text-slate-500 uppercase px-4 py-3">Produit</th>
                <th className="text-left text-xs font-semibold text-slate-500 uppercase px-4 py-3 w-28">Quantité</th>
                <th className="text-left text-xs font-semibold text-slate-500 uppercase px-4 py-3 w-36">Prix Unitaire</th>
                <th className="text-right text-xs font-semibold text-slate-500 uppercase px-4 py-3 w-32">Sous-Total</th>
                <th className="w-12"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {fields.map((field, index) => {
                const watchedLine = form.watch(`lines.${index}`);
                const lineTotal = (watchedLine?.quantity || 0) * (watchedLine?.unitPrice || 0);
                return (
                  <tr key={field.id} className="group">
                    <td className="px-4 py-3">
                      <select
                        value={watchedLine?.productId || ''}
                        onChange={(e) => handleProductChange(index, e.target.value)}
                        className={`w-full border p-2 text-sm bg-white focus:outline-none focus:ring-1 focus:ring-slate-400 ${errors.lines?.[index]?.productId ? 'border-red-400' : 'border-slate-300'}`}
                      >
                        <option value="">Choisir un produit...</option>
                        {products.map((p: any) => (
                          <option key={p.id} value={p.id}>{p.name}</option>
                        ))}
                      </select>
                    </td>
                    <td className="px-4 py-3">
                      <input type="number" min={1} {...register(`lines.${index}.quantity`, { valueAsNumber: true })} className={`w-full border p-2 text-sm bg-white focus:outline-none focus:ring-1 focus:ring-slate-400 ${errors.lines?.[index]?.quantity ? 'border-red-400' : 'border-slate-300'}`} />
                    </td>
                    <td className="px-4 py-3">
                      <input type="number" min={0} {...register(`lines.${index}.unitPrice`, { valueAsNumber: true })} className={`w-full border p-2 text-sm bg-white focus:outline-none focus:ring-1 focus:ring-slate-400 ${errors.lines?.[index]?.unitPrice ? 'border-red-400' : 'border-slate-300'}`} />
                    </td>
                    <td className="px-4 py-3 text-right font-semibold text-slate-900 tabular-nums">{formatCurrency(lineTotal)}</td>
                    <td className="px-2 py-3 text-center">
                      {fields.length > 1 && (
                        <button type="button" onClick={() => removeLine(index)} className="p-1 text-slate-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-all">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Total & Payment */}
        <div className="flex flex-col items-end pt-5 mt-5 border-t border-slate-200 gap-3">
          <div className="text-right">
            <p className="text-xs text-slate-500 mb-1">Total facture</p>
            <p className="text-2xl font-bold text-slate-900 tabular-nums">{formatCurrency(totalAmount)}</p>
          </div>
          <div className="flex items-center gap-3">
            <label className="text-sm font-semibold text-slate-600 whitespace-nowrap">Acompte reçu (MGA) :</label>
            <input type="number" min={0} max={totalAmount} {...register('amountPaid', { valueAsNumber: true })} className={`border p-2 w-36 text-right font-semibold text-sm bg-white focus:outline-none focus:ring-1 focus:ring-slate-400 ${errors.amountPaid ? 'border-red-400' : 'border-slate-300'}`} />
          </div>
          {errors.amountPaid && <p className="text-xs text-red-500">{errors.amountPaid.message}</p>}
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-3">
        <Button type="button" variant="outline" onClick={() => router.push('/dashboard/sales')}>Annuler</Button>
        <Button type="submit" isLoading={isSubmitting}>Valider la Facture</Button>
      </div>
    </form>
  );
};
