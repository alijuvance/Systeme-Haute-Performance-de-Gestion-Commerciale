import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { customerSchema, CustomerFormData, Customer } from '../schemas/customerSchema';
import { createCustomer, updateCustomer } from '../api/customerApi';
import { useToast } from '@/components/providers/ToastProvider';

const emptyValues: CustomerFormData = {
  fullName: '',
  companyName: '',
  email: '',
  phone: '',
  address: '',
  type: 'B2B',
};

export const useCustomerForm = (
  onSuccess: (customer?: Customer) => void,
  initialData?: Customer,
  prefilledName?: string
) => {
  const [submitError, setSubmitError] = useState<string | null>(null);
  const toast = useToast();

  const form = useForm<CustomerFormData>({
    resolver: zodResolver(customerSchema),
    defaultValues: emptyValues,
    mode: 'onChange',
  });

  // 🔑 Réinitialise le formulaire à chaque changement de initialData ou prefilledName
  useEffect(() => {
    if (initialData) {
      form.reset({
        fullName: initialData.fullName,
        companyName: initialData.companyName || '',
        email: initialData.email || '',
        phone: initialData.phone || '',
        address: initialData.address || '',
        type: initialData.type,
      });
    } else if (prefilledName) {
      form.reset({
        ...emptyValues,
        fullName: prefilledName,
      });
    } else {
      form.reset(emptyValues);
    }
  }, [initialData, prefilledName]);

  const onSubmit = form.handleSubmit(async (data) => {
    try {
      setSubmitError(null);
      if (initialData) {
        const updated = await updateCustomer(initialData.id, data);
        toast.success('Client modifié avec succès');
        onSuccess(updated);
      } else {
        const created = await createCustomer(data);
        toast.success('Client ajouté avec succès');
        onSuccess(created);
      }
    } catch (err: any) {
      setSubmitError(err.response?.data?.message || err.message || 'Erreur lors de l\'enregistrement');
    }
  });

  return { form, onSubmit, submitError };
};