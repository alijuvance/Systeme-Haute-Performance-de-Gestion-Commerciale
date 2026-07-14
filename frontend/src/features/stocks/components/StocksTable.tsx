'use client';
import React, { useState } from 'react';
import { useStocks } from '../hooks/useStocks';
import { DataTable, ColumnDef } from '@/components/shared/DataTable';
import { PageHeader } from '@/components/shared/PageHeader';
import { Button } from '@/components/shared/Button';
import { Modal } from '@/components/shared/Modal';
import { Input } from '@/components/shared/Input';
import { Card } from '@/components/shared/Card';
import { Badge } from '@/components/shared/Badge';
import SearchSelect from '@/components/shared/SearchSelect';
import { formatDate } from '@/utils/formatters';
import { Search, Plus, Warehouse, AlertCircle } from 'lucide-react';
import { StockLevel, Depot, Product, Category } from '@/types';

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
      header: 'Quantité',
      align: 'right' as const,
      cell: (s) => <span className="tabular-nums font-semibold text-gray-900">{s.quantity}</span>,
    },
    {
      key: 'status',
      header: 'État',
      cell: (s) => {
        const alert = s.minAlertQuantity || 0;
        const isLow = s.quantity <= alert && alert > 0;
        return (
          <Badge variant={isLow ? 'danger' : 'success'}>
            {isLow ? 'Stock bas' : 'Normal'}
          </Badge>
        );
      },
    },
    {
      key: 'firstAdded',
      header: '1er ajout',
      cell: (s) => <span className="text-xs text-gray-500 tabular-nums">{formatDate(s.firstAddedAt)}</span>,
    },
    {
      key: 'lastAdded',
      header: 'Dernier ajout',
      cell: (s) => <span className="text-xs text-gray-500 tabular-nums">{formatDate(s.lastAddedAt)}</span>,
    },
  ];

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
        title="Catalogue & Stock" 
        description="Gérez vos stocks par dépôt. Recherchez, filtrez et ajoutez des produits." 
        actions={
          <Button onClick={() => setIsModalOpen(true)} icon={<Plus className="w-4 h-4" />}>
            Ajouter au stock
          </Button>
        }
      />

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
