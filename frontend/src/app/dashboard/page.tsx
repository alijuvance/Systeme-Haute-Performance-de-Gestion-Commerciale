'use client';

import React from 'react';
import { useDashboard } from '@/features/dashboard/hooks/useDashboard';
import { DashboardKpis } from '@/features/dashboard/components/DashboardKpis';
import { DashboardCharts } from '@/features/dashboard/components/DashboardCharts';
import { DashboardFilters } from '@/features/dashboard/components/DashboardFilters';
import { PageHeader } from '@/components/shared/PageHeader';

export default function DashboardPage() {
  const { 
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
  } = useDashboard();

  return (
    <>
      <PageHeader
        title="Tableau de bord"
        description="Vue d'ensemble de l'activité commerciale."
      />

      {error && (
        <div className="p-4 mb-4 text-sm text-red-700 bg-red-50 border border-red-200">
          <span className="font-medium">Erreur :</span> {error}
        </div>
      )}

      <DashboardFilters
        period={period}
        setPeriod={setPeriod}
        startDate={startDate}
        setStartDate={setStartDate}
        endDate={endDate}
        setEndDate={setEndDate}
      />

      <DashboardKpis kpis={kpis} isLoading={isLoading} />
      <div className="mt-6">
        <DashboardCharts chartData={chartData} isLoading={isLoading} />
      </div>
    </>
  );
}
