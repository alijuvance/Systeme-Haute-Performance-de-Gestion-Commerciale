import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../core/prisma/prisma.service';
import { CreateSupplierDto } from './dto/create-supplier.dto';

@Injectable()
export class SuppliersService {
  constructor(private prisma: PrismaService) {}

  create(dto: CreateSupplierDto) {
    return this.prisma.supplier.create({ data: dto });
  }

  findAll() {
    return this.prisma.supplier.findMany({ orderBy: { name: 'asc' } });
  }

  async update(id: string, data: any) {
    return this.prisma.supplier.update({
      where: { id },
      data,
    });
  }

  async remove(id: string) {
    return this.prisma.supplier.delete({
      where: { id },
    });
  }
}
