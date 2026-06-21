'use client';
import React, { useState } from 'react';
import { useProducts } from '../hooks/useProducts';
import { Product } from '../schemas/productSchema';
import { DataTable, ColumnDef } from '@/components/shared/DataTable';
import { PageHeader } from '@/components/shared/PageHeader';
import { Button } from '@/components/shared/Button';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import { formatCurrency } from '@/utils/formatters';
import { ProductFormModal } from './ProductFormModal';

export function ProductsTable() {
  const { products, isLoading, error, fetchProducts, removeProduct } = useProducts();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | undefined>(undefined);

  const handleOpenCreate = () => {
    setEditingProduct(undefined);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (product: Product) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Voulez-vous vraiment supprimer ce produit ?')) {
      await removeProduct(id);
    }
  };

  const columns: ColumnDef<Product>[] = [
    { key: 'ref', header: 'Référence', cell: (p) => <span className="font-medium text-slate-900">{p.reference}</span> },
    { key: 'name', header: 'Nom du produit', cell: (p) => p.name },
    { key: 'price', header: 'Prix par défaut', align: 'right', cell: (p) => formatCurrency(p.defaultPrice) },
    { key: 'alert', header: 'Alerte stock', align: 'right', cell: (p) => p.minimumStockAlert },
    { 
      key: 'actions', 
      header: '', 
      align: 'right',
      cell: (p) => (
        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button onClick={() => handleOpenEdit(p)} className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors">
            <Edit2 className="w-4 h-4" />
          </button>
          <button onClick={() => handleDelete(p.id)} className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors">
            <Trash2 className="w-4 h-4" />
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
