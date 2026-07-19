import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { join } from 'path';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuditInterceptor } from './core/interceptors/audit.interceptor';
import { PrismaModule } from './core/prisma/prisma.module';
import { CounterModule } from './core/counter/counter.module';
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
import { PaymentsModule } from './modules/payments/payments.module';
import { CreditNotesModule } from './modules/credit-notes/credit-notes.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { AuditLogsModule } from './modules/audit-logs/audit-logs.module';
import { SettingsModule } from './modules/settings/settings.module';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', '..', 'public'),
      serveRoot: '/public',
    }),
    // Rate Limiting global : 60 requêtes par minute par IP
    ThrottlerModule.forRoot([{
      ttl: 60000,
      limit: 60,
    }]),
    EventEmitterModule.forRoot(),
    PrismaModule, CounterModule, AuthModule, CategoriesModule, ProductsModule, UsersModule, RolesModule, DepotsModule, StockLevelsModule, StockMovementsModule, StockTransfersModule, SuppliersModule, PurchaseOrdersModule, CustomersModule, SalesModule, AnalyticsModule, NotificationsModule, PaymentsModule, CreditNotesModule, AuditLogsModule, SettingsModule
  ],
  controllers: [AppController],
  providers: [
    AppService,
    // Active le ThrottlerGuard globalement sur toutes les routes
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    // Intercepteur d'audit global
    {
      provide: APP_INTERCEPTOR,
      useClass: AuditInterceptor,
    },
  ],
})
export class AppModule {}
