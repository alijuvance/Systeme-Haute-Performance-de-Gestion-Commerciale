import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { supplierSchema, SupplierFormData, Supplier } from '../schemas/supplierSchema';
import { createSupplier, updateSupplier } from '../api/supplierApi';

export const useSupplierForm = (
  onSuccess: () => void,
  initialData?: Supplier
) => {
  const [submitError, setSubmitError] = useState<string | null>(null);

  const form = useForm<SupplierFormData>({
    resolver: zodResolver(supplierSchema),
    defaultValues: initialData ? {
      name: initialData.name,
      contactName: initialData.contactName || '',
      phone: initialData.phone,
      email: initialData.email || '',
      address: initialData.address || '',
    } : {
      name: '',
      contactName: '',
      phone: '',
      email: '',
      address: '',
    },
    mode: 'onChange',
  });

  const onSubmit = form.handleSubmit(async (data) => {
    try {
      setSubmitError(null);
      if (initialData) {
        await updateSupplier(initialData.id, data);
      } else {
        await createSupplier(data);
      }
      onSuccess();
    } catch (err: any) {
      setSubmitError(err.response?.data?.message || err.message || 'Erreur lors de l\'enregistrement');
    }
  });

  return { form, onSubmit, submitError };
};
