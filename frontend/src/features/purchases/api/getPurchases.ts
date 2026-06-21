import api from '@/api/axios';

export const getPurchases = async (): Promise<any[]> => {
  const response = await api.get('/api/purchases');
  return response.data;
};
