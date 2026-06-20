import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { StockMovementsService } from '../stock-movements/stock-movements.service';
import { CreatePurchaseOrderDto } from './dto/create-purchase-order.dto';
import { ReceivePurchaseOrderDto } from './dto/receive-purchase-order.dto';
import { MovementType } from '../stock-movements/dto/create-stock-movement.dto';

@Injectable()
export class PurchaseOrdersService {
  constructor(
    private prisma: PrismaService,
    private stockMovementsService: StockMovementsService
  ) {}

  async create(dto: CreatePurchaseOrderDto) {
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

  findAll() {
    return this.prisma.purchaseOrder.findMany({
      include: { supplier: true, receivingDepot: true },
      orderBy: { date: 'desc' }
    });
  }
}
