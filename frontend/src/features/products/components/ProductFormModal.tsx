import React, { useState, useEffect } from 'react';
import { useProductForm } from '../hooks/useProductForm';
import { Product } from '../schemas/productSchema';
import { Modal } from '@/components/shared/Modal';
import { Button } from '@/components/shared/Button';
import { Input } from '@/components/shared/Input';
import SearchSelect from '@/components/shared/SearchSelect';
import api from '@/api/axios';
import { Package, Tag, DollarSign } from 'lucide-react';

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

  const { register, setValue, watch, formState: { errors, isSubmitting } } = form;
  const categoryId = watch('categoryId');

  const [categories, setCategories] = useState<any[]>([]);

  useEffect(() => {
    api.get('/api/categories').then((res) => {
      setCategories(res.data);
    }).catch(console.error);
  }, []);

  const categoryOptions = categories.map(c => ({
    id: c.id,
    label: c.name,
  }));

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={initialData ? "Modifier le produit" : "Nouveau produit"}>
      <form onSubmit={onSubmit} className="space-y-5">
        {submitError && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">
            {submitError}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Référence / SKU *"
            {...register('sku')}
            error={errors.sku?.message}
            placeholder="Ex: PROD-001"
            icon={<Tag className="w-4 h-4" />}
          />

          <Input
            label="Nom du produit *"
            {...register('name')}
            error={errors.name?.message}
            placeholder="Ex: Ordinateur Portable"
            icon={<Package className="w-4 h-4" />}
          />
        </div>

        <div>
          <SearchSelect
            label="Catégorie"
            placeholder="Sélectionnez une catégorie..."
            options={categoryOptions}
            value={categoryId}
            onChange={(val) => setValue('categoryId', val, { shouldValidate: true })}
            required
          />
          {errors.categoryId && <p className="text-xs font-medium text-red-500 mt-1.5">{errors.categoryId.message}</p>}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Prix Unitaire (Vente) *"
            type="number"
            min={0}
            step="0.01"
            {...register('defaultPrice', { valueAsNumber: true })}
            error={errors.defaultPrice?.message}
            icon={<DollarSign className="w-4 h-4" />}
          />

          <Input
            label="Coût d'achat (Achat) *"
            type="number"
            min={0}
            step="0.01"
            {...register('costPrice', { valueAsNumber: true })}
            error={errors.costPrice?.message}
            icon={<DollarSign className="w-4 h-4" />}
          />
        </div>

        <div className="flex justify-end gap-3 mt-8 pt-5 border-t border-gray-100">
          <Button type="button" variant="outline" onClick={onClose}>Annuler</Button>
          <Button type="submit" isLoading={isSubmitting}>Enregistrer</Button>
        </div>
      </form>
    </Modal>
  );
}
