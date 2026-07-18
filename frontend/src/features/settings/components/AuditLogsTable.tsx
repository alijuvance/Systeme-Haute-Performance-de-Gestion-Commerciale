'use client';
import React from 'react';
import { useAuditLogs } from '../hooks/useAuditLogs';
import { DataTable, ColumnDef } from '@/components/shared/DataTable';
import { PageHeader } from '@/components/shared/PageHeader';
import { Badge } from '@/components/shared/Badge';
import { Card } from '@/components/shared/Card';
import { Input } from '@/components/shared/Input';
import { Select } from '@/components/shared/Select';
import { formatDate } from '@/utils/formatters';
import { Search, History } from 'lucide-react';
import { AuditLog } from '../api/auditApi';

export function AuditLogsTable() {
  const {
    logs, isLoading, error,
    searchTerm, setSearchTerm,
    entityFilter, setEntityFilter,
    actionFilter, setActionFilter
  } = useAuditLogs();

  const columns: ColumnDef<AuditLog>[] = [
    {
      key: 'date',
      header: 'Date et Heure',
      cell: (l) => <span className="text-gray-500 tabular-nums text-sm">{formatDate(l.createdAt)}</span>
    },
    {
      key: 'user',
      header: 'Utilisateur',
      cell: (l) => (
        <div>
          <p className="font-medium text-gray-900">{l.user?.fullName || 'Système'}</p>
          <p className="text-xs text-gray-500">{l.user?.email || ''}</p>
        </div>
      )
    },
    {
      key: 'action',
      header: 'Action',
      cell: (l) => {
        const variant = l.action === 'CREATE' ? 'success' : l.action === 'DELETE' ? 'danger' : 'warning';
        return <Badge variant={variant}>{l.action}</Badge>;
      }
    },
    {
      key: 'entity',
      header: 'Module (Entité)',
      cell: (l) => <Badge variant="default">{l.entity}</Badge>
    },
    {
      key: 'details',
      header: 'Détails de l\'opération',
      cell: (l) => (
        <div className="max-w-md truncate text-xs text-gray-500 font-mono bg-gray-50 p-1.5 rounded border border-gray-100" title={l.details}>
          {l.details || l.entityId}
        </div>
      )
    }
  ];

  return (
    <>
      <PageHeader 
        title="Journal d'Audit" 
        description="Traçabilité complète des actions effectuées sur le système (Créations, Modifications, Suppressions)." 
        actions={
          <div className="flex items-center text-sm text-gray-500 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100">
            <History className="w-4 h-4 mr-2" /> Historique sécurisé
          </div>
        }
      />

      <Card padding="md" className="mb-6">
        <div className="flex flex-col md:flex-row gap-4 items-end">
          <div className="flex-1 min-w-[200px]">
            <Input
              label="Rechercher"
              type="text"
              placeholder="Chercher dans les détails..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              icon={<Search className="w-4 h-4" />}
            />
          </div>

          <div className="flex-1 min-w-[150px]">
            <Select
              label="Filtrer par module"
              value={entityFilter}
              onChange={(e) => setEntityFilter(e.target.value)}
              options={[
                { value: '', label: 'Tous les modules' },
                { value: 'INVOICE', label: 'Ventes & Factures' },
                { value: 'PURCHASE_ORDER', label: 'Achats' },
                { value: 'PRODUCT', label: 'Produits' },
                { value: 'STOCK', label: 'Stock' },
                { value: 'CUSTOMER', label: 'Clients' },
                { value: 'AUTH', label: 'Connexions' },
              ]}
            />
          </div>

          <div className="flex-1 min-w-[150px]">
            <Select
              label="Filtrer par action"
              value={actionFilter}
              onChange={(e) => setActionFilter(e.target.value)}
              options={[
                { value: '', label: 'Toutes les actions' },
                { value: 'CREATE', label: 'Création (CREATE)' },
                { value: 'UPDATE', label: 'Modification (UPDATE)' },
                { value: 'DELETE', label: 'Suppression (DELETE)' },
              ]}
            />
          </div>
        </div>
      </Card>

      {error && <div className="p-4 bg-red-50 text-red-600 rounded-xl text-sm mb-4">{error}</div>}

      <DataTable 
        data={logs} 
        columns={columns} 
        keyExtractor={(l) => l.id} 
        isLoading={isLoading} 
        emptyMessage="Aucun log d'audit trouvé."
      />
    </>
  );
}
