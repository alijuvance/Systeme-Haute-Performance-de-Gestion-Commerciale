import { useState, useEffect, useCallback } from 'react';
import { getStocks, getDepots, addStockMovement } from '../api/getStocks';
import api from '@/api/axios';
import { useToast } from '@/components/providers/ToastProvider';
import { StockLevel, Depot, Product, Category } from '@/types';

export const useStocks = () => {
  const [data, setData] = useState<StockLevel[]>([]);
  const [depots, setDepots] = useState<Depot[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedDepotId, setSelectedDepotId] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const toast = useToast();

  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const depotFilter = selectedDepotId || undefined;
      const result = await getStocks(depotFilter);
      setData(result);
    } catch (err: any) {
      setError(err.message || 'Erreur de chargement.');
    } finally {
      setIsLoading(false);
    }
  }, [selectedDepotId]);

  useEffect(() => {
    const loadRefs = async () => {
      try {
        const [depRes, prodRes, catRes] = await Promise.all([
          getDepots(),
          api.get('/api/products', { params: { limit: 100 } }),
          api.get('/api/categories'),
        ]);
        setDepots(depRes);
        // Extraire .data du format paginé { data, meta }
        const prodData = prodRes.data?.data || prodRes.data || [];
        setProducts(prodData);
        setCategories(catRes.data || []);
      } catch (e: any) {
        toast.error(e.response?.data?.message || e.message || 'Erreur lors du chargement des références');
        console.error('Erreur chargement refs:', e);
      }
    };
    loadRefs();
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const filteredData = data.filter((item) => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return (
      item.product?.name?.toLowerCase().includes(term) ||
      item.product?.sku?.toLowerCase().includes(term) ||
      item.depot?.name?.toLowerCase().includes(term)
    );
  });

  const handleAddStock = async (productId: string, depotId: string, quantity: number, reference?: string) => {
    try {
      await addStockMovement({
        type: 'IN',
        productId,
        depotId,
        quantityChanged: quantity,
        reference,
      });
      await fetchData();
      toast.success('Stock ajouté avec succès');
    } catch (err: any) {
      toast.error(err.response?.data?.message || err.message || 'Erreur lors de l\'ajout au stock');
      throw err;
    }
  };

  return {
    data: filteredData,
    depots,
    products,
    categories,
    selectedDepotId,
    setSelectedDepotId,
    searchTerm,
    setSearchTerm,
    isLoading,
    error,
    handleAddStock,
    refreshData: fetchData,
  };
};
