'use client';
import React, { useState, useMemo } from 'react';
import { useCustomers } from '../hooks/useCustomers';
import { Customer } from '../schemas/customerSchema';
import { DataTable, ColumnDef } from '@/components/shared/DataTable';
import { PageHeader } from '@/components/shared/PageHeader';
import { Button } from '@/components/shared/Button';
import { Badge } from '@/components/shared/Badge';
import { StatCard } from '@/components/shared/StatCard';
import Drawer from '@/components/shared/Drawer';
import { Plus, Pencil, Trash, Download, Users, DollarSign, CreditCard, Eye, Phone, Mail, MapPin } from 'lucide-react';
import { CustomerFormModal } from './CustomerFormModal';
import { useToast } from '@/components/providers/ToastProvider';
import { exportToExcel } from '@/utils/exportToExcel';
import { formatCurrency } from '@/utils/formatters';

export function CustomersTable() {
  const { customers, isLoading, error, fetchCustomers, removeCustomer } = useCustomers();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | undefined>(undefined);
  const [viewingCustomer, setViewingCustomer] = useState<Customer | null>(null);
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
    { 
      key: 'name', 
      header: 'Nom complet', 
      sortable: true,
      sortFn: (a, b) => a.fullName.localeCompare(b.fullName),
      cell: (c) => <span className="font-medium text-gray-900">{c.fullName}</span> 
    },
    { 
      key: 'company', 
      header: 'Raison sociale', 
      sortable: true,
      sortFn: (a, b) => (a.companyName || '').localeCompare(b.companyName || ''),
      cell: (c) => <span className="text-gray-600">{c.companyName || '—'}</span> 
    },
    { key: 'phone', header: 'Téléphone', cell: (c) => <span className="text-gray-600">{c.phone}</span> },
    { 
      key: 'debt', 
      header: 'Dette (MGA)', 
      align: 'right',
      sortable: true,
      sortFn: (a, b) => (a.currentDebt || 0) - (b.currentDebt || 0),
      cell: (c) => <span className={`font-medium ${c.currentDebt && c.currentDebt > 0 ? 'text-amber-600' : 'text-gray-600'}`}>{formatCurrency(c.currentDebt)}</span> 
    },
    { 
      key: 'type', 
      header: 'Type', 
      sortable: true,
      sortFn: (a, b) => a.type.localeCompare(b.type),
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
          <button onClick={() => setViewingCustomer(c)} className="p-1.5 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all" title="Aperçu rapide">
            <Eye className="w-4 h-4" />
          </button>
          <button onClick={() => handleOpenEdit(c)} className="p-1.5 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all" title="Modifier">
            <Pencil className="w-4 h-4" />
          </button>
          <button onClick={() => handleDelete(c.id)} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all" title="Supprimer">
            <Trash className="w-4 h-4" />
          </button>
        </div>
      )
    }
  ];

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

  const summary = useMemo(() => {
    const totalCustomers = customers.length;
    let totalDebt = 0;
    let totalCreditLimit = 0;
    let b2bCount = 0;

    customers.forEach(c => {
      totalDebt += c.currentDebt || 0;
      totalCreditLimit += c.creditLimit || 0;
      if (c.type === 'B2B') b2bCount++;
    });

    const avgCredit = totalCustomers > 0 ? totalCreditLimit / totalCustomers : 0;

    return { totalCustomers, totalDebt, avgCredit, b2bCount };
  }, [customers]);

  if (error) {
    return <div className="p-4 bg-red-50 text-red-600 rounded-xl text-sm mb-4">{error}</div>;
  }

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
      
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <StatCard
          title="Total Clients"
          value={summary.totalCustomers.toString()}
          icon={<Users className="h-4 w-4 text-gray-600" />}
          subtitle={`${summary.b2bCount} clients professionnels (B2B)`}
        />
        <StatCard
          title="Dette Totale"
          value={formatCurrency(summary.totalDebt)}
          icon={<DollarSign className="h-4 w-4 text-amber-600" />}
          iconBg="bg-amber-50"
          accentColor="#d97706"
        />
        <StatCard
          title="Limite de Crédit Moyenne"
          value={formatCurrency(summary.avgCredit)}
          icon={<CreditCard className="h-4 w-4 text-blue-600" />}
          iconBg="bg-blue-50"
          accentColor="#2563eb"
        />
      </div>

      <DataTable 
        data={customers} 
        columns={columns} 
        keyExtractor={(c) => c.id} 
        isLoading={isLoading}
        emptyMessage="Aucun client enregistré"
        emptyIcon={<Users className="w-6 h-6 text-gray-300" />}
        emptyActionLabel="Ajouter un client"
        onEmptyAction={handleOpenCreate}
      />

      {/* Customer Quick View Drawer */}
      <Drawer
        isOpen={!!viewingCustomer}
        onClose={() => setViewingCustomer(null)}
        title={viewingCustomer?.companyName || viewingCustomer?.fullName || 'Détails du client'}
        description={`Client ${viewingCustomer?.type === 'B2B' ? 'Professionnel' : 'Particulier'}`}
      >
        {viewingCustomer && (
          <div className="space-y-6">
            <div className="bg-gray-50 rounded-xl p-5 border border-gray-100">
              <h3 className="text-sm font-semibold text-gray-900 mb-4">Informations de contact</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <Phone className="w-4 h-4 text-gray-400" />
                  {viewingCustomer.phone || 'Non renseigné'}
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <Mail className="w-4 h-4 text-gray-400" />
                  {viewingCustomer.email || 'Non renseigné'}
                </div>
                <div className="flex items-start gap-3 text-sm text-gray-600">
                  <MapPin className="w-4 h-4 text-gray-400 mt-0.5" />
                  {viewingCustomer.address || 'Non renseigné'}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white border border-gray-100 rounded-xl p-4">
                <p className="text-xs text-gray-500 mb-1">Dette Actuelle</p>
                <p className={`text-lg font-semibold ${viewingCustomer.currentDebt && viewingCustomer.currentDebt > 0 ? 'text-amber-600' : 'text-emerald-600'}`}>
                  {formatCurrency(viewingCustomer.currentDebt)}
                </p>
              </div>
              <div className="bg-white border border-gray-100 rounded-xl p-4">
                <p className="text-xs text-gray-500 mb-1">Limite de Crédit</p>
                <p className="text-lg font-semibold text-gray-900">
                  {formatCurrency(viewingCustomer.creditLimit)}
                </p>
              </div>
            </div>

            {viewingCustomer.type === 'B2B' && viewingCustomer.taxId && (
              <div className="bg-white border border-gray-100 rounded-xl p-4">
                <p className="text-xs text-gray-500 mb-1">Numéro d'Identification Fiscale (NIF/STAT)</p>
                <p className="text-sm font-medium text-gray-900">{viewingCustomer.taxId}</p>
              </div>
            )}
            
            <div className="pt-4 border-t border-gray-100 flex gap-2">
              <Button className="flex-1" onClick={() => { setViewingCustomer(null); handleOpenEdit(viewingCustomer); }}>
                Modifier le profil
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
