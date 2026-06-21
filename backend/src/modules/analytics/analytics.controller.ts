import { Controller, Get, UseGuards } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('api/analytics')
@UseGuards(JwtAuthGuard)
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
}
