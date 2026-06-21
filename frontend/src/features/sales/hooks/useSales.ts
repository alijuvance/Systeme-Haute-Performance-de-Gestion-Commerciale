import { useState, useEffect } from 'react';
import { getSales } from '../api/getSales';

export const useSales = () => {
  const [sales, setSales] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSales = async () => {
      try {
        setIsLoading(true);
        const data = await getSales();
        setSales(data);
      } catch (err: any) {
        setError(err.message || 'Une erreur est survenue lors du chargement des ventes.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchSales();
  }, []);

  return { sales, isLoading, error };
};
