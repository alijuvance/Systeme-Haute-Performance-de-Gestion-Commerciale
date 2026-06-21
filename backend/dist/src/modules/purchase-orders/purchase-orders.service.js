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
exports.PurchaseOrdersService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../core/prisma/prisma.service");
const stock_movements_service_1 = require("../stock-movements/stock-movements.service");
const create_stock_movement_dto_1 = require("../stock-movements/dto/create-stock-movement.dto");
let PurchaseOrdersService = class PurchaseOrdersService {
    prisma;
    stockMovementsService;
    constructor(prisma, stockMovementsService) {
        this.prisma = prisma;
        this.stockMovementsService = stockMovementsService;
    }
    async create(dto) {
        const orderNumber = `PO-${new Date().getFullYear()}-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`;
        let totalAmount = 0;
        dto.lines.forEach(line => { totalAmount += line.quantity * line.unitPrice; });
        return this.prisma.purchaseOrder.create({
            data: {
                orderNumber,
                supplierId: dto.supplierId,
                totalAmount,
                lines: {
                    create: dto.lines.map(line => ({
                        productId: line.productId,
                        quantity: line.quantity,
                        unitPrice: line.unitPrice
                    }))
                }
            },
            include: { lines: true, supplier: true }
        });
    }
    async receive(id, dto, userId) {
        const order = await this.prisma.purchaseOrder.findUnique({
            where: { id },
            include: { lines: true }
        });
        if (!order)
            throw new common_1.NotFoundException('Commande introuvable');
        if (order.status === 'RECEIVED')
            throw new common_1.ConflictException('Commande déjà réceptionnée');
        const updatedOrder = await this.prisma.purchaseOrder.update({
            where: { id },
            data: {
                status: 'RECEIVED',
                receivingDepotId: dto.receivingDepotId
            }
        });
        for (const line of order.lines) {
            await this.stockMovementsService.registerMovement({
                type: create_stock_movement_dto_1.MovementType.IN,
                reference: `RECEPTION-${order.orderNumber}`,
                quantityChanged: line.quantity,
                productId: line.productId,
                depotId: dto.receivingDepotId
            }, userId);
        }
        return updatedOrder;
    }
    findAll() {
        return this.prisma.purchaseOrder.findMany({
            include: { supplier: true, receivingDepot: true },
            orderBy: { date: 'desc' }
        });
    }
};
exports.PurchaseOrdersService = PurchaseOrdersService;
exports.PurchaseOrdersService = PurchaseOrdersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        stock_movements_service_1.StockMovementsService])
], PurchaseOrdersService);
//# sourceMappingURL=purchase-orders.service.js.map