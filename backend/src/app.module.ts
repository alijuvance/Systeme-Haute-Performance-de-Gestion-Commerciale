import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { CategoriesModule } from './categories/categories.module';
import { ProductsModule } from './products/products.module';
import { UsersModule } from './users/users.module';
import { RolesModule } from './roles/roles.module';
import { DepotsModule } from './depots/depots.module';
import { StockLevelsModule } from './stock-levels/stock-levels.module';
import { StockMovementsModule } from './stock-movements/stock-movements.module';
import { StockTransfersModule } from './stock-transfers/stock-transfers.module';

@Module({
  imports: [PrismaModule, AuthModule, CategoriesModule, ProductsModule, UsersModule, RolesModule, DepotsModule, StockLevelsModule, StockMovementsModule, StockTransfersModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
