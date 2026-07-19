const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function main() {
  const u = await prisma.user.findUnique({where:{email:'admin@erp.com'}});
  const r = await prisma.role.findUnique({where:{id:u?.roleId}});
  console.log('USER ROLE:', u?.roleId, 'ROLE EXISTS:', !!r, 'ROLE NAME:', r?.name);
}
main().finally(() => prisma.$disconnect());
