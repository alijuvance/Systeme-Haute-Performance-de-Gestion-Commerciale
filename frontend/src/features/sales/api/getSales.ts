import api from '@/api/axios';
import { PaginatedResponse } from '@/types';

export const getSales = async (params?: { page?: number; limit?: number; search?: string }): Promise<PaginatedResponse<any>> => {
  const response = await api.get('/api/sales', { params });
  return response.data;
};
