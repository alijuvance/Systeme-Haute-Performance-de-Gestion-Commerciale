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
exports.NotificationsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../core/prisma/prisma.service");
let NotificationsService = class NotificationsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getNotifications() {
        const notifications = [];
        const lowStocks = await this.prisma.stockLevel.findMany({
            where: {
                minAlertQuantity: { gt: 0 },
            },
            include: {
                product: true,
                depot: true,
            },
        });
        const actuallyLowStocks = lowStocks.filter(sl => sl.quantity <= sl.minAlertQuantity);
        actuallyLowStocks.forEach(sl => {
            notifications.push({
                id: `low-stock-${sl.id}`,
                type: 'WARNING',
                title: 'Stock bas',
                message: `Le produit "${sl.product.name}" a atteint son seuil d'alerte (${sl.quantity} restant) dans le dépôt "${sl.depot.name}".`,
                link: '/dashboard/stocks',
                date: sl.updatedAt,
            });
        });
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        const unpaidInvoices = await this.prisma.invoice.findMany({
            where: {
                status: { in: ['PENDING', 'PARTIAL'] },
                date: { lt: thirtyDaysAgo },
            },
            include: {
                customer: true,
            },
        });
        unpaidInvoices.forEach(inv => {
            const remainingAmount = inv.totalAmount - inv.amountPaid;
            const customerName = inv.customer.companyName || inv.customer.fullName || 'Client inconnu';
            notifications.push({
                id: `unpaid-${inv.id}`,
                type: 'ERROR',
                title: 'Facture en souffrance',
                message: `La facture ${inv.invoiceNumber} de ${customerName} (Reste: ${remainingAmount.toLocaleString('fr-FR')} Ar) est impayée depuis plus de 30 jours.`,
                link: '/dashboard/sales',
                date: inv.date,
            });
        });
        return notifications.sort((a, b) => b.date.getTime() - a.date.getTime());
    }
};
exports.NotificationsService = NotificationsService;
exports.NotificationsService = NotificationsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], NotificationsService);
//# sourceMappingURL=notifications.service.js.map