import { Injectable, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../core/prisma/prisma.service';
import { CreateStockMovementDto } from './dto/create-stock-movement.dto';

@Injectable()
export class StockMovementsService {
  constructor(private prisma: PrismaService) {}

  async registerMovement(dto: CreateStockMovementDto, userId: string) {
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
        throw new ConflictException(`Stock insuffisant. Actuel: ${currentQuantity}, Demandé: ${Math.abs(dto.quantityChanged)}`);
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
}
