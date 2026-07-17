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
}
