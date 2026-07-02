import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Controller, Get, UseGuards } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('analytics')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(...['ADMIN', 'MANAGER'])
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('kpis')
  getKPIs() {
    return this.analyticsService.getKPIs();
  }

  @Get('sales-chart')
  getSalesChart() {
    return this.analyticsService.getSalesChart();
  }

  @Get('debts')
  getDebts() {
    return this.analyticsService.getDebts();
  }

  @Get('finance-kpis')
  getFinanceKPIs() {
    return this.analyticsService.getFinanceKPIs();
  }

  @Get('cashflow')
  getCashflowChart() {
    return this.analyticsService.getCashflowChart();
  }

  @Get('payables')
  getPayables() {
    return this.analyticsService.getPayables();
  }
}
