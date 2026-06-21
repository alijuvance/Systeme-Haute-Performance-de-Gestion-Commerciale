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

  console.log('✅ Seed successful: admin@erp.com / admin123');
  await app.close();
}

bootstrap();
