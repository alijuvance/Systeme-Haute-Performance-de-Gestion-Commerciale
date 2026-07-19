'use client';
import React, { useState } from 'react';
import { useCustomers } from '../hooks/useCustomers';
import { Customer } from '../schemas/customerSchema';
import { DataTable, ColumnDef } from '@/components/shared/DataTable';
import { PageHeader } from '@/components/shared/PageHeader';
import { Button } from '@/components/shared/Button';
import { Badge } from '@/components/shared/Badge';
import { Card } from '@/components/shared/Card';
import { Input } from '@/components/shared/Input';
import { SummaryCard } from '@/components/shared/SummaryCard';
import Drawer from '@/components/shared/Drawer';
import { Plus, Pencil, Trash, Download, Search, Users, CreditCard, Eye, Building2, User } from 'lucide-react';
import { CustomerFormModal } from './CustomerFormModal';
import { useToast } from '@/components/providers/ToastProvider';
import { exportToExcel } from '@/utils/exportToExcel';
import { formatCurrency } from '@/utils/formatters';

export function CustomersTable() {
  const { customers, isLoading, error, fetchCustomers, removeCustomer } = useCustomers();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | undefined>(undefined);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
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

  // Client-side filter
  const filteredCustomers = customers.filter(c =>
    (c.fullName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (c.companyName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (c.phone || '').includes(searchTerm)
  );

  const totalDebt = customers.reduce((sum, c) => sum + ((c as any).currentDebt || 0), 0);
  const b2bCount = customers.filter(c => c.type === 'B2B').length;

  const columns: ColumnDef<Customer>[] = [
    { 
      key: 'name', 
      header: 'Client', 
      cell: (c) => (
        <div className="flex items-center gap-3">
          <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-medium ${
            c.type === 'B2B' ? 'bg-indigo-50 text-indigo-600' : 'bg-emerald-50 text-emerald-600'
          }`}>
            {c.type === 'B2B' ? <Building2 className="w-4 h-4" /> : <User className="w-4 h-4" />}
          </div>
          <div>
            <span className="font-medium text-gray-900 block">{c.fullName}</span>
            {c.companyName && <span className="text-xs text-gray-500">{c.companyName}</span>}
          </div>
        </div>
      )
    },
    { key: 'phone', header: 'Téléphone', cell: (c) => <span className="text-gray-600">{c.phone || '—'}</span> },
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
      key: 'debt', 
      header: 'Encours', 
      align: 'right',
      cell: (c) => {
        const debt = (c as any).currentDebt || 0;
        return (
          <span className={`tabular-nums font-medium ${debt > 0 ? 'text-rose-600' : 'text-gray-400'}`}>
            {formatCurrency(debt)}
          </span>
        );
      }
    },
    { 
      key: 'actions', 
      header: '', 
      align: 'right',
      cell: (c) => (
        <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <button onClick={(e) => { e.stopPropagation(); setSelectedCustomer(c); }} className="p-1.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all">
            <Eye className="w-4 h-4" />
          </button>
          <button onClick={(e) => { e.stopPropagation(); handleOpenEdit(c); }} className="p-1.5 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all">
            <Pencil className="w-4 h-4" />
          </button>
          <button onClick={(e) => { e.stopPropagation(); handleDelete(c.id); }} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all">
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
      'Encours (MGA)': (c as any).currentDebt || 0
    }));
    exportToExcel(dataToExport, `Clients_${new Date().toISOString().split('T')[0]}`);
  };

  return (
    <>
      <PageHeader 
        title="Portefeuille Clients" 
        description="Gérez vos relations clients B2B et B2C."
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

      {/* Summary Widgets */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <SummaryCard
          title="Total Clients"
          value={customers.length}
          icon={<Users className="h-5 w-5" />}
          trend={{ value: 0, isPositive: true, label: 'comptes actifs' }}
        />
        <SummaryCard
          title="Clients B2B"
          value={b2bCount}
          icon={<Building2 className="h-5 w-5 text-indigo-500" />}
          trend={{ value: customers.length > 0 ? Math.round((b2bCount / customers.length) * 100) : 0, isPositive: true, label: 'du portefeuille' }}
        />
        <SummaryCard
          title="Créances Totales"
          value={formatCurrency(totalDebt)}
          icon={<CreditCard className="h-5 w-5 text-rose-500" />}
          trend={{ value: totalDebt > 0 ? totalDebt : 0, isPositive: false, label: 'à recouvrer' }}
        />
      </div>

      {/* Search */}
      <Card padding="md" className="mb-6">
        <Input
          label="Rechercher un client"
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Nom, entreprise, téléphone..."
          icon={<Search className="w-4 h-4" />}
        />
      </Card>
      
      <DataTable 
        data={filteredCustomers} 
        columns={columns} 
        keyExtractor={(c) => c.id} 
        isLoading={isLoading}
      />

      {/* Customer Profile Drawer */}
      <Drawer
        isOpen={!!selectedCustomer}
        onClose={() => setSelectedCustomer(null)}
        title="Profil Client"
        description={selectedCustomer?.fullName || ''}
        width="xl"
      >
        {selectedCustomer && (
          <div className="space-y-6">
            {/* Avatar + Name */}
            <div className="flex items-center gap-4">
              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-xl font-bold ${
                selectedCustomer.type === 'B2B' ? 'bg-indigo-100 text-indigo-600' : 'bg-emerald-100 text-emerald-600'
              }`}>
                {selectedCustomer.fullName?.charAt(0) || '?'}
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">{selectedCustomer.fullName}</h3>
                {selectedCustomer.companyName && (
                  <p className="text-sm text-gray-500">{selectedCustomer.companyName}</p>
                )}
                <Badge variant={selectedCustomer.type === 'B2B' ? 'info' : 'success'} className="mt-1">
                  {selectedCustomer.type}
                </Badge>
              </div>
            </div>

            {/* Info Cards */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                <p className="text-xs text-gray-500 mb-1">Téléphone</p>
                <p className="font-medium text-gray-900">{selectedCustomer.phone || '—'}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                <p className="text-xs text-gray-500 mb-1">Email</p>
                <p className="font-medium text-gray-900">{selectedCustomer.email || '—'}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                <p className="text-xs text-gray-500 mb-1">Adresse</p>
                <p className="font-medium text-gray-900">{selectedCustomer.address || '—'}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                <p className="text-xs text-gray-500 mb-1">Encours</p>
                <p className="font-bold text-rose-600 text-lg tabular-nums">
                  {formatCurrency((selectedCustomer as any).currentDebt || 0)}
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-2">
              <Button 
                variant="outline" 
                onClick={() => { setSelectedCustomer(null); handleOpenEdit(selectedCustomer); }} 
                icon={<Pencil className="w-4 h-4" />}
                className="flex-1"
              >
                Modifier
              </Button>
            </div>
          </div>
        )}
      </Drawer>

      <CustomerFormModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={fetchCustomers}
        initialData={editingCustomer}
      />
    </>
  );
}
