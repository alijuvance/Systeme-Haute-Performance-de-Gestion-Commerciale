import { useState, useEffect } from 'react';
import { getStocks } from '../api/getStocks';

export const useStocks = () => {
  const [data, setData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const result = await getStocks();
        setData(result);
      } catch (err: any) {
        setError(err.message || 'Une erreur est survenue lors du chargement.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  return { data, isLoading, error };
};
