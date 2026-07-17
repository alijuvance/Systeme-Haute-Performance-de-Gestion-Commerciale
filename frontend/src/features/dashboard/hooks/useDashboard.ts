import { useState, useEffect } from 'react';
import { getKpis, getSalesChart } from '../api/getDashboardData';
import { AnalyticsKpis } from '@/types';

export const useDashboard = () => {
  const [kpis, setKpis] = useState<AnalyticsKpis | null>(null);
  const [chartData, setChartData] = useState<any[]>([]);
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

        const [kpiData, chart] = await Promise.all([
          getKpis(filters),
          getSalesChart(filters)
        ]);
        setKpis(kpiData);
        setChartData(chart);
      } catch (err: any) {
        setError(err.message || 'Une erreur est survenue lors du chargement des données.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [period, startDate, endDate]);

  return { 
    kpis, 
    chartData, 
    isLoading, 
    error,
    period,
    setPeriod,
    startDate,
    setStartDate,
    endDate,
    setEndDate
  };
};
