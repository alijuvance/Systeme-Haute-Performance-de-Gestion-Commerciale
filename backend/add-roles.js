const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function addRoles() {
  const roles = [
    { name: 'MANAGER', permissions: 'ALL' },
    { name: 'CASHIER', permissions: 'SALES_ONLY' },
    { name: 'SALES', permissions: 'SALES_ONLY' },
    { name: 'INVENTORY', permissions: 'INVENTORY_ONLY' }
  ];

  for (const role of roles) {
    await prisma.role.upsert({
      where: { name: role.name },
      update: {},
      create: role
    });
    console.log(`Role ${role.name} added/verified`);
  }
}

addRoles()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
