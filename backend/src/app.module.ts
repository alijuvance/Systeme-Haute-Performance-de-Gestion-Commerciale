import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './core/prisma/prisma.module';
import { AuthModule } from './modules/auth/auth.module';
import { CategoriesModule } from './modules/categories/categories.module';
import { ProductsModule } from './modules/products/products.module';
import { UsersModule } from './modules/users/users.module';
import { RolesModule } from './modules/roles/roles.module';
import { DepotsModule } from './modules/depots/depots.module';
import { StockLevelsModule } from './modules/stock-levels/stock-levels.module';
import { StockMovementsModule } from './modules/stock-movements/stock-movements.module';
import { StockTransfersModule } from './modules/stock-transfers/stock-transfers.module';
import { SuppliersModule } from './modules/suppliers/suppliers.module';
import { PurchaseOrdersModule } from './modules/purchase-orders/purchase-orders.module';
import { CustomersModule } from './modules/customers/customers.module';
import { SalesModule } from './modules/sales/sales.module';
import { AnalyticsModule } from './modules/analytics/analytics.module';
import { NotificationsModule } from './modules/notifications/notifications.module';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', '..', 'public'),
      serveRoot: '/public',
    }),
    PrismaModule, AuthModule, CategoriesModule, ProductsModule, UsersModule, RolesModule, DepotsModule, StockLevelsModule, StockMovementsModule, StockTransfersModule, SuppliersModule, PurchaseOrdersModule, CustomersModule, SalesModule, AnalyticsModule, NotificationsModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
