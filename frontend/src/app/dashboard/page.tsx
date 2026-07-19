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
  AlertTriangle, ArrowRight, Plus, Truck, FileText,
  Clock, Zap
} from 'lucide-react';

export default function DashboardPage() {
  const { 
    kpis, chartData, recentActivity, lowStockAlerts, topProducts, salesByCategory, dailySummary,
    isLoading, error,
    period, setPeriod,
    startDate, setStartDate,
    endDate, setEndDate
  } = useDashboard();

  // Generate fake sparkline data from chart data (last 7 points)
  const revenueSparkline = chartData.slice(-7).map(d => d.amount || 0);

  const formatRelativeTime = (timestamp: string) => {
    const now = new Date();
    const date = new Date(timestamp);
    const diff = Math.floor((now.getTime() - date.getTime()) / 1000);
    if (diff < 60) return 'à l\'instant';
    if (diff < 3600) return `il y a ${Math.floor(diff / 60)} min`;
    if (diff < 86400) return `il y a ${Math.floor(diff / 3600)}h`;
    return `il y a ${Math.floor(diff / 86400)}j`;
  };

  const getActionLabel = (action: string, entity: string) => {
    const actions: Record<string, string> = { CREATE: 'a créé', UPDATE: 'a modifié', DELETE: 'a supprimé' };
    const entities: Record<string, string> = {
      INVOICE: 'une facture', PRODUCT: 'un produit', CUSTOMER: 'un client',
      PURCHASE_ORDER: 'un achat', STOCK: 'un mouvement stock', AUTH: 'une connexion',
      PAYMENT: 'un paiement', CREDIT_NOTE: 'un avoir',
    };
    return `${actions[action] || action} ${entities[entity] || entity}`;
  };

  const getActionColor = (action: string) => {
    if (action === 'CREATE') return 'bg-emerald-500';
    if (action === 'DELETE') return 'bg-red-500';
    return 'bg-amber-500';
  };

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

      {/* ═══════ ROW 3: Activity Feed + Quick Actions ═══════ */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mb-6">
        {/* Recent Activity */}
        <div className="lg:col-span-3">
          <Card padding="lg">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-gray-400" />
                  <CardTitle>Activité Récente</CardTitle>
                </div>
                <Link href="/dashboard/settings/audit" className="text-xs text-gray-400 hover:text-gray-600 transition-colors">
                  Voir tout →
                </Link>
              </div>
            </CardHeader>
            {recentActivity.length > 0 ? (
              <div className="space-y-0">
                {recentActivity.slice(0, 8).map((activity) => (
                  <div key={activity.id} className="flex items-start gap-3 py-3 border-b border-gray-50 last:border-0">
                    {/* Timeline dot */}
                    <div className="flex flex-col items-center mt-1.5">
                      <div className={`w-2 h-2 rounded-full ${getActionColor(activity.action)}`} />
                    </div>
                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-700">
                        <span className="font-medium text-gray-900">{activity.user}</span>
                        {' '}{getActionLabel(activity.action, activity.entity)}
                      </p>
                    </div>
                    {/* Time */}
                    <span className="text-[11px] text-gray-400 whitespace-nowrap flex-shrink-0">
                      {formatRelativeTime(activity.timestamp)}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex items-center justify-center h-32 text-sm text-gray-400">
                Aucune activité récente
              </div>
            )}
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="lg:col-span-2">
          <Card padding="lg" className="h-full">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-amber-500" />
                <CardTitle>Actions Rapides</CardTitle>
              </div>
            </CardHeader>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'Nouvelle Vente', desc: 'Facture B2B', href: '/dashboard/sales/new', icon: <Plus className="w-5 h-5" />, color: 'bg-emerald-50 text-emerald-600 group-hover:bg-emerald-100' },
                { label: 'Caisse POS', desc: 'Vente directe', href: '/dashboard/pos', icon: <ShoppingCart className="w-5 h-5" />, color: 'bg-blue-50 text-blue-600 group-hover:bg-blue-100' },
                { label: 'Nouveau Client', desc: 'Ajouter un client', href: '/dashboard/customers', icon: <Users className="w-5 h-5" />, color: 'bg-violet-50 text-violet-600 group-hover:bg-violet-100' },
                { label: 'Nouvel Achat', desc: 'Commande fournisseur', href: '/dashboard/purchases', icon: <Truck className="w-5 h-5" />, color: 'bg-amber-50 text-amber-600 group-hover:bg-amber-100' },
                { label: 'Voir Stocks', desc: 'État des dépôts', href: '/dashboard/stocks', icon: <Package className="w-5 h-5" />, color: 'bg-gray-50 text-gray-600 group-hover:bg-gray-100' },
                { label: 'Finance', desc: 'Trésorerie', href: '/dashboard/finance', icon: <FileText className="w-5 h-5" />, color: 'bg-rose-50 text-rose-600 group-hover:bg-rose-100' },
              ].map((action) => (
                <Link
                  key={action.href}
                  href={action.href}
                  className="group flex flex-col items-center gap-2 p-4 rounded-xl border border-gray-100 hover:border-gray-200 hover:shadow-sm transition-all duration-200"
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${action.color}`}>
                    {action.icon}
                  </div>
                  <div className="text-center">
                    <p className="text-xs font-semibold text-gray-900">{action.label}</p>
                    <p className="text-[10px] text-gray-400">{action.desc}</p>
                  </div>
                </Link>
              ))}
            </div>
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
