import { Module } from '@nestjs/common';
import { StockLevelsController } from './stock-levels.controller';
import { StockLevelsService } from './stock-levels.service';

@Module({
  controllers: [StockLevelsController],
  providers: [StockLevelsService]
})
export class StockLevelsModule {}
