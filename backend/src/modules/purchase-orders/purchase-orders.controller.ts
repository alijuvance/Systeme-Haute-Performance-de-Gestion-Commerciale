import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Controller, Get, Post, Body, Param, Put, UseGuards, Request } from '@nestjs/common';
import { PurchaseOrdersService } from './purchase-orders.service';
import { CreatePurchaseOrderDto } from './dto/create-purchase-order.dto';
import { ReceivePurchaseOrderDto } from './dto/receive-purchase-order.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('purchase-orders')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(...['ADMIN'])
export class PurchaseOrdersController {
  constructor(private readonly purchaseOrdersService: PurchaseOrdersService) {}

  @Post()
  create(@Body() createPurchaseOrderDto: CreatePurchaseOrderDto) {
    return this.purchaseOrdersService.create(createPurchaseOrderDto);
  }

  @Get()
  findAll() {
    return this.purchaseOrdersService.findAll();
  }

  @Put(':id/receive')
  receive(@Param('id') id: string, @Body() receiveDto: ReceivePurchaseOrderDto, @Request() req: any) {
    return this.purchaseOrdersService.receive(id, receiveDto, req.user.userId);
  }

  @Get('kpis')
  getPurchaseKPIs() {
    return this.purchaseOrdersService.getPurchaseKPIs();
  }

  @Put(':id/pay')
  recordPayment(@Param('id') id: string, @Body('amount') amount: number) {
    return this.purchaseOrdersService.recordPayment(id, amount);
  }
}
