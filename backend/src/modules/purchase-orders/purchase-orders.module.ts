import { Module } from '@nestjs/common';
import { PurchaseOrdersService } from './purchase-orders.service';
import { PurchaseOrdersController } from './purchase-orders.controller';
import { PrismaModule } from '../../core/prisma/prisma.module';
import { StockMovementsModule } from '../stock-movements/stock-movements.module';

@Module({
  imports: [PrismaModule, StockMovementsModule],
  controllers: [PurchaseOrdersController],
  providers: [PurchaseOrdersService],
})
export class PurchaseOrdersModule {}
