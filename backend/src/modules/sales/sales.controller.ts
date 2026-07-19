import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Controller, Get, Post, Body, UseGuards, Request, Query } from '@nestjs/common';
import { SalesService } from './sales.service';
import { CreateSaleDto } from './dto/create-sale.dto';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('sales')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(...['ADMIN', 'MANAGER', 'CASHIER', 'SALES'])
export class SalesController {
  constructor(private readonly salesService: SalesService) {}

  @Post()
  create(@Body() createSaleDto: CreateSaleDto, @Request() req: any) {
    return this.salesService.createSale(createSaleDto, req.user.userId);
  }

  @Get()
  findAll(@Query() query: PaginationQueryDto) {
    return this.salesService.findAll(query);
  }
}
