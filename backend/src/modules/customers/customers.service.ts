import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../core/prisma/prisma.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { PaginationQueryDto, paginate } from '../../common/dto/pagination-query.dto';

@Injectable()
export class CustomersService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateCustomerDto) {
    return this.prisma.customer.create({ data: dto });
  }

  async findAll(query: PaginationQueryDto) {
    const { page = 1, limit = 20, search } = query;
    const skip = (page - 1) * limit;

    const where = search
      ? {
          OR: [
            { fullName: { contains: search, mode: 'insensitive' as const } },
            { companyName: { contains: search, mode: 'insensitive' as const } },
            { phone: { contains: search, mode: 'insensitive' as const } },
            { email: { contains: search, mode: 'insensitive' as const } },
          ],
        }
      : {};

    const [data, total] = await Promise.all([
      this.prisma.customer.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.customer.count({ where }),
    ]);

    return paginate(data, total, page, limit);
  }

  async update(id: string, data: UpdateCustomerDto) {
    return this.prisma.customer.update({
      where: { id },
      data,
    });
  }

  async remove(id: string) {
    return this.prisma.customer.delete({
      where: { id },
    });
  }

  async getOrCreateGenericPosCustomer() {
    let customer = await this.prisma.customer.findFirst({
      where: { fullName: 'Client Passant', type: 'B2C' }
    });
    
    if (!customer) {
      customer = await this.prisma.customer.create({
        data: {
          fullName: 'Client Passant',
          type: 'B2C',
        }
      });
    }
    return customer;
  }
}
