import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { StockLevelsService } from './stock-levels.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('stock-levels')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(...['ADMIN'])
export class StockLevelsController {
  constructor(private readonly stockLevelsService: StockLevelsService) {}

  @Get()
  findAll(@Query('depotId') depotId?: string) {
    return this.stockLevelsService.findAll(depotId);
  }
}
