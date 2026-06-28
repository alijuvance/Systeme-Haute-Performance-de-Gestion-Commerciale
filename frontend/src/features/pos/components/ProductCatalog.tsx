import React from 'react';
import { Product, Depot } from '../types';

interface ProductCatalogProps {
  products: Product[];
  depots: Depot[];
  selectedDepot: string;
  setSelectedDepot: (id: string) => void;
  addToCart: (product: Product) => void;
}

export const ProductCatalog: React.FC<ProductCatalogProps> = ({
  products,
  depots,
  selectedDepot,
  setSelectedDepot,
  addToCart
}) => {
  return (
    <div className="flex-1 bg-gray-50 p-6 overflow-y-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Caisse (Point of Sale)</h1>
        <select 
          value={selectedDepot} 
          onChange={e => setSelectedDepot(e.target.value)} 
          className="border rounded-lg p-2 font-medium"
        >
          <option value="">Choisir la Caisse (Dépôt)</option>
          {depots.map((d) => (
            <option key={d.id} value={d.id}>{d.name}</option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {products.map((p) => (
          <div 
            key={p.id} 
            onClick={() => addToCart(p)} 
            className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 cursor-pointer hover:shadow-md transition hover:border-blue-300"
          >
            <div className="h-24 bg-gray-100 rounded-lg mb-3 flex items-center justify-center text-gray-400">
              Pas d'image
            </div>
            <h3 className="font-semibold text-gray-800 line-clamp-2 text-sm">{p.name}</h3>
            <p className="text-blue-600 font-bold mt-2">
              {new Intl.NumberFormat('fr-MG', { style: 'currency', currency: 'MGA' }).format(p.defaultPrice)}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};
