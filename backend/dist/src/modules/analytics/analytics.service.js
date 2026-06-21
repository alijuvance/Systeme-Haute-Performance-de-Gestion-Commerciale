"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnalyticsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../core/prisma/prisma.service");
let AnalyticsService = class AnalyticsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getKPIs() {
        const sales = await this.prisma.invoice.findMany({
            where: { status: { in: ['PAID', 'PARTIAL'] } }
        });
        const totalRevenue = sales.reduce((acc, s) => acc + s.totalAmount, 0);
        const debtsFromCustomers = await this.prisma.invoice.findMany({
            where: { status: { in: ['PARTIAL', 'PENDING'] } }
        });
        const totalReceivables = debtsFromCustomers.reduce((acc, s) => acc + (s.totalAmount - s.amountPaid), 0);
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
        const chartData = {};
        invoices.forEach(inv => {
            const date = inv.date.toISOString().split('T')[0];
            if (!chartData[date])
                chartData[date] = 0;
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
};
exports.AnalyticsService = AnalyticsService;
exports.AnalyticsService = AnalyticsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AnalyticsService);
//# sourceMappingURL=analytics.service.js.map