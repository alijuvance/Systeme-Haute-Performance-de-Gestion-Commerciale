'use client';
import React, { useState } from 'react';
import { useCustomers } from '../hooks/useCustomers';
import { Customer } from '../schemas/customerSchema';
import { DataTable, ColumnDef } from '@/components/shared/DataTable';
import { PageHeader } from '@/components/shared/PageHeader';
import { Button } from '@/components/shared/Button';
import { Badge } from '@/components/shared/Badge';
import { Plus, Pencil, Trash, Download } from 'lucide-react';
import { CustomerFormModal } from './CustomerFormModal';
import { useToast } from '@/components/providers/ToastProvider';
import { exportToExcel } from '@/utils/exportToExcel';

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
    { key: 'name', header: 'Nom complet', cell: (c) => <span className="font-medium text-gray-900">{c.fullName}</span> },
    { key: 'company', header: 'Raison sociale', cell: (c) => <span className="text-gray-600">{c.companyName || '—'}</span> },
    { key: 'phone', header: 'Téléphone', cell: (c) => <span className="text-gray-600">{c.phone}</span> },
    { key: 'email', header: 'Email', cell: (c) => <span className="text-gray-600">{c.email || '—'}</span> },
    { 
      key: 'type', 
      header: 'Type', 
      cell: (c) => (
        <Badge variant={c.type === 'B2B' ? 'info' : 'success'}>
          {c.type}
        </Badge>
      ) 
    },
    { 
      key: 'actions', 
      header: '', 
      align: 'right',
      cell: (c) => (
        <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <button onClick={() => handleOpenEdit(c)} className="p-1.5 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all">
            <Pencil className="w-4 h-4" />
          </button>
          <button onClick={() => handleDelete(c.id)} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all">
            <Trash className="w-4 h-4" />
          </button>
        </div>
      )
    }
  ];

  if (error) {
    return <div className="p-4 bg-red-50 text-red-600 rounded-xl text-sm mb-4">{error}</div>;
  }

  const handleExport = () => {
    const dataToExport = customers.map(c => ({
      'Nom Complet': c.fullName,
      'Raison Sociale': c.companyName || '—',
      'Téléphone': c.phone,
      'Email': c.email || '—',
      'Type': c.type,
      'Limite de Crédit (MGA)': c.creditLimit,
      'Dette Actuelle (MGA)': c.currentDebt
    }));
    exportToExcel(dataToExport, `Clients_${new Date().toISOString().split('T')[0]}`);
  };

  return (
    <>
      <PageHeader 
        title="Clients B2B" 
        description="Gérez votre portefeuille de clients professionnels."
        actions={
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleExport} icon={<Download className="w-4 h-4" />}>
              Exporter
            </Button>
            <Button onClick={handleOpenCreate} icon={<Plus className="w-4 h-4" />}>
              Nouveau Client
            </Button>
          </div>
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
