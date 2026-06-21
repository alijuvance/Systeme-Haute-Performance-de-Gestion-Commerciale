import api from '@/api/axios';

export const getStocks = async (): Promise<any[]> => {
  const response = await api.get('/api/stocks');
  return response.data;
};
