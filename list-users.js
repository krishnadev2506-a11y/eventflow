const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
prisma.user.findMany({ select: { name: true, email: true, role: true } })
  .then(users => {
    console.log('Total users:', users.length);
    users.forEach(u => console.log(` - ${u.name} | ${u.email} | ${u.role}`));
    prisma.$disconnect();
  })
  .catch(e => { console.error(e.message); prisma.$disconnect(); });
