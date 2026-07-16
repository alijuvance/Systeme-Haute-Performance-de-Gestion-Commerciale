'use client';
import React, { useState } from 'react';
import { useProducts } from '../hooks/useProducts';
import { Product } from '../schemas/productSchema';
import { DataTable, ColumnDef } from '@/components/shared/DataTable';
import { PageHeader } from '@/components/shared/PageHeader';
import { Button } from '@/components/shared/Button';
import { Badge } from '@/components/shared/Badge';
import { Plus, Pencil, Trash } from 'lucide-react';
import { formatCurrency } from '@/utils/formatters';
import { ProductFormModal } from './ProductFormModal';
import { useToast } from '@/components/providers/ToastProvider';

export function ProductsTable() {
  const { products, isLoading, error, fetchProducts, removeProduct } = useProducts();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | undefined>(undefined);
  const toast = useToast();

  const handleOpenCreate = () => {
    setEditingProduct(undefined);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (product: Product) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    const ok = await toast.confirm({
      title: 'Supprimer ce produit',
      message: 'Cette action est irréversible. Voulez-vous vraiment supprimer ce produit ?',
      variant: 'danger',
      confirmText: 'Supprimer',
    });
    if (ok) {
      await removeProduct(id);
      toast.success('Produit supprimé avec succès.');
    }
  };

  const columns: ColumnDef<Product>[] = [
    { key: 'ref', header: 'Référence', cell: (p) => <span className="font-medium text-gray-900">{p.sku}</span> },
    { key: 'name', header: 'Nom du produit', cell: (p) => <span className="text-gray-900">{p.name}</span> },
    { key: 'category', header: 'Catégorie', cell: (p) => <Badge variant="default">{p.categoryId || 'N/A'}</Badge> },
    { key: 'price', header: 'Prix de vente', align: 'right', cell: (p) => <span className="tabular-nums font-medium text-gray-900">{`${p.defaultPrice.toLocaleString()} Ar`}</span> },
    { key: 'cost', header: "Coût d'achat", align: 'right', cell: (p) => <span className="tabular-nums text-gray-500">{`${p.costPrice.toLocaleString()} Ar`}</span> },
    { 
      key: 'actions', 
      header: '', 
      align: 'right',
      cell: (p) => (
        <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <button onClick={() => handleOpenEdit(p)} className="p-1.5 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all">
            <Pencil className="w-4 h-4" />
          </button>
          <button onClick={() => handleDelete(p.id)} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all">
            <Trash className="w-4 h-4" />
          </button>
        </div>
      )
    }
  ];

  if (error) {
    return <div className="p-4 bg-red-50 text-red-600 rounded-xl text-sm mb-4">{error}</div>;
  }

  return (
    <>
      <PageHeader 
        title="Catalogue Produits" 
        description="Gérez les articles de votre catalogue et leurs prix par défaut."
        actions={
          <Button onClick={handleOpenCreate} icon={<Plus className="w-4 h-4" />}>
            Nouveau Produit
          </Button>
        }
      />
      
      <DataTable 
        data={products} 
        columns={columns} 
        keyExtractor={(p) => p.id} 
        isLoading={isLoading}
      />

      <ProductFormModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={fetchProducts}
        initialData={editingProduct}
      />
    </>
  );
}
