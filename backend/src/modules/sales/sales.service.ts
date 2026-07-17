import { Injectable, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../core/prisma/prisma.service';
import { CounterService } from '../../core/counter/counter.service';
import { StockMovementsService } from '../stock-movements/stock-movements.service';
import { CustomersService } from '../customers/customers.service';
import { CreateSaleDto } from './dto/create-sale.dto';
import { MovementType } from '../stock-movements/dto/create-stock-movement.dto';
import { PaginationQueryDto, paginate } from '../../common/dto/pagination-query.dto';

@Injectable()
export class SalesService {
  constructor(
    private prisma: PrismaService,
    private counterService: CounterService,
    private stockMovementsService: StockMovementsService,
    private customersService: CustomersService
  ) {}

  async createSale(dto: CreateSaleDto, userId: string) {
    // Numéro séquentiel unique garanti (remplace Math.random())
    const invoiceNumber = await this.counterService.getNextNumber('INVOICE');
    
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
        quantityChanged: -line.quantity,
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

  async findAll(query: PaginationQueryDto) {
    const { page = 1, limit = 20, search } = query;
    const skip = (page - 1) * limit;

    const where = search
      ? {
          OR: [
            { invoiceNumber: { contains: search, mode: 'insensitive' as const } },
            { customer: { fullName: { contains: search, mode: 'insensitive' as const } } },
            { customer: { companyName: { contains: search, mode: 'insensitive' as const } } },
          ],
        }
      : {};

    const [data, total] = await Promise.all([
      this.prisma.invoice.findMany({
        where,
        include: { 
          customer: true, 
          depot: true,
          lines: { include: { product: true } }
        },
        orderBy: { date: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.invoice.count({ where }),
    ]);

    return paginate(data, total, page, limit);
  }
}
