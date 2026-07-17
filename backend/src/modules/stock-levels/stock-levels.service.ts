import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../core/prisma/prisma.service';
import { PaginationQueryDto, paginate } from '../../common/dto/pagination-query.dto';

@Injectable()
export class StockLevelsService {
  constructor(private prisma: PrismaService) {}

  async findAll(depotId?: string, query: PaginationQueryDto = {}) {
    const { page = 1, limit = 20, search } = query;
    const skip = (page - 1) * limit;

    const where: any = {};
    if (depotId) where.depotId = depotId;
    if (search) {
      where.product = { name: { contains: search, mode: 'insensitive' } };
    }

    const [stockLevels, total] = await Promise.all([
      this.prisma.stockLevel.findMany({
        where,
        include: {
          product: { include: { category: true } },
          depot: true,
        },
        orderBy: { updatedAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.stockLevel.count({ where }),
    ]);

    // For each stock level, fetch the first and last stock movement dates
    const enriched = await Promise.all(
      stockLevels.map(async (sl) => {
        const [firstMovement, lastMovement] = await Promise.all([
          this.prisma.stockMovement.findFirst({
            where: { productId: sl.productId, depotId: sl.depotId },
            orderBy: { date: 'asc' },
            select: { date: true },
          }),
          this.prisma.stockMovement.findFirst({
            where: { productId: sl.productId, depotId: sl.depotId },
            orderBy: { date: 'desc' },
            select: { date: true },
          }),
        ]);

        return {
          ...sl,
          firstAddedAt: firstMovement?.date || sl.createdAt,
          lastAddedAt: lastMovement?.date || sl.updatedAt,
        };
      })
    );

    return paginate(enriched, total, page, limit);
  }
}
