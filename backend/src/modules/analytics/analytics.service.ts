import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../core/prisma/prisma.service';

@Injectable()
export class AnalyticsService {
  constructor(private prisma: PrismaService) {}

  private getDateRange(period?: string, startDate?: string, endDate?: string) {
    if (period === 'custom' && startDate && endDate) {
      return { gte: new Date(startDate), lte: new Date(endDate) };
    }

    const now = new Date();
    let gte: Date;
    let lte = now;

    switch (period) {
      case 'today':
        gte = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        break;
      case 'week':
        gte = new Date(now);
        gte.setDate(now.getDate() - now.getDay()); // Start of current week (Sunday as start, adjust if Monday is needed)
        gte.setHours(0, 0, 0, 0);
        break;
      case 'month':
        gte = new Date(now.getFullYear(), now.getMonth(), 1);
        break;
      case 'year':
        gte = new Date(now.getFullYear(), 0, 1);
        break;
      default:
        return undefined; // No date filter
    }

    return { gte, lte };
  }

  async getKPIs(period?: string, startDate?: string, endDate?: string) {
    const dateFilter = this.getDateRange(period, startDate, endDate);
    const whereDate = dateFilter ? { date: dateFilter } : {};

    // 1. Chiffre d'Affaires total
    const revenueAgg = await this.prisma.invoice.aggregate({
      where: { status: { in: ['PAID', 'PARTIAL'] }, ...whereDate },
      _sum: { totalAmount: true },
    });
    const totalRevenue = revenueAgg._sum.totalAmount || 0;

    // 2. Créances Clients
    const receivablesAgg = await this.prisma.invoice.aggregate({
      where: { status: { in: ['PARTIAL', 'PENDING'] }, ...whereDate },
      _sum: { totalAmount: true, amountPaid: true },
    });
    const totalReceivables = (receivablesAgg._sum.totalAmount || 0) - (receivablesAgg._sum.amountPaid || 0);

    // 3. Marge Commerciale
    const invoiceLines = await this.prisma.invoiceLine.findMany({
      where: {
        invoice: { 
          status: { notIn: ['CANCELLED', 'DRAFT'] },
          ...whereDate
        }
      },
      include: { product: { select: { costPrice: true } } }
    });
    
    let totalCogs = 0;
    let totalRevFromLines = 0;
    invoiceLines.forEach(line => {
      totalCogs += line.quantity * line.product.costPrice;
      totalRevFromLines += line.quantity * line.unitPrice; // Use unitPrice for exact revenue if needed, or just use totalRevenue.
    });

    // We can use the totalRevenue from the invoice aggregate, minus COGS.
    // However, some invoices might have discounts not reflected in invoice lines if not properly set. 
    // Usually Margin = Revenue - COGS.
    const commercialMargin = totalRevenue - totalCogs;

    return {
      totalRevenue,
      totalReceivables,
      commercialMargin,
      totalCogs
    };
  }

  async getSalesChart(period?: string, startDate?: string, endDate?: string) {
    const dateFilter = this.getDateRange(period, startDate, endDate);
    const whereDate = dateFilter ? { date: dateFilter } : {};

    const invoices = await this.prisma.invoice.findMany({
      where: { status: { in: ['PAID', 'PARTIAL'] }, ...whereDate },
      orderBy: { date: 'asc' },
      select: { date: true, totalAmount: true }
    });

    const chartData: Record<string, number> = {};
    invoices.forEach(inv => {
      const date = inv.date.toISOString().split('T')[0];
      if (!chartData[date]) chartData[date] = 0;
      chartData[date] += inv.totalAmount;
    });

    return Object.keys(chartData).map(date => ({
      date,
      amount: chartData[date]
    }));
  }

  async getDebts() {
    return this.prisma.invoice.findMany({
      where: { status: { in: ['PARTIAL', 'PENDING'] } },
      include: { customer: true }
    });
  }

