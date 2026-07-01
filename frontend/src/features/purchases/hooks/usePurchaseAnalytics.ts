import { useState, useEffect } from 'react';
import api from '@/api/axios';

export interface PurchaseKPIs {
  monthSpent: number;
  pendingReceiptCount: number;
  totalUnpaidAmount: number;
  activeOrdersCount: number;
}

export const usePurchaseAnalytics = () => {
  const [kpis, setKpis] = useState<PurchaseKPIs | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchKPIs = async () => {
    try {
      setIsLoading(true);
      const res = await api.get('/api/purchase-orders/kpis');
      setKpis(res.data);
    } catch (err: any) {
      setError(err.message || 'Erreur lors du chargement des analytiques d\'achats.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchKPIs();
  }, []);

  return { kpis, isLoading, error, refreshKPIs: fetchKPIs };
};
