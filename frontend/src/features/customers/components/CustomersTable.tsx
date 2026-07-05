'use client';
import React, { useState } from 'react';
import { useCustomers } from '../hooks/useCustomers';
import { Customer } from '../schemas/customerSchema';
import { DataTable, ColumnDef } from '@/components/shared/DataTable';
import { PageHeader } from '@/components/shared/PageHeader';
import { Button } from '@/components/shared/Button';
import { Plus, Pencil, Trash } from 'lucide-react';
import { CustomerFormModal } from './CustomerFormModal';
import { useToast } from '@/components/providers/ToastProvider';

export function CustomersTable() {
  const { customers, isLoading, error, fetchCustomers, removeCustomer } = useCustomers();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | undefined>(undefined);
  const toast = useToast();

  const handleOpenCreate = () => {
    setEditingCustomer(undefined);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (customer: Customer) => {
    setEditingCustomer(customer);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    const ok = await toast.confirm({
      title: 'Supprimer ce client',
      message: 'Cette action est irréversible. Voulez-vous vraiment supprimer ce client ?',
      variant: 'danger',
      confirmText: 'Supprimer',
    });
    if (ok) {
      await removeCustomer(id);
      toast.success('Client supprimé avec succès.');
    }
  };

  const columns: ColumnDef<Customer>[] = [
    { key: 'name', header: 'Nom complet', cell: (c) => <span className="font-medium text-slate-900">{c.fullName}</span> },
    { key: 'company', header: 'Raison sociale', cell: (c) => c.companyName || '—' },
    { key: 'phone', header: 'Téléphone', cell: (c) => c.phone },
    { key: 'email', header: 'Email', cell: (c) => c.email || '—' },
    { 
      key: 'type', 
      header: 'Type', 
      cell: (c) => (
        <span className={`inline-block px-2 py-0.5 text-xs font-semibold border ${c.type === 'B2B' ? 'text-blue-700 bg-blue-50 border-blue-200' : 'text-emerald-700 bg-emerald-50 border-emerald-200'}`}>
          {c.type}
        </span>
      ) 
    },
    { 
      key: 'actions', 
      header: '', 
      align: 'right',
      cell: (c) => (
        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button onClick={() => handleOpenEdit(c)} className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors">
            <Pencil className="w-4 h-4" />
          </button>
          <button onClick={() => handleDelete(c.id)} className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors">
            <Trash className="w-4 h-4" />
          </button>
        </div>
      )
    }
  ];

  if (error) {
    return <div className="p-4 bg-red-50 text-red-600 border border-red-200">{error}</div>;
  }

  return (
    <>
      <PageHeader 
        title="Clients B2B" 
        description="Gérez votre portefeuille de clients professionnels."
        actions={
          <Button onClick={handleOpenCreate} icon={<Plus className="w-4 h-4" />}>
            Nouveau Client
          </Button>
        }
      />
      
      <DataTable 
        data={customers} 
        columns={columns} 
        keyExtractor={(c) => c.id} 
        isLoading={isLoading}
      />

      <CustomerFormModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={fetchCustomers}
        initialData={editingCustomer}
      />
    </>
  );
}
