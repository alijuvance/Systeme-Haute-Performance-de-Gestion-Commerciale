import { useState, useEffect, useCallback } from 'react';
import api from '@/api/axios';

export const usePurchases = () => {
  const [data, setData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      const result = await api.get('/api/purchase-orders');
      setData(result.data);
    } catch (err: any) {
      setError(err.message || 'Une erreur est survenue lors du chargement.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const recordPayment = async (id: string, amount: number) => {
    try {
      await api.put(`/api/purchase-orders/${id}/pay`, { amount });
      await fetchData(); // Refresh list after payment
      return true;
    } catch (err: any) {
      const msg = err.response?.data?.message || err.message;
      alert(`Erreur: ${msg}`);
      return false;
    }
  };

  const receiveOrder = async (id: string, depotId: string) => {
    try {
      await api.put(`/api/purchase-orders/${id}/receive`, { receivingDepotId: depotId });
      await fetchData();
      return true;
    } catch (err: any) {
      const msg = err.response?.data?.message || err.message;
      alert(`Erreur: ${msg}`);
      return false;
    }
  };

  return { data, isLoading, error, refreshData: fetchData, recordPayment, receiveOrder };
};
