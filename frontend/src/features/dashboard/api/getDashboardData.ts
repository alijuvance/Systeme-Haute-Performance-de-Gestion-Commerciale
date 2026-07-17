import api from '@/api/axios';
import { AnalyticsKpis } from '@/types';

interface DashboardFilters {
  period?: string;
  startDate?: string;
  endDate?: string;
}

export const getKpis = async (filters?: DashboardFilters): Promise<AnalyticsKpis> => {
  const response = await api.get('/api/analytics/kpis', { params: filters });
  return response.data;
};

export const getSalesChart = async (filters?: DashboardFilters): Promise<any[]> => {
  const response = await api.get('/api/analytics/sales-chart', { params: filters });
  return response.data;
};
