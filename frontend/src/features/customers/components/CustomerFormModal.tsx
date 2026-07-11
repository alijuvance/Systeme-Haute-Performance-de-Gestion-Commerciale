import React from 'react';
import { useCustomerForm } from '../hooks/useCustomerForm';
import { Customer } from '../schemas/customerSchema';
import { Modal } from '@/components/shared/Modal';
import { Button } from '@/components/shared/Button';
import { Input } from '@/components/shared/Input';
import { Select } from '@/components/shared/Select';

interface CustomerFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (customer?: Customer) => void;
  initialData?: Customer;
  prefilledName?: string;
}

export function CustomerFormModal({ isOpen, onClose, onSuccess, initialData, prefilledName }: CustomerFormModalProps) {
  const { form, onSubmit, submitError } = useCustomerForm((createdCustomer) => {
    onSuccess(createdCustomer);
    onClose();
  }, initialData, prefilledName);

  const { register, formState: { errors, isSubmitting } } = form;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={initialData ? "Modifier le client" : "Nouveau client"}>
      <form onSubmit={onSubmit} className="space-y-5">
        {submitError && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">
            {submitError}
          </div>
        )}

        <Input
          label="Nom complet *"
          {...register('fullName')}
          error={errors.fullName?.message}
        />

        <Input
          label="Raison sociale"
          {...register('companyName')}
        />

        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Téléphone"
            {...register('phone')}
            error={errors.phone?.message}
          />
          
          <Input
            label="Email"
            {...register('email')}
            error={errors.email?.message}
          />
        </div>

        <Input
          label="Adresse"
          {...register('address')}
        />

        <Select
          label="Type"
          {...register('type')}
          options={[
            { value: 'B2B', label: 'B2B (Entreprise)' },
            { value: 'B2C', label: 'B2C (Particulier)' },
          ]}
        />

        <div className="flex justify-end gap-3 mt-8 pt-5 border-t border-gray-100">
          <Button type="button" variant="outline" onClick={onClose}>Annuler</Button>
          <Button type="submit" isLoading={isSubmitting}>Enregistrer</Button>
        </div>
      </form>
    </Modal>
  );
}