  async getFinanceKPIs(period?: string, startDate?: string, endDate?: string) {
    const dateFilter = this.getDateRange(period, startDate, endDate);
    const whereDate = dateFilter ? { date: dateFilter } : {};

    // 1. Agrégats sur les ventes
    const salesAgg = await this.prisma.invoice.aggregate({
      where: { ...whereDate },
      _sum: { amountPaid: true, totalAmount: true },
    });
    const totalSalesPaid = salesAgg._sum.amountPaid || 0;
    const totalSalesAmount = salesAgg._sum.totalAmount || 0;

    // 2. Agrégats sur les achats
    const purchasesAgg = await this.prisma.purchaseOrder.aggregate({
      where: { ...whereDate }, // Assuming purchase order has 'date' or we use 'createdAt'. Schema has 'date'.
      _sum: { amountPaid: true, totalAmount: true },
    });
    const totalPurchasesPaid = purchasesAgg._sum.amountPaid || 0;
    const totalPurchasesAmount = purchasesAgg._sum.totalAmount || 0;

    const netCash = totalSalesPaid - totalPurchasesPaid;
    const totalReceivables = totalSalesAmount - totalSalesPaid;
    const totalPayables = totalPurchasesAmount - totalPurchasesPaid;

    // 3. Marge
    const invoiceLines = await this.prisma.invoiceLine.findMany({
      where: {
        invoice: { 
          status: { notIn: ['CANCELLED', 'DRAFT'] },
          ...whereDate
        }
      },
      include: { product: { select: { costPrice: true } } }
    });
    
    let totalRevenue = 0;
    let totalCogs = 0;
    invoiceLines.forEach(line => {
      totalRevenue += line.quantity * line.unitPrice;
      totalCogs += line.quantity * line.product.costPrice;
    });

    return {
      netCash,
      totalReceivables,
      totalPayables,
      commercialMargin: totalRevenue - totalCogs
    };
  }

  async getCashflowChart(period?: string, startDate?: string, endDate?: string) {
    const dateFilter = this.getDateRange(period, startDate, endDate);
    const whereDate = dateFilter ? { date: dateFilter } : {};

    const invoices = await this.prisma.invoice.findMany({
      where: { status: { notIn: ['CANCELLED', 'DRAFT'] }, ...whereDate },
      select: { date: true, amountPaid: true }
    });
    const purchases = await this.prisma.purchaseOrder.findMany({
      where: { status: { notIn: ['CANCELLED', 'DRAFT'] }, ...whereDate },
      select: { date: true, amountPaid: true }
    });

    const chartMap: Record<string, { inflows: number; outflows: number }> = {};

    invoices.forEach(inv => {
      const date = inv.date.toISOString().split('T')[0];
      if (!chartMap[date]) chartMap[date] = { inflows: 0, outflows: 0 };
      chartMap[date].inflows += inv.amountPaid;
    });

    purchases.forEach(p => {
      const date = p.date.toISOString().split('T')[0];
      if (!chartMap[date]) chartMap[date] = { inflows: 0, outflows: 0 };
      chartMap[date].outflows += p.amountPaid;
    });

    return Object.keys(chartMap).sort().map(date => ({
      date,
      inflows: chartMap[date].inflows,
      outflows: chartMap[date].outflows
    }));
  }

  async getPayables() {
    return this.prisma.purchaseOrder.findMany({
      where: {
        status: { not: 'CANCELLED' },
      },
      include: { supplier: true },
    }).then(purchases => purchases.filter(p => (p.totalAmount - p.amountPaid) > 0));
  }

  /**
   * Dernières activités (audit log) pour le dashboard
   */
  async getRecentActivity() {
    try {
      const logs = await this.prisma.auditLog.findMany({
        take: 10,
        orderBy: { createdAt: 'desc' },
        include: { user: { select: { fullName: true, email: true } } },
      });
      return logs.map(log => ({
        id: log.id,
        action: log.action,
        entity: log.entity,
        entityId: log.entityId,
        user: log.user?.fullName || 'Système',
        timestamp: log.createdAt,
      }));
    } catch {
      // AuditLog might not exist yet (migration not run)
      return [];
    }
  }

