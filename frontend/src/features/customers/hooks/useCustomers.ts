import { useState, useEffect } from 'react';
import { getCustomers } from '../api/getCustomers';

export const useCustomers = () => {
  const [data, setData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const result = await getCustomers();
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
