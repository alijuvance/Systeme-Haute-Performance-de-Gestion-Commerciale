import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { DepotsService } from './depots.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('depots')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(...['ADMIN', 'MANAGER', 'CASHIER', 'SALES', 'INVENTORY'])
export class DepotsController {
  constructor(private readonly depotsService: DepotsService) {}

  @Get()
  findAll() {
    return this.depotsService.findAll();
  }

  @Post()
  create(@Body() body: { name: string; location?: string; type: string }) {
    return this.depotsService.create(body);
  }
}
