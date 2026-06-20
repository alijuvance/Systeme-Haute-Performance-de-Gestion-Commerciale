import { Controller, Get, Post, Body, UseGuards, Request } from '@nestjs/common';
import { SalesService } from './sales.service';
import { CreateSaleDto } from './dto/create-sale.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('api/sales')
@UseGuards(JwtAuthGuard)
export class SalesController {
  constructor(private readonly salesService: SalesService) {}

  @Post()
  create(@Body() createSaleDto: CreateSaleDto, @Request() req: any) {
    return this.salesService.createSale(createSaleDto, req.user.userId);
  }

  @Get()
  findAll() {
    return this.salesService.findAll();
  }
}
