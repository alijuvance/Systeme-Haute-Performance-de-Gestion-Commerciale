import { useState, useEffect, useCallback } from 'react';
import { Customer } from '../schemas/customerSchema';
import { getCustomers, deleteCustomer } from '../api/customerApi';

export const useCustomers = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCustomers = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getCustomers();
      setCustomers(data);
    } catch (err: any) {
      setError(err.message || 'Erreur lors du chargement des clients');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);

  const removeCustomer = async (id: string) => {
    try {
      await deleteCustomer(id);
      setCustomers(prev => prev.filter(c => c.id !== id));
      return true;
    } catch (err: any) {
      setError(err.message || 'Impossible de supprimer le client');
      return false;
    }
  };

  return { customers, isLoading, error, fetchCustomers, removeCustomer };
};
