import api from '@/api/axios';

export const getSales = async (): Promise<any[]> => {
  const response = await api.get('/api/sales');
  return response.data;
};
