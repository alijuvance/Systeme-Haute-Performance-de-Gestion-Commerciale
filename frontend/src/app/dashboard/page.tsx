'use client';

import React from 'react';
import { useDashboard } from '@/features/dashboard/hooks/useDashboard';
import { DashboardKpis } from '@/features/dashboard/components/DashboardKpis';
import { DashboardCharts } from '@/features/dashboard/components/DashboardCharts';
import { DashboardFilters } from '@/features/dashboard/components/DashboardFilters';
import { PageHeader } from '@/components/shared/PageHeader';
import { ActivityFeed } from '@/components/shared/ActivityFeed';
import { useAuditLogs } from '@/features/settings/hooks/useAuditLogs';
import { Card } from '@/components/shared/Card';
import { ShoppingCart, Package, Users, Settings } from 'lucide-react';
import { formatDate } from '@/utils/formatters';

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

  const { logs, isLoading: isLogsLoading } = useAuditLogs();

  // Transform logs to ActivityItem
  const activityItems = logs.slice(0, 5).map(log => {
    let icon = <Settings className="w-4 h-4" />;
    let iconBg = 'bg-gray-50';
    let iconColor = 'text-gray-500';

    if (log.entity === 'INVOICE') {
      icon = <ShoppingCart className="w-4 h-4" />;
      iconBg = 'bg-emerald-50';
      iconColor = 'text-emerald-500';
    } else if (log.entity === 'PRODUCT' || log.entity === 'STOCK') {
      icon = <Package className="w-4 h-4" />;
      iconBg = 'bg-indigo-50';
      iconColor = 'text-indigo-500';
    } else if (log.entity === 'CUSTOMER') {
      icon = <Users className="w-4 h-4" />;
      iconBg = 'bg-amber-50';
      iconColor = 'text-amber-500';
    }

    return {
      id: log.id,
      title: `${log.action} sur ${log.entity} par ${log.user?.fullName || 'Système'}`,
      description: log.details?.substring(0, 50) + (log.details?.length > 50 ? '...' : ''),
      timestamp: formatDate(log.createdAt),
      icon,
      iconBg,
      iconColor
    };
  });

  return (
    <>
      <PageHeader
        title="Command Center"
        description="Vue d'ensemble de l'activité commerciale en temps réel."
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
      
      <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <DashboardCharts chartData={chartData} isLoading={isLoading} />
        </div>
        <div>
          <Card title="Activités Récentes" padding="md" className="h-full">
            {isLogsLoading ? (
              <div className="flex justify-center py-10"><div className="animate-spin h-5 w-5 border-2 border-indigo-600 border-t-transparent rounded-full" /></div>
            ) : (
              <ActivityFeed items={activityItems} />
            )}
          </Card>
        </div>
      </div>
    </>
  );
}
