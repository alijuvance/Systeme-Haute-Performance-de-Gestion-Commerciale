import { useState, useEffect } from 'react';
import { Debt } from '../types';
import { fetchDebts } from '../api/financeApi';

export const useDebts = () => {
  const [debts, setDebts] = useState<Debt[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadDebts = async () => {
      try {
        setLoading(true);
        const data = await fetchDebts();
        setDebts(data);
        setError(null);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    loadDebts();
  }, []);

  const totalDebt = debts.reduce((acc, d) => acc + (d.totalAmount - d.amountPaid), 0);

  return { debts, loading, error, totalDebt };
};
