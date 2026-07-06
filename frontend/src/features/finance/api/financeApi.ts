import { Debt } from '../types';
import Cookies from 'js-cookie';

export const fetchDebts = async (): Promise<Debt[]> => {
  const res = await fetch('/api/analytics/debts', {
    headers: { Authorization: `Bearer ${Cookies.get('token')}` }
  });
  if (!res.ok) {
    throw new Error('Erreur lors de la récupération des créances');
  }
  return res.json();
};