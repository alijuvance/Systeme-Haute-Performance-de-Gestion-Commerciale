import api from '@/api/axios';
import { PaginatedResponse } from '@/types';

export const getPurchases = async (params?: { page?: number; limit?: number; search?: string }): Promise<PaginatedResponse<any>> => {
  const response = await api.get('/api/purchase-orders', { params });
  return response.data;
};
