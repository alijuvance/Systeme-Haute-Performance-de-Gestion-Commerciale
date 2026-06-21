import api from '@/api/axios';
import { AnalyticsKpis } from '@/types';

export const getKpis = async (): Promise<AnalyticsKpis> => {
  const response = await api.get('/api/analytics/kpis');
  return response.data;
};

export const getSalesChart = async (): Promise<any[]> => {
  const response = await api.get('/api/analytics/sales-chart');
  return response.data;
};
