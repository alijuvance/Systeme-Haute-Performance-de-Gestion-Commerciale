'use client';
import React, { useState } from 'react';
import { useSuppliers } from '../hooks/useSuppliers';
import { Supplier } from '../schemas/supplierSchema';
import { DataTable, ColumnDef } from '@/components/shared/DataTable';
import { PageHeader } from '@/components/shared/PageHeader';
import { Button } from '@/components/shared/Button';
import { Modal } from '@/components/shared/Modal';
import { Input } from '@/components/shared/Input';
import { Plus, Pencil, Trash } from 'lucide-react';
import { useSupplierForm } from '../hooks/useSupplierForm';
import { useToast } from '@/components/providers/ToastProvider';

function SupplierFormModal({ isOpen, onClose, onSuccess, initialData }: { isOpen: boolean; onClose: () => void; onSuccess: () => void; initialData?: Supplier }) {
  const { form, onSubmit, submitError } = useSupplierForm(() => { onSuccess(); onClose(); }, initialData);
  const { register, formState: { errors, isSubmitting } } = form;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={initialData ? "Modifier le fournisseur" : "Nouveau fournisseur"}>
      <form onSubmit={onSubmit} className="space-y-4">
        {submitError && <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">{submitError}</div>}
        
        <Input 
          label="Nom *"
          {...register('name')} 
          error={errors.name?.message} 
        />
        
        <Input 
          label="Contact"
          {...register('contactName')} 
        />
        
        <div className="grid grid-cols-2 gap-4">
          <Input 
            label="Téléphone *"
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
        
        <div className="flex justify-end gap-3 mt-6 pt-5 border-t border-gray-100">
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
  const toast = useToast();

  const handleDelete = async (id: string) => {
    const ok = await toast.confirm({
      title: 'Supprimer ce fournisseur',
      message: 'Cette action est irréversible. Voulez-vous vraiment supprimer ce fournisseur ?',
      variant: 'danger',
      confirmText: 'Supprimer',
    });
    if (ok) {
      await removeSupplier(id);
      toast.success('Fournisseur supprimé avec succès.');
    }
  };

  const columns: ColumnDef<Supplier>[] = [
    { key: 'name', header: 'Nom', cell: (s) => <span className="font-medium text-gray-900">{s.name}</span> },
    { key: 'contact', header: 'Contact', cell: (s) => <span className="text-gray-600">{s.contactName || '—'}</span> },
    { key: 'phone', header: 'Téléphone', cell: (s) => <span className="text-gray-600">{s.phone}</span> },
    { key: 'email', header: 'Email', cell: (s) => <span className="text-gray-600">{s.email || '—'}</span> },
    {
      key: 'actions', header: '', align: 'right',
      cell: (s) => (
        <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <button onClick={() => { setEditing(s); setIsModalOpen(true); }} className="p-1.5 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all"><Pencil className="w-4 h-4" /></button>
          <button onClick={() => handleDelete(s.id)} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"><Trash className="w-4 h-4" /></button>
        </div>
      )
    }
  ];

  if (error) return <div className="p-4 bg-red-50 text-red-600 rounded-xl text-sm mb-4">{error}</div>;

  return (
    <>
      <PageHeader title="Fournisseurs" description="Gérez vos fournisseurs et contacts d'approvisionnement." actions={<Button onClick={() => { setEditing(undefined); setIsModalOpen(true); }} icon={<Plus className="w-4 h-4" />}>Nouveau Fournisseur</Button>} />
      <DataTable data={suppliers} columns={columns} keyExtractor={(s) => s.id} isLoading={isLoading} emptyMessage="Aucun fournisseur trouvé." />
      <SupplierFormModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSuccess={fetchSuppliers} initialData={editing} />
    </>
  );
}
