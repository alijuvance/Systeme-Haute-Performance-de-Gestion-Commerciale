import React, { useState, useMemo } from 'react';
import { Product, Depot } from '../types';
import { Search, PackageOpen } from 'lucide-react';
import { Input } from '@/components/shared/Input';

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
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Extract unique categories
  const categories = useMemo(() => {
    const cats = new Set<string>();
    products.forEach(p => {
      if (p.category?.name) cats.add(p.category.name);
    });
    return Array.from(cats).sort();
  }, [products]);

  // Filter products
  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            (p.sku && p.sku.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesCat = selectedCategory === 'all' || p.category?.name === selectedCategory;
      return matchesSearch && matchesCat;
    });
  }, [products, searchTerm, selectedCategory]);

  return (
    <div className="flex-1 bg-gray-50/50 p-6 overflow-y-auto flex flex-col h-full">
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Catalogue de Vente</h1>
          <p className="text-sm text-gray-500 mt-1">Sélectionnez les produits pour le ticket de caisse</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="w-64">
            <Input
              type="text"
              placeholder="Rechercher un produit..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              icon={<Search className="w-4 h-4" />}
            />
          </div>
          <select 
            value={selectedDepot} 
            onChange={e => setSelectedDepot(e.target.value)} 
            className="border-gray-200 border rounded-xl px-4 py-2 text-sm font-medium focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
          >
            <option value="">Choisir la Caisse (Dépôt)</option>
            {depots.map((d) => (
              <option key={d.id} value={d.id}>{d.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Category Pills */}
      {categories.length > 0 && (
        <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2 scrollbar-hide">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
              selectedCategory === 'all' 
                ? 'bg-gray-900 text-white shadow-sm' 
                : 'bg-white text-gray-600 border border-gray-200 hover:border-gray-300 hover:bg-gray-50'
            }`}
          >
            Toutes les catégories
          </button>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                selectedCategory === cat 
                  ? 'bg-indigo-600 text-white shadow-sm' 
                  : 'bg-white text-gray-600 border border-gray-200 hover:border-gray-300 hover:bg-gray-50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      )}

      {/* Product Grid */}
      {filteredProducts.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <PackageOpen className="w-8 h-8 text-gray-300" />
          </div>
          <h3 className="text-lg font-medium text-gray-900">Aucun produit trouvé</h3>
          <p className="text-sm">Essayez de modifier votre recherche ou catégorie.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 pb-10">
          {filteredProducts.map((p) => (
            <div 
              key={p.id} 
              onClick={() => addToCart(p)} 
              className="group bg-white p-4 rounded-2xl shadow-sm border border-gray-100 cursor-pointer hover:shadow-md hover:border-indigo-200 transition-all duration-200 flex flex-col h-full"
            >
              <div className="h-32 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl mb-4 flex flex-col items-center justify-center text-gray-400 group-hover:from-indigo-50/50 group-hover:to-indigo-100/50 transition-colors">
                <PackageOpen className="w-8 h-8 mb-2 opacity-20 group-hover:text-indigo-600 group-hover:opacity-60 transition-all" />
                <span className="text-[10px] uppercase tracking-wider font-semibold opacity-50">{p.sku || 'N/A'}</span>
              </div>
              <div className="flex-1 flex flex-col justify-between">
                <div>
                  {p.category?.name && (
                    <span className="text-[10px] font-semibold text-indigo-600 tracking-wider uppercase mb-1 block">
                      {p.category.name}
                    </span>
                  )}
                  <h3 className="font-semibold text-gray-800 line-clamp-2 leading-tight text-sm group-hover:text-indigo-900 transition-colors">
                    {p.name}
                  </h3>
                </div>
                <div className="mt-3 flex items-end justify-between">
                  <p className="text-indigo-600 font-bold text-lg tabular-nums">
                    {new Intl.NumberFormat('fr-MG', { style: 'currency', currency: 'MGA', maximumFractionDigits: 0 }).format(p.defaultPrice)}
                  </p>
                  {p.stockQuantity !== undefined && (
                    <span className={`text-[11px] font-medium px-2 py-1 rounded-md ${p.stockQuantity > 0 ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'}`}>
                      {p.stockQuantity} en stock
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
