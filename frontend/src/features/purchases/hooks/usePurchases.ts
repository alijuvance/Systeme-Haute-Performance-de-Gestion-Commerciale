import { useState, useEffect, useCallback } from 'react';
import api from '@/api/axios';
import { useToast } from '@/components/providers/ToastProvider';
import { Purchase } from '@/types';

export const usePurchases = () => {
  const [data, setData] = useState<Purchase[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const toast = useToast();

  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      const result = await api.get('/api/purchase-orders', { params: { limit: 100 } });
      // Le backend retourne maintenant { data, meta }
      const responseData = result.data;
      setData(responseData.data || responseData);
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
      toast.error(msg);
      return false;
    }
  };

  const receiveOrder = async (id: string, payload: any) => {
    try {
      await api.put(`/api/purchase-orders/${id}/receive`, payload);
      await fetchData();
      return true;
    } catch (err: any) {
      const msg = err.response?.data?.message || err.message;
      toast.error(msg);
      return false;
    }
  };

  return { data, isLoading, error, refreshData: fetchData, recordPayment, receiveOrder };
};
