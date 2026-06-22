'use client';
import React, { useState } from 'react';
import { useSuppliers } from '../hooks/useSuppliers';
import { Supplier } from '../schemas/supplierSchema';
import { DataTable, ColumnDef } from '@/components/shared/DataTable';
import { PageHeader } from '@/components/shared/PageHeader';
import { Button } from '@/components/shared/Button';
import { Modal } from '@/components/shared/Modal';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import { useSupplierForm } from '../hooks/useSupplierForm';

function SupplierFormModal({ isOpen, onClose, onSuccess, initialData }: { isOpen: boolean; onClose: () => void; onSuccess: () => void; initialData?: Supplier }) {
  const { form, onSubmit, submitError } = useSupplierForm(() => { onSuccess(); onClose(); }, initialData);
  const { register, formState: { errors, isSubmitting } } = form;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={initialData ? "Modifier le fournisseur" : "Nouveau fournisseur"}>
      <form onSubmit={onSubmit} className="space-y-4">
        {submitError && <div className="bg-red-50 border border-red-200 text-red-700 p-3 text-sm">{submitError}</div>}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1">Nom <span className="text-red-500">*</span></label>
          <input {...register('name')} className={`w-full border p-2 text-sm bg-white focus:outline-none focus:ring-1 focus:ring-slate-400 ${errors.name ? 'border-red-400' : 'border-slate-300'}`} />
          {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1">Contact</label>
          <input {...register('contactName')} className="w-full border border-slate-300 p-2 text-sm bg-white focus:outline-none focus:ring-1 focus:ring-slate-400" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Téléphone <span className="text-red-500">*</span></label>
            <input {...register('phone')} className={`w-full border p-2 text-sm bg-white focus:outline-none focus:ring-1 focus:ring-slate-400 ${errors.phone ? 'border-red-400' : 'border-slate-300'}`} />
            {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Email</label>
            <input {...register('email')} className={`w-full border p-2 text-sm bg-white focus:outline-none focus:ring-1 focus:ring-slate-400 ${errors.email ? 'border-red-400' : 'border-slate-300'}`} />
            {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email?.message}</p>}
          </div>
        </div>
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1">Adresse</label>
          <input {...register('address')} className="w-full border border-slate-300 p-2 text-sm bg-white focus:outline-none focus:ring-1 focus:ring-slate-400" />
        </div>
        <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-slate-200">
          <Button type="button" variant="outline" onClick={onClose}>Annuler</Button>
          <Button type="submit" isLoading={isSubmitting}>Enregistrer</Button>
        </div>
      </form>
    </Modal>
  );
}

export function SuppliersTable() {
  const { suppliers, isLoading, error, fetchSuppliers, removeSupplier } = useSuppliers();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editing, setEditing] = useState<Supplier | undefined>(undefined);

  const columns: ColumnDef<Supplier>[] = [
    { key: 'name', header: 'Nom', cell: (s) => <span className="font-medium text-slate-900">{s.name}</span> },
    { key: 'contact', header: 'Contact', cell: (s) => s.contactName || '—' },
    { key: 'phone', header: 'Téléphone', cell: (s) => s.phone },
    { key: 'email', header: 'Email', cell: (s) => s.email || '—' },
    {
      key: 'actions', header: '', align: 'right',
      cell: (s) => (
        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button onClick={() => { setEditing(s); setIsModalOpen(true); }} className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"><Edit2 className="w-4 h-4" /></button>
          <button onClick={() => { if (confirm('Supprimer ce fournisseur ?')) removeSupplier(s.id); }} className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"><Trash2 className="w-4 h-4" /></button>
        </div>
      )
    }
  ];

  if (error) return <div className="p-4 bg-red-50 text-red-600 border border-red-200">{error}</div>;

  return (
    <>
      <PageHeader title="Fournisseurs" description="Gérez vos fournisseurs et contacts d'approvisionnement." actions={<Button onClick={() => { setEditing(undefined); setIsModalOpen(true); }} icon={<Plus className="w-4 h-4" />}>Nouveau Fournisseur</Button>} />
      <DataTable data={suppliers} columns={columns} keyExtractor={(s) => s.id} isLoading={isLoading} />
      <SupplierFormModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSuccess={fetchSuppliers} initialData={editing} />
    </>
  );
}
