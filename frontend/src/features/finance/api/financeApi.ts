import { Debt } from '../types';

export const fetchDebts = async (): Promise<Debt[]> => {
  const res = await fetch('/api/analytics/debts', {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
  });
  if (!res.ok) {
    throw new Error('Erreur lors de la récupération des créances');
  }
  return res.json();
};
