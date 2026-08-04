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
  AlertTriangle, ArrowRight
} from 'lucide-react';

export default function DashboardPage() {
  const {
    kpis, chartData, lowStockAlerts, topProducts, salesByCategory, dailySummary,
    isLoading, error,
    period, setPeriod,
    startDate, setStartDate,
    endDate, setEndDate
  } = useDashboard();

  const revenueSparkline = chartData.slice(-7).map(d => d.amount || 0);

  return (
    <div className="space-y-6">
      {/* ─── Filters ─── */}
      <DashboardFilters
        period={period}
        setPeriod={setPeriod}
        startDate={startDate}
        setStartDate={setStartDate}
        endDate={endDate}
        setEndDate={setEndDate}
      />

      {/* ─── Error banner ─── */}
      {error && (
        <div className="p-3.5 text-[13px] text-red-700 bg-red-50 border border-red-200/60 rounded-lg ring-1 ring-inset ring-red-600/10 animate-slide-down">
          <span className="font-medium">Erreur :</span> {error}
        </div>
      )}

      {/* ═══════ KPI Cards ═══════ */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard
          title="Chiffre d'Affaires"
          value={formatCurrency(kpis?.totalRevenue)}
          icon={<DollarSign className="h-3.5 w-3.5 text-zinc-600" />}
          sparklineData={revenueSparkline}
          accentColor="#18181b"
          trend={dailySummary ? { value: dailySummary.revenueChange, label: 'vs hier' } : undefined}
        />
        <StatCard
          title="Marge Commerciale"
          value={formatCurrency(kpis?.commercialMargin)}
          icon={<TrendingUp className="h-3.5 w-3.5 text-emerald-600" />}
          iconBg="bg-emerald-50"
          accentColor="#059669"
          subtitle="Revenus déduits des coûts"
        />
        <StatCard
          title="Créances Clients"
          value={formatCurrency(kpis?.totalReceivables)}
          icon={<Users className="h-3.5 w-3.5 text-amber-600" />}
          iconBg="bg-amber-50"
          accentColor="#d97706"
          subtitle="Restant à recouvrer"
        />
        <StatCard
          title="Ventes du Jour"
          value={dailySummary ? `${dailySummary.todayInvoiceCount} factures` : '—'}
          icon={<ShoppingCart className="h-3.5 w-3.5 text-blue-600" />}
          iconBg="bg-blue-50"
          trend={dailySummary ? { value: dailySummary.countChange, label: 'vs hier' } : undefined}
          accentColor="#2563eb"
        />
      </div>

      {/* ═══════ Charts + Category Breakdown ═══════ */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
        <div className="lg:col-span-3">
          <DashboardCharts chartData={chartData} isLoading={isLoading} />
        </div>
        <div className="lg:col-span-2">
          <Card padding="lg" className="h-full">
            <CardHeader>
              <CardTitle>Ventes par Catégorie</CardTitle>
            </CardHeader>
            {salesByCategory.length > 0 ? (
              <div className="space-y-3.5">
                {salesByCategory.slice(0, 6).map((cat, i) => {
                  const maxVal = salesByCategory[0]?.value || 1;
                  const pct = (cat.value / maxVal) * 100;
                  const colors = [
                    'bg-zinc-900', 'bg-zinc-700', 'bg-zinc-500',
                    'bg-zinc-400', 'bg-zinc-300', 'bg-zinc-200'
                  ];
                  return (
                    <div key={cat.name}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[13px] font-medium text-zinc-700">{cat.name}</span>
                        <span className="text-[12px] text-zinc-500 tabular-nums">{formatCurrency(cat.value)}</span>
                      </div>
                      <div className="w-full h-1.5 bg-zinc-50 rounded-full overflow-hidden">
                        <div
                          className={`h-1.5 rounded-full ${colors[i] || 'bg-zinc-200'} transition-all duration-700 ease-out`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="flex items-center justify-center h-40 text-[13px] text-zinc-400">
                Aucune donnée disponible
              </div>
            )}
          </Card>
        </div>
      </div>

      {/* ═══════ Low Stock Alerts + Top Products ═══════ */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Low Stock Alerts */}
        <Card padding="lg">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-red-50 rounded-md flex items-center justify-center">
                  <AlertTriangle className="w-3.5 h-3.5 text-red-500" />
                </div>
                <CardTitle>Alertes Stock Bas</CardTitle>
                {lowStockAlerts.length > 0 && (
                  <Badge variant="danger" size="sm">{lowStockAlerts.length}</Badge>
                )}
              </div>
              <Link
                href="/dashboard/stocks"
                className="inline-flex items-center gap-1 text-[12px] text-zinc-400 hover:text-zinc-600 transition-colors duration-150"
              >
                Voir tout <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </CardHeader>
          {lowStockAlerts.length > 0 ? (
            <div>
              {lowStockAlerts.slice(0, 5).map((alert) => (
                <div key={alert.id} className="flex items-center justify-between py-3 border-b border-zinc-50 last:border-0">
                  <div className="min-w-0">
                    <p className="text-[13px] font-medium text-zinc-900 truncate">{alert.productName}</p>
                    <p className="text-[11px] text-zinc-400 mt-0.5">{alert.depotName} · {alert.sku}</p>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <div className="text-right">
                      <p className="text-[13px] font-semibold text-red-600 tabular-nums">{alert.quantity}</p>
                      <p className="text-[10px] text-zinc-400">seuil: {alert.minAlert}</p>
                    </div>
                    <Progress
                      value={(alert.quantity / (alert.minAlert || 1)) * 100}
                      variant="danger"
                      size="sm"
                      className="w-14"
                    />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex items-center justify-center h-28 text-[13px] text-zinc-400">
              <span className="inline-flex items-center gap-1.5">
                <span className="w-5 h-5 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-600 text-[11px]">✓</span>
                Tous les stocks sont au-dessus du seuil
              </span>
            </div>
          )}
        </Card>

        {/* Top Products */}
        <Card padding="lg">
          <CardHeader>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-zinc-100 rounded-md flex items-center justify-center">
                <Package className="w-3.5 h-3.5 text-zinc-500" />
              </div>
              <CardTitle>Top 5 Produits Vendus</CardTitle>
            </div>
          </CardHeader>
          {topProducts.length > 0 ? (
            <div>
              {topProducts.map((product, index) => {
                const maxQty = topProducts[0]?.totalQty || 1;
                return (
                  <div key={product.productId} className="flex items-center gap-3 py-3 border-b border-zinc-50 last:border-0">
                    {/* Rank */}
                    <span className={`
                      w-6 h-6 rounded-md flex items-center justify-center text-[11px] font-semibold flex-shrink-0
                      ${index === 0 ? 'bg-zinc-900 text-white' : 'bg-zinc-100 text-zinc-500'}
                    `}>
                      {index + 1}
                    </span>
                    {/* Product info */}
                    <div className="flex-1 min-w-0">
                      <p className="text-[13px] font-medium text-zinc-900 truncate">{product.name}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Progress
                          value={(product.totalQty / maxQty) * 100}
                          size="sm"
                          className="flex-1"
                        />
                        <span className="text-[11px] text-zinc-500 tabular-nums flex-shrink-0">{product.totalQty} u.</span>
                      </div>
                    </div>
                    {/* Revenue */}
                    <span className="text-[12px] font-medium text-zinc-500 tabular-nums flex-shrink-0">
                      {formatCurrency(product.totalRevenue)}
                    </span>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="flex items-center justify-center h-28 text-[13px] text-zinc-400">
              Aucune vente enregistrée
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
