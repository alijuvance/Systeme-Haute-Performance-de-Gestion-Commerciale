'use client';

import React from 'react';
import Link from 'next/link';
import { useDashboard } from '@/features/dashboard/hooks/useDashboard';
import { DashboardCharts } from '@/features/dashboard/components/DashboardCharts';
import { DashboardFilters } from '@/features/dashboard/components/DashboardFilters';
import { StatCard } from '@/components/shared/StatCard';
import { Card, CardHeader, CardTitle } from '@/components/shared/Card';
import { Badge } from '@/components/shared/Badge';
import { Progress } from '@/components/shared/Progress';
import { formatCurrency } from '@/utils/formatters';
import { 
  DollarSign, TrendingUp, Users, ShoppingCart, Package, 
  AlertTriangle 
} from 'lucide-react';

export default function DashboardPage() {
  const { 
    kpis, chartData, lowStockAlerts, topProducts, salesByCategory, dailySummary,
    isLoading, error,
    period, setPeriod,
    startDate, setStartDate,
    endDate, setEndDate
  } = useDashboard();

  // Generate sparkline data from chart data (last 7 days)
  const revenueSparkline = chartData.slice(-7).map(d => d.amount || 0);

  return (
    <>
      {/* Filters */}
      <DashboardFilters
        period={period}
        setPeriod={setPeriod}
        startDate={startDate}
        setStartDate={setStartDate}
        endDate={endDate}
        setEndDate={setEndDate}
      />

      {error && (
        <div className="p-4 mb-4 text-sm text-red-700 bg-red-50 border border-red-200 rounded-xl">
          <span className="font-medium">Erreur :</span> {error}
        </div>
      )}

      {/* ═══════ ROW 1: KPI StatCards with Sparklines ═══════ */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
        <StatCard
          title="Chiffre d'Affaires"
          value={formatCurrency(kpis?.totalRevenue)}
          icon={<DollarSign className="h-4 w-4 text-gray-600" />}
          sparklineData={revenueSparkline}
          accentColor="#111827"
          trend={dailySummary ? { value: dailySummary.revenueChange, label: 'vs hier' } : undefined}
        />
        <StatCard
          title="Marge Commerciale"
          value={formatCurrency(kpis?.commercialMargin)}
          icon={<TrendingUp className="h-4 w-4 text-emerald-600" />}
          iconBg="bg-emerald-50"
          accentColor="#059669"
          subtitle="Revenus déduits des coûts"
        />
        <StatCard
          title="Créances Clients"
          value={formatCurrency(kpis?.totalReceivables)}
          icon={<Users className="h-4 w-4 text-amber-600" />}
          iconBg="bg-amber-50"
          accentColor="#d97706"
          subtitle="Restant à recouvrer"
        />
        <StatCard
          title="Ventes du Jour"
          value={dailySummary ? `${dailySummary.todayInvoiceCount} factures` : '—'}
          icon={<ShoppingCart className="h-4 w-4 text-blue-600" />}
          iconBg="bg-blue-50"
          trend={dailySummary ? { value: dailySummary.countChange, label: 'vs hier' } : undefined}
          accentColor="#2563eb"
        />
      </div>

      {/* ═══════ ROW 2: Charts side by side ═══════ */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mb-6">
        <div className="lg:col-span-3">
          <DashboardCharts chartData={chartData} isLoading={isLoading} />
        </div>
        <div className="lg:col-span-2">
          <Card padding="lg" className="h-full">
            <CardHeader>
              <CardTitle>Ventes par Catégorie</CardTitle>
            </CardHeader>
            {salesByCategory.length > 0 ? (
              <div className="space-y-3">
                {salesByCategory.slice(0, 6).map((cat, i) => {
                  const maxVal = salesByCategory[0]?.value || 1;
                  const pct = (cat.value / maxVal) * 100;
                  const colors = ['bg-gray-900', 'bg-gray-700', 'bg-gray-500', 'bg-gray-400', 'bg-gray-300', 'bg-gray-200'];
                  return (
                    <div key={cat.name}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium text-gray-700">{cat.name}</span>
                        <span className="text-xs text-gray-500 tabular-nums">{formatCurrency(cat.value)}</span>
                      </div>
                      <div className="w-full h-2 bg-gray-50 rounded-full overflow-hidden">
                        <div 
                          className={`h-2 rounded-full ${colors[i] || 'bg-gray-200'} transition-all duration-500`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="flex items-center justify-center h-40 text-sm text-gray-400">
                Aucune donnée disponible
              </div>
            )}
          </Card>
        </div>
      </div>



      {/* ═══════ ROW 4: Low Stock Alerts + Top Products ═══════ */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Low Stock Alerts */}
        <Card padding="lg">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-red-500" />
                <CardTitle>Alertes Stock Bas</CardTitle>
                {lowStockAlerts.length > 0 && (
                  <Badge variant="danger" size="sm">{lowStockAlerts.length}</Badge>
                )}
              </div>
              <Link href="/dashboard/stocks" className="text-xs text-gray-400 hover:text-gray-600 transition-colors">
                Voir tout →
              </Link>
            </div>
          </CardHeader>
          {lowStockAlerts.length > 0 ? (
            <div className="space-y-0">
              {lowStockAlerts.slice(0, 5).map((alert) => (
                <div key={alert.id} className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{alert.productName}</p>
                    <p className="text-xs text-gray-400">{alert.depotName} · {alert.sku}</p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <div className="text-right">
                      <p className="text-sm font-semibold text-red-600 tabular-nums">{alert.quantity}</p>
                      <p className="text-[10px] text-gray-400">seuil: {alert.minAlert}</p>
                    </div>
                    <Progress 
                      value={(alert.quantity / (alert.minAlert || 1)) * 100} 
                      variant="danger" 
                      size="sm" 
                      className="w-16" 
                    />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex items-center justify-center h-32 text-sm text-gray-400">
              ✓ Tous les stocks sont au-dessus du seuil
            </div>
          )}
        </Card>

        {/* Top Products */}
        <Card padding="lg">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Package className="w-4 h-4 text-gray-400" />
              <CardTitle>Top 5 Produits Vendus</CardTitle>
            </div>
          </CardHeader>
          {topProducts.length > 0 ? (
            <div className="space-y-0">
              {topProducts.map((product, index) => {
                const maxQty = topProducts[0]?.totalQty || 1;
                return (
                  <div key={product.productId} className="flex items-center gap-3 py-3 border-b border-gray-50 last:border-0">
                    {/* Rank */}
                    <span className={`
                      w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0
                      ${index === 0 ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-500'}
                    `}>
                      {index + 1}
                    </span>
                    {/* Product info */}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{product.name}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Progress 
                          value={(product.totalQty / maxQty) * 100} 
                          size="sm" 
                          className="flex-1" 
                        />
                        <span className="text-xs text-gray-500 tabular-nums flex-shrink-0">{product.totalQty} unités</span>
                      </div>
                    </div>
                    {/* Revenue */}
                    <span className="text-xs font-medium text-gray-500 tabular-nums flex-shrink-0">
                      {formatCurrency(product.totalRevenue)}
                    </span>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="flex items-center justify-center h-32 text-sm text-gray-400">
              Aucune vente enregistrée
            </div>
          )}
        </Card>
      </div>
    </>
  );
}
