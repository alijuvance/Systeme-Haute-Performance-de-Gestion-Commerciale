import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { PrismaService } from './core/prisma/prisma.service';
import * as bcrypt from 'bcrypt';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const prisma = app.get(PrismaService);
  
  console.log('🌱 Starting database seeding...');

  const adminRole = await prisma.role.upsert({
    where: { name: 'ADMIN' },
    update: {},
    create: { name: 'ADMIN', permissions: 'ALL' },
  });

  await prisma.role.upsert({
    where: { name: 'MANAGER' },
    update: {},
    create: { name: 'MANAGER', permissions: 'ALL' },
  });

  await prisma.role.upsert({
    where: { name: 'CASHIER' },
    update: {},
    create: { name: 'CASHIER', permissions: 'SALES_ONLY' },
  });

  await prisma.role.upsert({
    where: { name: 'INVENTORY' },
    update: {},
    create: { name: 'INVENTORY', permissions: 'INVENTORY_ONLY' },
  });
  const passwordHash = await bcrypt.hash('admin123', 10);
  
  const user = await prisma.user.upsert({
    where: { email: 'admin@erp.com' },
    update: { passwordHash },
    create: {
      email: 'admin@erp.com',
      passwordHash,
      fullName: 'Administrateur ERP',
      roleId: adminRole.id,
    },
  });
  // Seed default depot
  const depot = await prisma.depot.upsert({
    where: { id: 'depot-central-id' },
    update: {},
    create: { id: 'depot-central-id', name: 'Dépôt Central', location: 'Antananarivo', type: 'CENTRAL' },
  });

  // Seed default category
  const category = await prisma.category.upsert({
    where: { name: 'Général' },
    update: {},
    create: { name: 'Général' },
  });

  // Seed sequential counters
  await prisma.counter.upsert({
    where: { id: 'INVOICE' },
    update: {},
    create: { id: 'INVOICE', prefix: 'INV', lastValue: 0 },
  });

  await prisma.counter.upsert({
    where: { id: 'PURCHASE_ORDER' },
    update: {},
    create: { id: 'PURCHASE_ORDER', prefix: 'PO', lastValue: 0 },
  });

  console.log('✅ Seed successful: admin@erp.com / admin123');
  console.log('   Depot:', depot.name, '| Category:', category.name);
  console.log('   Counters: INVOICE, PURCHASE_ORDER initialized');
  await app.close();
}

bootstrap();
