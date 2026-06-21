import { Module } from '@nestjs/common';
import { StockTransfersService } from './stock-transfers.service';
import { StockTransfersController } from './stock-transfers.controller';
import { StockMovementsModule } from '../stock-movements/stock-movements.module';

@Module({
  imports: [StockMovementsModule],
  controllers: [StockTransfersController],
  providers: [StockTransfersService],
})
export class StockTransfersModule {}
