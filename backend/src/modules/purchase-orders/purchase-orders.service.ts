import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../core/prisma/prisma.service';
import { CounterService } from '../../core/counter/counter.service';
import { StockMovementsService } from '../stock-movements/stock-movements.service';
import { CreatePurchaseOrderDto } from './dto/create-purchase-order.dto';
import { ReceivePurchaseOrderDto } from './dto/receive-purchase-order.dto';
import { MovementType } from '../stock-movements/dto/create-stock-movement.dto';
import { PaginationQueryDto, paginate } from '../../common/dto/pagination-query.dto';

@Injectable()
export class PurchaseOrdersService {
  constructor(
    private prisma: PrismaService,
    private counterService: CounterService,
    private stockMovementsService: StockMovementsService
  ) {}

  async create(dto: CreatePurchaseOrderDto) {
    const orderNumber = await this.counterService.getNextNumber('PURCHASE_ORDER');
    
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

  async receive(id: string, dto: ReceivePurchaseOrderDto, userId: string) {
    const order = await this.prisma.purchaseOrder.findUnique({
      where: { id },
      include: { lines: true }
    });

    if (!order) throw new NotFoundException('Commande introuvable');
    if (order.status === 'RECEIVED') throw new ConflictException('Commande déjà réceptionnée');

    const updatedOrder = await this.prisma.purchaseOrder.update({
      where: { id },
      data: {
        status: 'RECEIVED',
        receivingDepotId: dto.receivingDepotId
      }
    });

    for (const line of order.lines) {
      await this.stockMovementsService.registerMovement({
        type: MovementType.IN,
        reference: `RECEPTION-${order.orderNumber}`,
        quantityChanged: line.quantity,
        productId: line.productId,
        depotId: dto.receivingDepotId
      }, userId);
    }

    return updatedOrder;
  }

  async findAll(query: PaginationQueryDto) {
    const { page = 1, limit = 20, search } = query;
    const skip = (page - 1) * limit;

    const where = search
      ? {
          OR: [
            { orderNumber: { contains: search, mode: 'insensitive' as const } },
            { supplier: { name: { contains: search, mode: 'insensitive' as const } } },
          ],
        }
      : {};

    const [data, total] = await Promise.all([
      this.prisma.purchaseOrder.findMany({
        where,
        include: { supplier: true, receivingDepot: true },
        orderBy: { date: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.purchaseOrder.count({ where }),
    ]);

    return paginate(data, total, page, limit);
  }

  async getPurchaseKPIs() {
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const monthOrders = await this.prisma.purchaseOrder.findMany({
      where: { date: { gte: startOfMonth }, status: { not: 'CANCELLED' } }
    });
    const monthSpent = monthOrders.reduce((sum, o) => sum + o.totalAmount, 0);

    const pendingReceiptCount = await this.prisma.purchaseOrder.count({
      where: { status: { in: ['DRAFT', 'SENT'] } }
    });

    const unpaidOrders = await this.prisma.purchaseOrder.findMany({
      where: { status: { not: 'CANCELLED' } }
    });
    let totalUnpaidAmount = 0;
    unpaidOrders.forEach(o => {
      totalUnpaidAmount += (o.totalAmount - o.amountPaid);
    });

    const activeOrdersCount = await this.prisma.purchaseOrder.count({
      where: { status: { not: 'CANCELLED' } }
    });

    return {
      monthSpent,
      pendingReceiptCount,
      totalUnpaidAmount,
      activeOrdersCount
    };
  }

  async recordPayment(id: string, amount: number) {
    const order = await this.prisma.purchaseOrder.findUnique({ where: { id } });
    if (!order) throw new NotFoundException('Commande introuvable');
    if (order.status === 'CANCELLED') throw new ConflictException('Commande annulée');

    const newAmountPaid = order.amountPaid + amount;
    if (newAmountPaid > order.totalAmount) {
      throw new ConflictException('Le montant payé ne peut pas dépasser le total de la commande.');
    }

    return this.prisma.purchaseOrder.update({
      where: { id },
      data: { amountPaid: newAmountPaid },
      include: { supplier: true, receivingDepot: true }
    });
  }
}
