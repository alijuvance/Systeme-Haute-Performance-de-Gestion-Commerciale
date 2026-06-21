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
exports.SalesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../core/prisma/prisma.service");
const stock_movements_service_1 = require("../stock-movements/stock-movements.service");
const customers_service_1 = require("../customers/customers.service");
const create_stock_movement_dto_1 = require("../stock-movements/dto/create-stock-movement.dto");
let SalesService = class SalesService {
    prisma;
    stockMovementsService;
    customersService;
    constructor(prisma, stockMovementsService, customersService) {
        this.prisma = prisma;
        this.stockMovementsService = stockMovementsService;
        this.customersService = customersService;
    }
    async createSale(dto, userId) {
        const invoiceNumber = `INV-${new Date().getFullYear()}-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`;
        let totalAmount = 0;
        dto.lines.forEach(line => { totalAmount += line.quantity * line.unitPrice; });
        let customerId = dto.customerId;
        if (dto.type === 'POS') {
            const posCustomer = await this.customersService.getOrCreateGenericPosCustomer();
            customerId = posCustomer.id;
        }
        if (!customerId)
            throw new common_1.ConflictException('Un client est requis pour cette vente.');
        const amountPaid = dto.type === 'POS' ? totalAmount : (dto.amountPaid || 0);
        let status = 'DRAFT';
        if (amountPaid >= totalAmount)
            status = 'PAID';
        else if (amountPaid > 0)
            status = 'PARTIAL';
        else if (amountPaid === 0)
            status = 'PENDING';
        for (const line of dto.lines) {
            await this.stockMovementsService.registerMovement({
                type: create_stock_movement_dto_1.MovementType.OUT,
                reference: `VENTE-${invoiceNumber}`,
                quantityChanged: line.quantity,
                productId: line.productId,
                depotId: dto.depotId
            }, userId);
        }
        return this.prisma.invoice.create({
            data: {
                invoiceNumber,
                type: dto.type,
                status,
                totalAmount,
                amountPaid,
                customerId,
                depotId: dto.depotId,
                lines: {
                    create: dto.lines.map(line => ({
                        productId: line.productId,
                        quantity: line.quantity,
                        unitPrice: line.unitPrice
                    }))
                }
            },
            include: { lines: true, customer: true }
        });
    }
    findAll() {
        return this.prisma.invoice.findMany({
            include: { customer: true, depot: true },
            orderBy: { date: 'desc' }
        });
    }
};
exports.SalesService = SalesService;
exports.SalesService = SalesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        stock_movements_service_1.StockMovementsService,
        customers_service_1.CustomersService])
], SalesService);
//# sourceMappingURL=sales.service.js.map