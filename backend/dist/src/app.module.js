"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const prisma_module_1 = require("./core/prisma/prisma.module");
const auth_module_1 = require("./modules/auth/auth.module");
const categories_module_1 = require("./modules/categories/categories.module");
const products_module_1 = require("./modules/products/products.module");
const users_module_1 = require("./modules/users/users.module");
const roles_module_1 = require("./modules/roles/roles.module");
const depots_module_1 = require("./modules/depots/depots.module");
const stock_levels_module_1 = require("./modules/stock-levels/stock-levels.module");
const stock_movements_module_1 = require("./modules/stock-movements/stock-movements.module");
const stock_transfers_module_1 = require("./modules/stock-transfers/stock-transfers.module");
const suppliers_module_1 = require("./modules/suppliers/suppliers.module");
const purchase_orders_module_1 = require("./modules/purchase-orders/purchase-orders.module");
const customers_module_1 = require("./modules/customers/customers.module");
const sales_module_1 = require("./modules/sales/sales.module");
const analytics_module_1 = require("./modules/analytics/analytics.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [prisma_module_1.PrismaModule, auth_module_1.AuthModule, categories_module_1.CategoriesModule, products_module_1.ProductsModule, users_module_1.UsersModule, roles_module_1.RolesModule, depots_module_1.DepotsModule, stock_levels_module_1.StockLevelsModule, stock_movements_module_1.StockMovementsModule, stock_transfers_module_1.StockTransfersModule, suppliers_module_1.SuppliersModule, purchase_orders_module_1.PurchaseOrdersModule, customers_module_1.CustomersModule, sales_module_1.SalesModule, analytics_module_1.AnalyticsModule],
        controllers: [app_controller_1.AppController],
        providers: [app_service_1.AppService],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map