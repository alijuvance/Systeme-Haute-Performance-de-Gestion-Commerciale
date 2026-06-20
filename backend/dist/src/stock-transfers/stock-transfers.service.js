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
exports.StockTransfersService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const stock_movements_service_1 = require("../stock-movements/stock-movements.service");
const create_stock_movement_dto_1 = require("../stock-movements/dto/create-stock-movement.dto");
let StockTransfersService = class StockTransfersService {
    prisma;
    stockMovementsService;
    constructor(prisma, stockMovementsService) {
        this.prisma = prisma;
        this.stockMovementsService = stockMovementsService;
    }
    async dispatchTransfer(dto, userId) {
        await this.stockMovementsService.registerMovement({
            type: create_stock_movement_dto_1.MovementType.TRANSFER_OUT,
            reference: dto.reference,
            quantityChanged: -dto.quantity,
            productId: dto.productId,
            depotId: dto.fromDepotId,
        }, userId);
        return this.prisma.stockTransfer.create({
            data: {
                reference: dto.reference,
                quantity: dto.quantity,
                productId: dto.productId,
                fromDepotId: dto.fromDepotId,
                toDepotId: dto.toDepotId,
                dispatchedById: userId,
                status: 'IN_TRANSIT',
            }
        });
    }
    async receiveTransfer(transferId, userId) {
        const transfer = await this.prisma.stockTransfer.findUnique({ where: { id: transferId } });
        if (!transfer)
            throw new common_1.NotFoundException('Transfert introuvable');
        if (transfer.status !== 'IN_TRANSIT')
            throw new common_1.ConflictException(`Transfert déjà traité (Statut actuel: ${transfer.status})`);
        await this.stockMovementsService.registerMovement({
            type: create_stock_movement_dto_1.MovementType.TRANSFER_IN,
            reference: transfer.reference,
            quantityChanged: Math.abs(transfer.quantity),
            productId: transfer.productId,
            depotId: transfer.toDepotId,
        }, userId);
        return this.prisma.stockTransfer.update({
            where: { id: transferId },
            data: {
                status: 'COMPLETED',
                receivedById: userId,
                receivedAt: new Date(),
            }
        });
    }
    async findAll() {
        return this.prisma.stockTransfer.findMany({
            include: {
                product: true,
                fromDepot: true,
                toDepot: true,
                dispatchedBy: { select: { fullName: true } },
                receivedBy: { select: { fullName: true } },
            },
            orderBy: { dispatchedAt: 'desc' }
        });
    }
};
exports.StockTransfersService = StockTransfersService;
exports.StockTransfersService = StockTransfersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        stock_movements_service_1.StockMovementsService])
], StockTransfersService);
//# sourceMappingURL=stock-transfers.service.js.map