import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../core/prisma/prisma.service';

@Injectable()
export class AnalyticsService {
  constructor(private prisma: PrismaService) {}

  async getKPIs() {
    // 1. Chiffre d'Affaires total (Toutes les ventes payées ou partielles)
    const sales = await this.prisma.invoice.findMany({
      where: { status: { in: ['PAID', 'PARTIAL'] } }
    });
    const totalRevenue = sales.reduce((acc, s) => acc + s.totalAmount, 0);

    // 2. Créances (Ce que les clients nous doivent : Total - amountPaid)
    const debtsFromCustomers = await this.prisma.invoice.findMany({
      where: { status: { in: ['PARTIAL', 'PENDING'] } }
    });
    const totalReceivables = debtsFromCustomers.reduce((acc, s) => acc + (s.totalAmount - s.amountPaid), 0);

    // 3. Marge Commerciale
    const invoiceLines = await this.prisma.invoiceLine.findMany({
      include: { product: true, invoice: true }
    });
    
    let totalCogs = 0;
    invoiceLines.forEach(line => {
      if (line.invoice.status !== 'CANCELLED' && line.invoice.status !== 'DRAFT') {
        totalCogs += line.quantity * line.product.costPrice;
      }
    });

    const commercialMargin = totalRevenue - totalCogs;

    return {
      totalRevenue,
      totalReceivables,
      commercialMargin,
      totalCogs
    };
  }

  async getSalesChart() {
    const invoices = await this.prisma.invoice.findMany({
      where: { status: { in: ['PAID', 'PARTIAL'] } },
      orderBy: { date: 'asc' }
    });

    const chartData: any = {};
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
}
