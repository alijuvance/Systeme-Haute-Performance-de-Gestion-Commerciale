import React from 'react';
import { useCustomerForm } from '../hooks/useCustomerForm';
import { Customer } from '../schemas/customerSchema';
import { Modal } from '@/components/shared/Modal';
import { Button } from '@/components/shared/Button';

interface CustomerFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  initialData?: Customer;
}

export function CustomerFormModal({ isOpen, onClose, onSuccess, initialData }: CustomerFormModalProps) {
  const { form, onSubmit, submitError } = useCustomerForm(() => {
    onSuccess();
    onClose();
  }, initialData);

  const { register, formState: { errors, isSubmitting } } = form;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={initialData ? "Modifier le client" : "Nouveau client"}>
      <form onSubmit={onSubmit} className="space-y-4">
        {submitError && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-3 text-sm">
            {submitError}
          </div>
        )}

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1">Nom complet <span className="text-red-500">*</span></label>
          <input
            {...register('fullName')}
            className={`w-full border p-2 text-sm bg-white focus:outline-none focus:ring-1 focus:ring-slate-400 ${errors.fullName ? 'border-red-400' : 'border-slate-300'}`}
          />
          {errors.fullName && <p className="text-xs text-red-500 mt-1">{errors.fullName.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1">Raison sociale</label>
          <input
            {...register('companyName')}
            className="w-full border border-slate-300 p-2 text-sm bg-white focus:outline-none focus:ring-1 focus:ring-slate-400"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Téléphone <span className="text-red-500">*</span></label>
            <input
              {...register('phone')}
              className={`w-full border p-2 text-sm bg-white focus:outline-none focus:ring-1 focus:ring-slate-400 ${errors.phone ? 'border-red-400' : 'border-slate-300'}`}
            />
            {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Email</label>
            <input
              {...register('email')}
              className={`w-full border p-2 text-sm bg-white focus:outline-none focus:ring-1 focus:ring-slate-400 ${errors.email ? 'border-red-400' : 'border-slate-300'}`}
            />
            {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>}
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1">Adresse</label>
          <input
            {...register('address')}
            className="w-full border border-slate-300 p-2 text-sm bg-white focus:outline-none focus:ring-1 focus:ring-slate-400"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1">Type</label>
          <select
            {...register('type')}
            className="w-full border border-slate-300 p-2 text-sm bg-white focus:outline-none focus:ring-1 focus:ring-slate-400"
          >
            <option value="B2B">B2B (Entreprise)</option>
            <option value="B2C">B2C (Particulier)</option>
          </select>
        </div>

        <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-slate-200">
          <Button type="button" variant="outline" onClick={onClose}>Annuler</Button>
          <Button type="submit" isLoading={isSubmitting}>Enregistrer</Button>
        </div>
      </form>
    </Modal>
  );
}
