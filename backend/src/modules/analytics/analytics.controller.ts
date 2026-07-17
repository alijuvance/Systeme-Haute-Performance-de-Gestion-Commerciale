import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Controller, Get, UseGuards, Query } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('analytics')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(...['ADMIN', 'MANAGER'])
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('kpis')
  getKPIs(
    @Query('period') period?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return this.analyticsService.getKPIs(period, startDate, endDate);
  }

  @Get('sales-chart')
  getSalesChart(
    @Query('period') period?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return this.analyticsService.getSalesChart(period, startDate, endDate);
  }

  @Get('debts')
  getDebts() {
    return this.analyticsService.getDebts();
  }

  @Get('finance-kpis')
  getFinanceKPIs(
    @Query('period') period?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return this.analyticsService.getFinanceKPIs(period, startDate, endDate);
  }

  @Get('cashflow')
  getCashflowChart(
    @Query('period') period?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return this.analyticsService.getCashflowChart(period, startDate, endDate);
  }

  @Get('payables')
  getPayables() {
    return this.analyticsService.getPayables();
  }
}
