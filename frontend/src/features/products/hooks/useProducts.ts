import { useState, useEffect, useCallback } from 'react';
import { Product } from '../schemas/productSchema';
import { getProducts, deleteProduct } from '../api/productApi';

export const useProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getProducts();
      setProducts(data);
    } catch (err: any) {
      setError(err.message || 'Erreur lors du chargement des produits');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const removeProduct = async (id: string) => {
    try {
      await deleteProduct(id);
      setProducts(products.filter(p => p.id !== id));
      return true;
    } catch (err: any) {
      setError(err.message || 'Impossible de supprimer le produit');
      return false;
    }
  };

  return { products, isLoading, error, fetchProducts, removeProduct };
};
