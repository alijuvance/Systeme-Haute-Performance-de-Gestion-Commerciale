import { useState, useEffect, useCallback } from 'react';
import { Supplier } from '../schemas/supplierSchema';
import { getSuppliers, deleteSupplier } from '../api/supplierApi';

export const useSuppliers = () => {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSuppliers = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getSuppliers();
      setSuppliers(data);
    } catch (err: any) {
      setError(err.message || 'Erreur lors du chargement des fournisseurs');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSuppliers();
  }, [fetchSuppliers]);

  const removeSupplier = async (id: string) => {
    try {
      await deleteSupplier(id);
      setSuppliers(prev => prev.filter(s => s.id !== id));
      return true;
    } catch (err: any) {
      setError(err.message || 'Impossible de supprimer le fournisseur');
      return false;
    }
  };

  return { suppliers, isLoading, error, fetchSuppliers, removeSupplier };
};
