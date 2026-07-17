import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Controller, Post, Get, Body, UseGuards, Request, Query } from '@nestjs/common';
import { StockMovementsService } from './stock-movements.service';
import { CreateStockMovementDto } from './dto/create-stock-movement.dto';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('stock-movements')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(...['ADMIN'])
export class StockMovementsController {
  constructor(private readonly stockMovementsService: StockMovementsService) {}

  @Post()
  create(@Body() dto: CreateStockMovementDto, @Request() req: any) {
    return this.stockMovementsService.registerMovement(dto, req.user.userId);
  }

  @Get()
  findAll(@Query() query: PaginationQueryDto) {
    return this.stockMovementsService.findAll(query);
  }
}
