import React from 'react';
import { Product } from '../schemas/productSchema';
import { formatCurrency } from '@/utils/formatters';
import { Package, Pencil, Trash, Tag } from 'lucide-react';
import { Badge } from '@/components/shared/Badge';

interface ProductGridProps {
  products: Product[];
  isLoading: boolean;
  onEdit: (product: Product) => void;
  onDelete: (id: string) => void;
}

export function ProductGrid({ products, isLoading, onEdit, onDelete }: ProductGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
          <div key={i} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 h-48 animate-pulse">
            <div className="flex justify-between">
              <div className="h-10 w-10 bg-gray-100 rounded-xl" />
              <div className="h-6 w-20 bg-gray-100 rounded-full" />
            </div>
            <div className="mt-4 h-5 w-3/4 bg-gray-100 rounded" />
            <div className="mt-2 h-4 w-1/2 bg-gray-100 rounded" />
            <div className="mt-4 h-6 w-1/3 bg-gray-100 rounded" />
          </div>
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-2xl border border-gray-100 border-dashed">
        <Package className="mx-auto h-12 w-12 text-gray-300" />
        <h3 className="mt-4 text-sm font-semibold text-gray-900">Aucun produit</h3>
        <p className="mt-1 text-sm text-gray-500">Ajoutez des produits pour les voir apparaître ici.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((product) => (
        <div 
          key={product.id} 
          className="group bg-white rounded-2xl shadow-sm hover:shadow-md border border-gray-100 transition-all duration-300 overflow-hidden relative"
        >
          {/* Quick Actions (Hover) */}
          <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <button 
              onClick={() => onEdit(product)}
              className="p-1.5 bg-white shadow-sm text-gray-400 hover:text-indigo-600 rounded-lg hover:bg-indigo-50 transition-colors"
            >
              <Pencil className="w-4 h-4" />
            </button>
            <button 
              onClick={() => onDelete(product.id)}
              className="p-1.5 bg-white shadow-sm text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors"
            >
              <Trash className="w-4 h-4" />
            </button>
          </div>

          <div className="p-5">
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-500">
                <Package className="w-6 h-6" />
              </div>
            </div>
            
            <div className="mb-4">
              <h3 className="font-semibold text-gray-900 text-lg line-clamp-1" title={product.name}>
                {product.name}
              </h3>
              <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                <Tag className="w-3 h-3" /> {product.sku}
              </p>
            </div>

            <div className="flex items-end justify-between mt-6">
              <div>
                <p className="text-xs text-gray-400 mb-1">Prix de vente</p>
                <p className="font-bold text-gray-900 tabular-nums text-lg">
                  {formatCurrency(product.defaultPrice)}
                </p>
              </div>
              <Badge variant="default" className="text-xs">
                {product.categoryId || 'Sans cat.'}
              </Badge>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
