import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { productSchema, ProductFormData, Product } from '../schemas/productSchema';
import { createProduct, updateProduct } from '../api/productApi';

export const useProductForm = (
  onSuccess: () => void,
  initialData?: Product
) => {
  const [submitError, setSubmitError] = useState<string | null>(null);

  const form = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: initialData ? {
      name: initialData.name,
      reference: initialData.reference,
      categoryId: initialData.categoryId,
      defaultPrice: initialData.defaultPrice,
      minimumStockAlert: initialData.minimumStockAlert,
    } : {
      name: '',
      reference: '',
      categoryId: '',
      defaultPrice: 0,
      minimumStockAlert: 0,
    },
    mode: 'onChange',
  });

  const onSubmit = form.handleSubmit(async (data) => {
    try {
      setSubmitError(null);
      if (initialData) {
        await updateProduct(initialData.id, data);
      } else {
        await createProduct(data);
      }
      onSuccess();
    } catch (err: any) {
      setSubmitError(err.response?.data?.message || err.message || 'Erreur lors de l\'enregistrement');
    }
  });

  return { form, onSubmit, submitError };
};
