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
exports.StockMovementsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let StockMovementsService = class StockMovementsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async registerMovement(dto, userId) {
        return this.prisma.$transaction(async (tx) => {
            const stockLevel = await tx.stockLevel.findUnique({
                where: {
                    productId_depotId: {
                        productId: dto.productId,
                        depotId: dto.depotId,
                    }
                }
            });
            const currentQuantity = stockLevel ? stockLevel.quantity : 0;
            const newQuantity = currentQuantity + dto.quantityChanged;
            if (newQuantity < 0) {
                throw new common_1.ConflictException(`Stock insuffisant. Actuel: ${currentQuantity}, Demandé: ${Math.abs(dto.quantityChanged)}`);
            }
            await tx.stockLevel.upsert({
                where: {
                    productId_depotId: {
                        productId: dto.productId,
                        depotId: dto.depotId,
                    }
                },
                update: {
                    quantity: newQuantity,
                },
                create: {
                    productId: dto.productId,
                    depotId: dto.depotId,
                    quantity: newQuantity,
                }
            });
            return tx.stockMovement.create({
                data: {
                    type: dto.type,
                    reference: dto.reference,
                    quantityChanged: dto.quantityChanged,
                    userId,
                    productId: dto.productId,
                    depotId: dto.depotId,
                }
            });
        });
    }
    async findAll() {
        return this.prisma.stockMovement.findMany({
            include: { product: true, depot: true, user: true },
            orderBy: { date: 'desc' }
        });
    }
};
exports.StockMovementsService = StockMovementsService;
exports.StockMovementsService = StockMovementsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], StockMovementsService);
//# sourceMappingURL=stock-movements.service.js.map