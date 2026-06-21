import { useState, useEffect } from 'react';
import { getKpis, getSalesChart } from '../api/getDashboardData';
import { AnalyticsKpis } from '@/types';

export const useDashboard = () => {
  const [kpis, setKpis] = useState<AnalyticsKpis | null>(null);
  const [chartData, setChartData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [kpiData, chart] = await Promise.all([
          getKpis(),
          getSalesChart()
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
  }, []);

  return { kpis, chartData, isLoading, error };
};