  /**
   * Produits dont le stock est sous le seuil d'alerte
   */
  async getLowStockAlerts() {
    const stockLevels = await this.prisma.stockLevel.findMany({
      where: {
        minAlertQuantity: { gt: 0 },
      },
      include: {
        product: { select: { name: true, sku: true } },
        depot: { select: { name: true } },
      },
    });

    return stockLevels
      .filter(s => s.quantity <= (s.minAlertQuantity || 0))
      .map(s => ({
        id: s.id,
        productName: s.product.name,
        sku: s.product.sku,
        depotName: s.depot.name,
        quantity: s.quantity,
        minAlert: s.minAlertQuantity,
      }));
  }

  /**
   * Top 5 produits les plus vendus (par quantité)
   */
  async getTopProducts() {
    const lines = await this.prisma.invoiceLine.findMany({
      where: {
        invoice: { status: { notIn: ['CANCELLED', 'DRAFT'] } },
      },
      include: { product: { select: { name: true, sku: true } } },
    });

    const productMap: Record<string, { name: string; sku: string; totalQty: number; totalRevenue: number }> = {};
    lines.forEach(line => {
      if (!productMap[line.productId]) {
        productMap[line.productId] = { name: line.product.name, sku: line.product.sku, totalQty: 0, totalRevenue: 0 };
      }
      productMap[line.productId].totalQty += line.quantity;
      productMap[line.productId].totalRevenue += line.quantity * line.unitPrice;
    });

    return Object.entries(productMap)
      .sort(([, a], [, b]) => b.totalQty - a.totalQty)
      .slice(0, 5)
      .map(([id, data]) => ({ productId: id, ...data }));
  }

  /**
   * Répartition des ventes par catégorie de produit
   */
  async getSalesByCategory(period?: string, startDate?: string, endDate?: string) {
    const dateFilter = this.getDateRange(period, startDate, endDate);
    const whereDate = dateFilter ? { date: dateFilter } : {};

    const lines = await this.prisma.invoiceLine.findMany({
      where: {
        invoice: {
          status: { notIn: ['CANCELLED', 'DRAFT'] },
          ...whereDate,
        },
      },
      include: { product: { include: { category: { select: { name: true } } } } },
    });

    const catMap: Record<string, number> = {};
    lines.forEach(line => {
      const catName = line.product.category?.name || 'Sans catégorie';
      if (!catMap[catName]) catMap[catName] = 0;
      catMap[catName] += line.quantity * line.unitPrice;
    });

    return Object.entries(catMap)
      .sort(([, a], [, b]) => b - a)
      .map(([name, value]) => ({ name, value }));
  }

  /**
   * Résumé du jour vs hier (pour les variations %)
   */
  async getDailySummary() {
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterdayStart = new Date(todayStart);
    yesterdayStart.setDate(yesterdayStart.getDate() - 1);

    const [todaySales, yesterdaySales, todayInvoiceCount, yesterdayInvoiceCount] = await Promise.all([
      this.prisma.invoice.aggregate({
        where: { date: { gte: todayStart }, status: { notIn: ['CANCELLED', 'DRAFT'] } },
        _sum: { totalAmount: true },
      }),
      this.prisma.invoice.aggregate({
        where: { date: { gte: yesterdayStart, lt: todayStart }, status: { notIn: ['CANCELLED', 'DRAFT'] } },
        _sum: { totalAmount: true },
      }),
      this.prisma.invoice.count({
        where: { date: { gte: todayStart }, status: { notIn: ['CANCELLED', 'DRAFT'] } },
      }),
      this.prisma.invoice.count({
        where: { date: { gte: yesterdayStart, lt: todayStart }, status: { notIn: ['CANCELLED', 'DRAFT'] } },
      }),
    ]);

    const todayRevenue = todaySales._sum.totalAmount || 0;
    const yesterdayRevenue = yesterdaySales._sum.totalAmount || 0;
    const revenueChange = yesterdayRevenue > 0 ? ((todayRevenue - yesterdayRevenue) / yesterdayRevenue) * 100 : 0;
    const countChange = yesterdayInvoiceCount > 0 ? ((todayInvoiceCount - yesterdayInvoiceCount) / yesterdayInvoiceCount) * 100 : 0;

    return {
      todayRevenue,
      yesterdayRevenue,
      revenueChange,
      todayInvoiceCount,
      yesterdayInvoiceCount,
      countChange,
    };
  }
}
