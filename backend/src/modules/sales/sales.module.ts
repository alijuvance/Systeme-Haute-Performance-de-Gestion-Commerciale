import { Module } from '@nestjs/common';
import { SalesService } from './sales.service';
import { SalesController } from './sales.controller';
import { PrismaModule } from '../../core/prisma/prisma.module';
import { StockMovementsModule } from '../stock-movements/stock-movements.module';
import { CustomersModule } from '../customers/customers.module';

@Module({
  imports: [PrismaModule, StockMovementsModule, CustomersModule],
  controllers: [SalesController],
  providers: [SalesService],
})
export class SalesModule {}
