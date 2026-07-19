import { useState, useEffect } from 'react';
import { getKpis, getSalesChart, getRecentActivity, getLowStockAlerts, getTopProducts, getSalesByCategory, getDailySummary } from '../api/getDashboardData';
import { AnalyticsKpis } from '@/types';

export const useDashboard = () => {
  const [kpis, setKpis] = useState<AnalyticsKpis | null>(null);
  const [chartData, setChartData] = useState<any[]>([]);
  const [recentActivity, setRecentActivity] = useState<any[]>([]);
  const [lowStockAlerts, setLowStockAlerts] = useState<any[]>([]);
  const [topProducts, setTopProducts] = useState<any[]>([]);
  const [salesByCategory, setSalesByCategory] = useState<any[]>([]);
  const [dailySummary, setDailySummary] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [period, setPeriod] = useState<string>('all');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const filters: any = {};
        if (period !== 'all') {
          filters.period = period;
        }
        if (period === 'custom' && startDate && endDate) {
          filters.startDate = startDate;
          filters.endDate = endDate;
        }

        const [kpiData, chart, activity, alerts, topProds, catData, daily] = await Promise.all([
          getKpis(filters),
          getSalesChart(filters),
          getRecentActivity().catch(() => []),
          getLowStockAlerts().catch(() => []),
          getTopProducts().catch(() => []),
          getSalesByCategory(filters).catch(() => []),
          getDailySummary().catch(() => null),
        ]);
        
        setKpis(kpiData);
        setChartData(chart);
        setRecentActivity(activity);
        setLowStockAlerts(alerts);
        setTopProducts(topProds);
        setSalesByCategory(catData);
        setDailySummary(daily);
      } catch (err: any) {
        setError(err.message || 'Une erreur est survenue lors du chargement des données.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [period, startDate, endDate]);

  return { 
    kpis, chartData, recentActivity, lowStockAlerts, topProducts, salesByCategory, dailySummary,
    isLoading, error,
    period, setPeriod,
    startDate, setStartDate,
    endDate, setEndDate
  };
};
