'use client';
import React, { useState, useMemo } from 'react';
import { useStocks } from '../hooks/useStocks';
import { DataTable, ColumnDef } from '@/components/shared/DataTable';
import { PageHeader } from '@/components/shared/PageHeader';
import { Button } from '@/components/shared/Button';
import { Modal } from '@/components/shared/Modal';
import { Input } from '@/components/shared/Input';
import { Card } from '@/components/shared/Card';
import { Badge } from '@/components/shared/Badge';
import { SummaryCard } from '@/components/shared/SummaryCard';
import SearchSelect from '@/components/shared/SearchSelect';
import { formatDate } from '@/utils/formatters';
import { Search, Plus, Warehouse, AlertCircle, Download, Package, AlertTriangle, Layers } from 'lucide-react';
import { StockLevel, Depot, Product, Category } from '@/types';
import { exportToExcel } from '@/utils/exportToExcel';

export function StocksTable() {
  const {
    data, depots, products, categories,
    selectedDepotId, setSelectedDepotId,
    searchTerm, setSearchTerm,
    isLoading, error,
    handleAddStock,
  } = useStocks();

  // Add stock modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [addDepotId, setAddDepotId] = useState('');
  const [addProductId, setAddProductId] = useState('');
  const [addQuantity, setAddQuantity] = useState(1);
  const [addReference, setAddReference] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [addError, setAddError] = useState<string | null>(null);

  const depotOptions = depots.map((d: Depot) => ({
    id: d.id,
    label: d.name,
    sublabel: d.location || '',
  }));

  const productOptions = products.map((p: Product) => {
    const catName = categories.find((c: Category) => c.id === p.categoryId)?.name || '';
    return {
      id: p.id,
      label: p.name,
      sublabel: `${p.sku || ''} — ${catName}`,
    };
  });

  const handleSubmitAdd = async () => {
    if (!addDepotId || !addProductId || addQuantity < 1) {
      setAddError('Veuillez remplir tous les champs obligatoires.');
      return;
    }
    try {
      setIsAdding(true);
      setAddError(null);
      await handleAddStock(addProductId, addDepotId, addQuantity, addReference || undefined);
      setIsModalOpen(false);
      setAddDepotId('');
      setAddProductId('');
      setAddQuantity(1);
      setAddReference('');
    } catch (err: any) {
      setAddError(err?.response?.data?.message || err?.message || "Erreur lors de l'ajout.");
    } finally {
      setIsAdding(false);
    }
  };

  const columns: ColumnDef<StockLevel>[] = [
    {
      key: 'product',
      header: 'Produit',
      cell: (s) => (
        <div>
          <span className="font-medium text-gray-900">{s.product?.name || '—'}</span>
          <p className="text-xs text-gray-500">{s.product?.sku || ''}</p>
        </div>
      ),
    },
    {
      key: 'category',
      header: 'Catégorie',
      cell: (s) => (
        <Badge variant="default">
          {s.product?.category?.name || '—'}
        </Badge>
      ),
    },
    {
      key: 'depot',
      header: 'Dépôt',
      cell: (s) => (
        <span className="flex items-center gap-1.5 text-sm text-gray-700">
          <Warehouse className="w-3.5 h-3.5 text-gray-400" />
          {s.depot?.name || '—'}
        </span>
      ),
    },
    {
      key: 'qty',
      header: 'Niveau de Stock',
      cell: (s) => {
        const alert = s.minAlertQuantity || 0;
        const maxRef = Math.max(alert * 3, s.quantity, 10);
        const pct = Math.min((s.quantity / maxRef) * 100, 100);
        const isLow = s.quantity <= alert && alert > 0;
        const isCritical = s.quantity === 0;
        const barColor = isCritical
          ? 'bg-rose-500'
          : isLow
            ? 'bg-amber-400'
            : 'bg-emerald-500';
        return (
          <div className="min-w-[160px]">
            <div className="flex items-center justify-between mb-1">
              <span className="tabular-nums font-semibold text-gray-900 text-sm">{s.quantity}</span>
              {isLow && <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />}
            </div>
            <div className="w-full bg-gray-100 rounded-full h-1.5">
              <div className={`${barColor} h-1.5 rounded-full transition-all duration-500`} style={{ width: `${pct}%` }} />
            </div>
            {alert > 0 && <p className="text-[10px] text-gray-400 mt-0.5">Seuil: {alert}</p>}
          </div>
        );
      },
    },
    {
      key: 'status',
      header: 'État',
      cell: (s) => {
        const alert = s.minAlertQuantity || 0;
        const isCritical = s.quantity === 0;
        const isLow = s.quantity <= alert && alert > 0;
        return (
          <Badge variant={isCritical ? 'danger' : isLow ? 'warning' : 'success'}>
            {isCritical ? 'Rupture' : isLow ? 'Stock bas' : 'Normal'}
          </Badge>
        );
      },
    },
    {
      key: 'lastAdded',
      header: 'Dernier ajout',
      cell: (s) => <span className="text-xs text-gray-500 tabular-nums">{formatDate(s.lastAddedAt)}</span>,
    },
  ];

  const handleExport = () => {
    const dataToExport = data.map(s => ({
      'Produit': s.product?.name || '—',
      'SKU': s.product?.sku || '—',
      'Catégorie': s.product?.category?.name || '—',
      'Dépôt': s.depot?.name || '—',
      'Quantité': s.quantity,
      'Seuil Alerte': s.minAlertQuantity || 0,
      'Statut': s.quantity <= (s.minAlertQuantity || 0) && (s.minAlertQuantity || 0) > 0 ? 'Stock bas' : 'Normal',
      'Dernier Ajout': formatDate(s.lastAddedAt)
    }));
    exportToExcel(dataToExport, `Stocks_${new Date().toISOString().split('T')[0]}`);
  };

  if (error) {
    return (
      <div className="p-4 bg-red-50 text-red-600 rounded-xl flex items-center gap-2 mb-4 text-sm">
        <AlertCircle className="w-4 h-4" /> {error}
      </div>
    );
  }

  return (
    <>
      <PageHeader 
        title="Gestion des Stocks" 
        description="Vue d'ensemble de vos niveaux de stock par dépôt." 
        actions={
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleExport} icon={<Download className="w-4 h-4" />}>
              Exporter
            </Button>
            <Button onClick={() => setIsModalOpen(true)} icon={<Plus className="w-4 h-4" />}>
              Ajouter au stock
            </Button>
          </div>
        }
      />

      {/* Stock Summary Widgets */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <SummaryCard
          title="Articles en Stock"
          value={data.length}
          icon={<Layers className="h-5 w-5" />}
          trend={{ value: 0, isPositive: true, label: 'références' }}
        />
        <SummaryCard
          title="Alertes Stock Bas"
          value={data.filter(s => s.quantity <= (s.minAlertQuantity || 0) && (s.minAlertQuantity || 0) > 0).length}
          icon={<AlertTriangle className="h-5 w-5 text-amber-500" />}
          trend={{ value: data.filter(s => s.quantity <= (s.minAlertQuantity || 0) && (s.minAlertQuantity || 0) > 0).length, isPositive: false, label: 'produits à réapprovisionner' }}
        />
        <SummaryCard
          title="Ruptures de Stock"
          value={data.filter(s => s.quantity === 0).length}
          icon={<AlertCircle className="h-5 w-5 text-rose-500" />}
          trend={{ value: data.filter(s => s.quantity === 0).length, isPositive: false, label: 'produits en rupture' }}
        />
      </div>

      {/* Filter bar */}
      <Card padding="md" className="mb-6">
        <div className="flex flex-col md:flex-row gap-4 items-end">
          <div className="flex-1 min-w-[200px]">
            <SearchSelect
              label="Filtrer par dépôt"
              placeholder="Tous les dépôts..."
              options={depotOptions}
              value={selectedDepotId}
              onChange={setSelectedDepotId}
            />
          </div>
          <div className="flex-1 min-w-[200px]">
            <Input
              label="Rechercher"
              type="text"
              placeholder="Nom du produit, SKU..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              icon={<Search className="w-4 h-4" />}
            />
          </div>
        </div>
      </Card>

      {/* Table */}
      <DataTable
        data={data}
        columns={columns}
        keyExtractor={(s) => s.id}
        isLoading={isLoading}
        emptyMessage="Aucun stock trouvé. Ajoutez des produits à un dépôt."
      />

      {/* Add Stock Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Ajouter un produit au stock">
        <div className="space-y-4">
          {addError && (
            <div className="flex items-start gap-2 p-3 bg-red-50 text-red-700 text-sm rounded-lg">
              <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
              {addError}
            </div>
          )}

          <SearchSelect
            label="Dépôt de destination"
            placeholder="Choisir un dépôt..."
            options={depotOptions}
            value={addDepotId}
            onChange={setAddDepotId}
            required
          />

          <SearchSelect
            label="Produit"
            placeholder="Rechercher un produit..."
            options={productOptions}
            value={addProductId}
            onChange={setAddProductId}
            required
          />

          <Input
            label="Quantité *"
            type="number"
            min={1}
            value={addQuantity}
            onChange={(e) => setAddQuantity(parseInt(e.target.value) || 1)}
          />

          <Input
            label="Référence / Motif"
            type="text"
            placeholder="Ex: Réception fournisseur, Inventaire initial..."
            value={addReference}
            onChange={(e) => setAddReference(e.target.value)}
          />

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 mt-6">
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>Annuler</Button>
            <Button onClick={handleSubmitAdd} isLoading={isAdding}>Ajouter</Button>
          </div>
        </div>
      </Modal>
    </>
  );
}
