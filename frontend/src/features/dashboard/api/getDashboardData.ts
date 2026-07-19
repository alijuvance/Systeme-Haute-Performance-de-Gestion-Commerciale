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

export const getRecentActivity = async (): Promise<any[]> => {
  const response = await api.get('/api/analytics/recent-activity');
  return response.data;
};

export const getLowStockAlerts = async (): Promise<any[]> => {
  const response = await api.get('/api/analytics/low-stock-alerts');
  return response.data;
};

export const getTopProducts = async (): Promise<any[]> => {
  const response = await api.get('/api/analytics/top-products');
  return response.data;
};

export const getSalesByCategory = async (filters?: DashboardFilters): Promise<any[]> => {
  const response = await api.get('/api/analytics/sales-by-category', { params: filters });
  return response.data;
};

export const getDailySummary = async (): Promise<any> => {
  const response = await api.get('/api/analytics/daily-summary');
  return response.data;
};
