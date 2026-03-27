const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function reset() {
  console.log('\n🔥 STARTING DATABASE RESET...\n');
  try {
    // Disable FK checks so we can delete in any order
    await prisma.$executeRaw`SET FOREIGN_KEY_CHECKS = 0`;

    // Clean up legacy tables that may still exist in DB
    await prisma.$executeRawUnsafe(`DELETE FROM \`Session\` WHERE 1=1`).catch(() => console.log('ℹ️  Session table not found (already cleaned)'));
    await prisma.$executeRawUnsafe(`DELETE FROM \`Speaker\` WHERE 1=1`).catch(() => console.log('ℹ️  Speaker table not found (already cleaned)'));
    await prisma.$executeRawUnsafe(`DELETE FROM \`Certificate\` WHERE 1=1`).catch(() => console.log('ℹ️  Certificate table not found (already cleaned)'));

    const n = await prisma.notification.deleteMany({});
    console.log(`✅ Deleted ${n.count} notifications`);

    const t = await prisma.ticket.deleteMany({});
    console.log(`✅ Deleted ${t.count} tickets`);

    const e = await prisma.event.deleteMany({});
    console.log(`✅ Deleted ${e.count} events`);

    const u = await prisma.user.deleteMany({
      where: { role: { not: 'ADMIN' } }
    });
    console.log(`✅ Deleted ${u.count} non-admin users`);

    // Re-enable FK checks
    await prisma.$executeRaw`SET FOREIGN_KEY_CHECKS = 1`;

    const remaining = await prisma.user.findMany({ select: { email: true, role: true } });
    console.log(`\n✅ Remaining users (admins only):`);
    remaining.forEach(u => console.log(`   → ${u.email} [${u.role}]`));

    console.log('\n🎉 DATABASE RESET COMPLETE. CLEAN SLATE READY.\n');
  } catch (error) {
    await prisma.$executeRaw`SET FOREIGN_KEY_CHECKS = 1`.catch(() => {});
    console.error('\n❌ Reset failed:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

reset();
