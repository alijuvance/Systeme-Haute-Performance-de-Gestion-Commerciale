import { Injectable, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../core/prisma/prisma.service';
import { StockMovementsService } from '../stock-movements/stock-movements.service';
import { CustomersService } from '../customers/customers.service';
import { CreateSaleDto } from './dto/create-sale.dto';
import { MovementType } from '../stock-movements/dto/create-stock-movement.dto';

@Injectable()
export class SalesService {
  constructor(
    private prisma: PrismaService,
    private stockMovementsService: StockMovementsService,
    private customersService: CustomersService
  ) {}

  async createSale(dto: CreateSaleDto, userId: string) {
    const invoiceNumber = `INV-${new Date().getFullYear()}-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`;
    
    let totalAmount = 0;
    dto.lines.forEach(line => { totalAmount += line.quantity * line.unitPrice; });

    let customerId = dto.customerId;
    if (dto.type === 'POS') {
      const posCustomer = await this.customersService.getOrCreateGenericPosCustomer();
      customerId = posCustomer.id;
    }

    if (!customerId) throw new ConflictException('Un client est requis pour cette vente.');

    const amountPaid = dto.type === 'POS' ? totalAmount : (dto.amountPaid || 0);
    let status = 'DRAFT';
    if (amountPaid >= totalAmount) status = 'PAID';
    else if (amountPaid > 0) status = 'PARTIAL';
    else if (amountPaid === 0) status = 'PENDING';

    for (const line of dto.lines) {
      await this.stockMovementsService.registerMovement({
        type: MovementType.OUT,
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
}
