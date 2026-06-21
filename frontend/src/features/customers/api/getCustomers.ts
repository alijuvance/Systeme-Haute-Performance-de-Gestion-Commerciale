import api from '@/api/axios';

export const getCustomers = async (): Promise<any[]> => {
  const response = await api.get('/api/customers');
  return response.data;
};
