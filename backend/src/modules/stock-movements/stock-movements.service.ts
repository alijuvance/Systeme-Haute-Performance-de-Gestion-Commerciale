import { Injectable, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../core/prisma/prisma.service';
import { CreateStockMovementDto } from './dto/create-stock-movement.dto';
import { PaginationQueryDto, paginate } from '../../common/dto/pagination-query.dto';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class StockMovementsService {
  constructor(
    private prisma: PrismaService,
    private eventEmitter: EventEmitter2
  ) {}

  async registerMovement(dto: CreateStockMovementDto, userId: string) {
    const movement = await this.prisma.$transaction(async (tx) => {
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

    this.eventEmitter.emit('notifications.refresh');
    return movement;
  }

  async findAll(query: PaginationQueryDto) {
    const { page = 1, limit = 20, search } = query;
    const skip = (page - 1) * limit;

    const where = search
      ? {
          OR: [
            { reference: { contains: search, mode: 'insensitive' as const } },
            { product: { name: { contains: search, mode: 'insensitive' as const } } },
          ],
        }
      : {};

    const [data, total] = await Promise.all([
      this.prisma.stockMovement.findMany({
        where,
        include: { product: true, depot: true, user: true },
        orderBy: { date: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.stockMovement.count({ where }),
    ]);

    return paginate(data, total, page, limit);
  }
}
