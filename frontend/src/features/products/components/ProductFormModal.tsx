import React from 'react';
import { useProductForm } from '../hooks/useProductForm';
import { Product } from '../schemas/productSchema';
import { Modal } from '@/components/shared/Modal';
import { Button } from '@/components/shared/Button';

interface ProductFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  initialData?: Product;
}

export function ProductFormModal({ isOpen, onClose, onSuccess, initialData }: ProductFormModalProps) {
  const { form, onSubmit, submitError } = useProductForm(() => {
    onSuccess();
    onClose();
  }, initialData);

  const { register, formState: { errors, isSubmitting } } = form;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={initialData ? "Modifier le produit" : "Nouveau produit"}>
      <form onSubmit={onSubmit} className="space-y-4">
        {submitError && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-3 text-sm">
            {submitError}
          </div>
        )}

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1">Référence <span className="text-red-500">*</span></label>
          <input
            {...register('reference')}
            className={`w-full border p-2 text-sm bg-white focus:outline-none focus:ring-1 focus:ring-slate-400 ${errors.reference ? 'border-red-400' : 'border-slate-300'}`}
          />
          {errors.reference && <p className="text-xs text-red-500 mt-1">{errors.reference.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1">Nom du produit <span className="text-red-500">*</span></label>
          <input
            {...register('name')}
            className={`w-full border p-2 text-sm bg-white focus:outline-none focus:ring-1 focus:ring-slate-400 ${errors.name ? 'border-red-400' : 'border-slate-300'}`}
          />
          {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1">Catégorie ID</label>
          <input
            {...register('categoryId')}
            className="w-full border border-slate-300 p-2 text-sm bg-white focus:outline-none focus:ring-1 focus:ring-slate-400"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Prix Unitaire <span className="text-red-500">*</span></label>
            <input
              type="number"
              min={0}
              {...register('defaultPrice', { valueAsNumber: true })}
              className={`w-full border p-2 text-sm bg-white focus:outline-none focus:ring-1 focus:ring-slate-400 ${errors.defaultPrice ? 'border-red-400' : 'border-slate-300'}`}
            />
            {errors.defaultPrice && <p className="text-xs text-red-500 mt-1">{errors.defaultPrice.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Alerte Stock</label>
            <input
              type="number"
              min={0}
              {...register('minimumStockAlert', { valueAsNumber: true })}
              className={`w-full border p-2 text-sm bg-white focus:outline-none focus:ring-1 focus:ring-slate-400 ${errors.minimumStockAlert ? 'border-red-400' : 'border-slate-300'}`}
            />
            {errors.minimumStockAlert && <p className="text-xs text-red-500 mt-1">{errors.minimumStockAlert.message}</p>}
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-slate-200">
          <Button type="button" variant="outline" onClick={onClose}>Annuler</Button>
          <Button type="submit" isLoading={isSubmitting}>Enregistrer</Button>
        </div>
      </form>
    </Modal>
  );
}
