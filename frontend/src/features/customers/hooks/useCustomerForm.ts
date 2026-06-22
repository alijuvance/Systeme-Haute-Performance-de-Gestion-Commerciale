import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { customerSchema, CustomerFormData, Customer } from '../schemas/customerSchema';
import { createCustomer, updateCustomer } from '../api/customerApi';

export const useCustomerForm = (
  onSuccess: () => void,
  initialData?: Customer
) => {
  const [submitError, setSubmitError] = useState<string | null>(null);

  const form = useForm<CustomerFormData>({
    resolver: zodResolver(customerSchema),
    defaultValues: initialData ? {
      fullName: initialData.fullName,
      companyName: initialData.companyName || '',
      email: initialData.email || '',
      phone: initialData.phone,
      address: initialData.address || '',
      type: initialData.type,
    } : {
      fullName: '',
      companyName: '',
      email: '',
      phone: '',
      address: '',
      type: 'B2B',
    },
    mode: 'onChange',
  });

  const onSubmit = form.handleSubmit(async (data) => {
    try {
      setSubmitError(null);
      if (initialData) {
        await updateCustomer(initialData.id, data);
      } else {
        await createCustomer(data);
      }
      onSuccess();
    } catch (err: any) {
      setSubmitError(err.response?.data?.message || err.message || 'Erreur lors de l\'enregistrement');
    }
  });

  return { form, onSubmit, submitError };
};
