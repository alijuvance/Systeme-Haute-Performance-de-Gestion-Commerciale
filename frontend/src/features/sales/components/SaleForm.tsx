'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useSaleForm } from '../hooks/useSaleForm';
import { formatCurrency } from '@/utils/formatters';
import { Plus, Trash2, AlertCircle, Loader2 } from 'lucide-react';

export const SaleForm: React.FC = () => {
  const router = useRouter();
  const {
    form,
    fields,
    onSubmit,
    customers,
    products,
    depots,
    isLoadingRef,
    addLine,
    removeLine,
    handleProductChange,
    totalAmount,
    submitError,
  } = useSaleForm();

  const { register, formState: { errors, isSubmitting } } = form;

  if (isLoadingRef) {
    return (
      <div className="flex items-center justify-center p-12 text-gray-500 dark:text-gray-400">
        <Loader2 className="w-6 h-6 animate-spin mr-3" />
        Chargement des données...
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      {/* Submit Error Banner */}
      {submitError && (
        <div className="flex items-start gap-3 p-4 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-xl text-red-800 dark:text-red-300 text-sm">
          <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
          <div>
            <p className="font-semibold">Erreur lors de la création</p>
            <p className="mt-1">{submitError}</p>
          </div>
        </div>
      )}

      {/* Client & Dépôt */}
      <div className="bg-white dark:bg-[#1e293b] p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-white/5 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Client B2B <span className="text-red-500">*</span>
          </label>
          <select
            {...register('customerId')}
            className={`w-full border rounded-xl p-3 bg-gray-50 dark:bg-white/5 dark:text-white dark:border-white/10 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${errors.customerId ? 'border-red-400 ring-2 ring-red-200' : 'border-gray-200'}`}
          >
            <option value="">Sélectionner un client...</option>
            {customers.map((c: any) => (
              <option key={c.id} value={c.id}>{c.companyName || c.fullName}</option>
            ))}
          </select>
          {errors.customerId && (
            <p className="mt-1.5 text-xs text-red-500 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" /> {errors.customerId.message}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Dépôt d&apos;expédition <span className="text-red-500">*</span>
          </label>
          <select
            {...register('depotId')}
            className={`w-full border rounded-xl p-3 bg-gray-50 dark:bg-white/5 dark:text-white dark:border-white/10 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${errors.depotId ? 'border-red-400 ring-2 ring-red-200' : 'border-gray-200'}`}
          >
            <option value="">Dépôt source...</option>
            {depots.map((d: any) => (
              <option key={d.id} value={d.id}>{d.name}</option>
            ))}
          </select>
          {errors.depotId && (
            <p className="mt-1.5 text-xs text-red-500 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" /> {errors.depotId.message}
            </p>
          )}
        </div>
      </div>

      {/* Invoice Lines */}
      <div className="bg-white dark:bg-[#1e293b] p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-white/5">
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-lg font-bold text-gray-800 dark:text-white flex items-center">
            <div className="w-1.5 h-6 bg-blue-500 rounded-full mr-3"></div>
            Lignes de la facture
          </h2>
          <button
            type="button"
            onClick={addLine}
            className="flex items-center gap-1.5 text-blue-600 dark:text-blue-400 text-sm font-semibold hover:text-blue-800 dark:hover:text-blue-300 transition-colors"
          >
            <Plus className="w-4 h-4" /> Ajouter un produit
          </button>
        </div>

        {errors.lines?.message && (
          <p className="mb-4 text-xs text-red-500 flex items-center gap-1">
            <AlertCircle className="w-3 h-3" /> {errors.lines.message}
          </p>
        )}

        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-white/10">
                <th className="text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase pb-3 pr-3">Produit</th>
                <th className="text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase pb-3 pr-3 w-28">Quantité</th>
                <th className="text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase pb-3 pr-3 w-40">Prix Unitaire</th>
                <th className="text-right text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase pb-3 w-36">Sous-Total</th>
                <th className="w-12"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-white/5">
              {fields.map((field, index) => {
                const watchedLine = form.watch(`lines.${index}`);
                const lineTotal = (watchedLine?.quantity || 0) * (watchedLine?.unitPrice || 0);

                return (
                  <tr key={field.id} className="group">
                    <td className="py-3 pr-3">
                      <select
                        value={watchedLine?.productId || ''}
                        onChange={(e) => handleProductChange(index, e.target.value)}
                        className={`w-full border rounded-lg p-2.5 text-sm bg-gray-50 dark:bg-white/5 dark:text-white dark:border-white/10 focus:ring-2 focus:ring-blue-500 transition-all ${errors.lines?.[index]?.productId ? 'border-red-400' : 'border-gray-200'}`}
                      >
                        <option value="">Choisir un produit...</option>
                        {products.map((p: any) => (
                          <option key={p.id} value={p.id}>{p.name}</option>
                        ))}
                      </select>
                      {errors.lines?.[index]?.productId && (
                        <p className="mt-1 text-xs text-red-500">{errors.lines[index].productId?.message}</p>
                      )}
                    </td>
                    <td className="py-3 pr-3">
                      <input
                        type="number"
                        min={1}
                        {...register(`lines.${index}.quantity`, { valueAsNumber: true })}
                        className={`w-full border rounded-lg p-2.5 text-sm bg-gray-50 dark:bg-white/5 dark:text-white dark:border-white/10 focus:ring-2 focus:ring-blue-500 transition-all ${errors.lines?.[index]?.quantity ? 'border-red-400' : 'border-gray-200'}`}
                      />
                    </td>
                    <td className="py-3 pr-3">
                      <input
                        type="number"
                        min={0}
                        {...register(`lines.${index}.unitPrice`, { valueAsNumber: true })}
                        className={`w-full border rounded-lg p-2.5 text-sm bg-gray-50 dark:bg-white/5 dark:text-white dark:border-white/10 focus:ring-2 focus:ring-blue-500 transition-all ${errors.lines?.[index]?.unitPrice ? 'border-red-400' : 'border-gray-200'}`}
                      />
                    </td>
                    <td className="py-3 text-right font-semibold text-gray-800 dark:text-white text-sm tabular-nums">
                      {formatCurrency(lineTotal)}
                    </td>
                    <td className="py-3 text-center">
                      {fields.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeLine(index)}
                          className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                        >
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

        {/* Summary & Payment */}
        <div className="flex flex-col items-end pt-6 mt-4 border-t border-gray-200 dark:border-white/10 gap-4">
          <div className="text-right">
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Total facture</p>
            <p className="text-3xl font-black text-gray-800 dark:text-white tabular-nums">
              {formatCurrency(totalAmount)}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <label className="text-sm font-semibold text-gray-600 dark:text-gray-300 whitespace-nowrap">
              Acompte reçu (MGA) :
            </label>
            <input
              type="number"
              min={0}
              max={totalAmount}
              {...register('amountPaid', { valueAsNumber: true })}
              className={`border rounded-xl p-2.5 w-40 text-right font-semibold bg-gray-50 dark:bg-white/5 dark:text-white dark:border-white/10 focus:ring-2 focus:ring-blue-500 transition-all ${errors.amountPaid ? 'border-red-400 ring-2 ring-red-200' : 'border-gray-200'}`}
            />
          </div>
          {errors.amountPaid && (
            <p className="text-xs text-red-500 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" /> {errors.amountPaid.message}
            </p>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end space-x-4">
        <button
          type="button"
          onClick={() => router.push('/dashboard/sales')}
          className="px-6 py-3 border border-gray-200 dark:border-white/10 rounded-xl text-gray-700 dark:text-gray-300 bg-white dark:bg-white/5 hover:bg-gray-50 dark:hover:bg-white/10 font-medium transition-all"
        >
          Annuler
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-8 py-3 bg-blue-600 text-white rounded-xl font-semibold shadow-lg shadow-blue-500/30 hover:bg-blue-700 hover:shadow-blue-500/40 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" /> Envoi en cours...
            </>
          ) : (
            'Valider la Facture'
          )}
        </button>
      </div>
    </form>
  );
};
