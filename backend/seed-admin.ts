import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import * as dotenv from 'dotenv';

dotenv.config();

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter, errorFormat: 'pretty' });

async function main() {
  console.log('Seeding default Admin user...');

  // Ensure ADMIN role exists
  let adminRole = await prisma.role.findUnique({
    where: { name: 'ADMIN' }
  });

  if (!adminRole) {
    adminRole = await prisma.role.create({
      data: { name: 'ADMIN' }
    });
  }

  const email = 'alijuvance@gmail.com';
  const password = '91140000';
  const passwordHash = await bcrypt.hash(password, 10);

  const user = await prisma.user.upsert({
    where: { email },
    update: {
      passwordHash,
      roleId: adminRole.id,
      fullName: 'Admin Default',
      isActive: true,
    },
    create: {
      email,
      passwordHash,
      fullName: 'Admin Default',
      roleId: adminRole.id,
      isActive: true,
    }
  });

  console.log(`Default admin user configured: ${user.email}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
