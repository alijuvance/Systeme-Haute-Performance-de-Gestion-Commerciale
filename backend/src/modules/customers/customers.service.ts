import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../core/prisma/prisma.service';
import { CreateCustomerDto } from './dto/create-customer.dto';

@Injectable()
export class CustomersService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateCustomerDto) {
    return this.prisma.customer.create({ data: dto });
  }

  findAll() {
    return this.prisma.customer.findMany({ orderBy: { createdAt: 'desc' } });
  }

  async update(id: string, data: any) {
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
