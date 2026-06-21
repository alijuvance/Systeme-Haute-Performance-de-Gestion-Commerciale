import api from '@/api/axios';

export const getSuppliers = async (): Promise<any[]> => {
  const response = await api.get('/api/suppliers');
  return response.data;
};
